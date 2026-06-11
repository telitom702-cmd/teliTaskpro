const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(config.MONGO_URI);

// Bot Initialization
const bot = new TelegramBot(config.BOT_TOKEN);
bot.setWebHook(`https://your-domain.com/webhook/bot`);

// --- 🚀 START COMMAND ---
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    
    // Duplicate Account Protection (Device/IP check করতে হবে Mini App থেকে ডাটা আসলে)
    let user = await User.findOne({ userId: chatId });
    if (!user) {
        user = new User({ userId: chatId, username: msg.from.username });
        await user.save();
        // নতুন ইউজার এড হলে Summary আপডেট
        updateGroupSummary(); 
    }

    if (user.isBanned) {
        return bot.sendMessage(chatId, "🚫 আপনার অ্যাকাউন্ট ব্যান করা হয়েছে।");
    }

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📱 Open TeliTask App", web_app: { url: "https://your-mini-app-url.com" } }]
            ]
        }
    };
    bot.sendMessage(chatId, "👋 স্বাগতম, Hi! TeliTask Pro-তে আপনাকে স্বাগতম। টাস্ক করুন, পয়েন্ট অর্জন করুন এবং সহজেই টাকা উত্তোলন করুন! নিচের বাটনে ক্লিক করে অ্যাপটি খুলুন 👇", opts);
});

// --- 📊 GROUP SUMMARY AUTO-UPDATE LOGIC ---
async function updateGroupSummary() {
    const totalUsers = await User.countDocuments();
    const today = new Date(); today.setHours(0,0,0,0);
    const todayUsers = await User.countDocuments({ joinedAt: { $gte: today } });
    const completedTasks = await Task.aggregate([{ $unwind: "$completedBy" }, { $count: "total" }]);
    const totalPayout = await Withdraw.aggregate([{ $match: { status: 'Approved' } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

    const text = `📊 *TeliTask Pro Live Summary*\n\n👥 Total Users: *${totalUsers}*\n🆕 Today's New Users: *${todayUsers}*\n✅ Completed Tasks: *${completedTasks[0]?.total || 0}*\n💰 Total Payout: *${totalPayout[0]?.total || 0} ৳*\n\n🕒 Last Update: ${new Date().toLocaleTimeString()}`;

    // যদি আগে থেকে মেসেজ থাকে, এডিট করবে
    if (config.SUMMARY_MESSAGE_ID) {
        bot.editMessageText(text, { chat_id: config.GROUP_ID, message_id: config.SUMMARY_MESSAGE_ID, parse_mode: "Markdown" })
          .catch(err => console.log("Edit error:", err.message));
    } else {
        // প্রথমবার নতুন মেসেজ পাঠাবে
        bot.sendMessage(config.GROUP_ID, text, { parse_mode: "Markdown" }).then(sent => {
            config.SUMMARY_MESSAGE_ID = sent.message_id; // সেভ করে রাখা
        });
    }
}

// --- ⚙️ WEBHOOK ROUTE (Mini App থেকে ডাটা আসবে) ---
app.post('/webhook/bot', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// --- 👨‍💼 ADMIN APIs (Example: Ban User, Task Management) ---
app.post('/api/admin/ban-user', async (req, res) => {
    const { adminId, targetUserId } = req.body;
    if (!config.ADMIN_IDS.includes(adminId)) return res.status(403).send("Unauthorized");
    
    await User.updateOne({ userId: targetUserId }, { isBanned: true });
    res.send({ success: true, message: "User Banned" });
});

app.post('/api/admin/toggle-task-reward', async (req, res) => {
    const { adminId, taskId } = req.body;
    if (!config.ADMIN_IDS.includes(adminId)) return res.status(403).send("Unauthorized");
    
    const task = await Task.findById(taskId);
    if(task) {
        task.isActive = !task.isActive; // Toggle Reward
        await task.save();
        res.send({ success: true, isActive: task.isActive });
    }
});

// --- 💰 WITHDRAW WEBHOOK (Mini App থেকে রিকোয়েস্ট আসবে) ---
app.post('/api/withdraw', async (req, res) => {
    const { userId, method, amount, accountNo } = req.body;
    const user = await User.findOne({ userId });
    
    if(user.balance < amount) return res.status(400).send("Insufficient balance");
    
    // Balance কেটে উইথড্র ডিবিতে পেন্ডিং রাখা
    user.balance -= amount;
    await user.save();
    
    const withdraw = new Withdraw({ userId, method, amount, accountNo });
    await withdraw.save();
    
    // এডমিনকে নোটিফিকেশন পাঠানো
    config.ADMIN_IDS.forEach(admin => {
        bot.sendMessage(admin, `🆕 New Withdraw Request!\nUser: ${userId}\nAmount: ${amount}\nMethod: ${method}`);
    });

    res.send({ success: true, message: "Withdrawal requested" });
});


// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
