const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const User = require('./models/User');
const updateGroupSummary = require('./utils/groupSummary');

const bot = new TelegramBot(config.BOT_TOKEN);

// /start কমান্ড
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    
    let user = await User.findOne({ userId: chatId });
    if (!user) {
        user = new User({ userId: chatId, username: msg.from.username });
        await user.save();
        updateGroupSummary(); // নতুন ইউজার এলে সামারি আপডেট
    }

    if (user.isBanned) return bot.sendMessage(chatId, "🚫 আপনার অ্যাকাউন্ট ব্যান করা হয়েছে।");

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📱 Open TeliTask App", web_app: { url: config.APP_URL } }]
            ]
        }
    };
    bot.sendMessage(chatId, `👋 স্বাগতম, Hi! ${config.APP_NAME}-তে আপনাকে স্বাগতম। টাস্ক করুন, পয়েন্ট অর্জন করুন এবং সহজেই টাকা উত্তোলন করুন! নিচের বাটনে ক্লিক করে অ্যাপটি খুলুন 👇`, opts);
});

module.exports = bot;
