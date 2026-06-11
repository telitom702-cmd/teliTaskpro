const User = require('../models/User');
const Task = require('../models/Task');
const Withdraw = require('../models/Withdraw');
const config = require('../config/config');
const bot = require('../bot'); // বট ইনস্ট্যান্স এখানে ইম্পোর্ট করতে হবে

async function updateGroupSummary() {
    try {
        const totalUsers = await User.countDocuments();
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayUsers = await User.countDocuments({ joinedAt: { $gte: today } });
        
        const completedTasks = await Task.aggregate([{ $unwind: "$completedBy" }, { $count: "total" }]);
        const totalPayout = await Withdraw.aggregate([
            { $match: { status: 'Approved' } }, 
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const text = `📊 *${config.APP_NAME} Live Summary*\n\n👥 Total Users: *${totalUsers}*\n🆕 Today's New Users: *${todayUsers}*\n✅ Completed Tasks: *${completedTasks[0]?.total || 0}*\n💰 Total Payout: *${totalPayout[0]?.total || 0} ৳*\n\n🕒 Last Update: ${new Date().toLocaleTimeString()}`;

        for (const groupId of config.GROUP_IDS) {
            try {
                const msgId = config.SUMMARY_MESSAGE_IDS[groupId];
                if (msgId) {
                    await bot.editMessageText(text, { chat_id: groupId, message_id: msgId, parse_mode: "Markdown" });
                } else {
                    const sentMsg = await bot.sendMessage(groupId, text, { parse_mode: "Markdown" });
                    config.SUMMARY_MESSAGE_IDS[groupId] = sentMsg.message_id;
                }
            } catch (err) {
                // যদি আগের মেসেজ ডিলিট করা হয়ে থাকে, তবে নতুন মেসেজ পাঠাবে
                if (err.response && err.response.statusCode === 400) {
                    const sentMsg = await bot.sendMessage(groupId, text, { parse_mode: "Markdown" });
                    config.SUMMARY_MESSAGE_IDS[groupId] = sentMsg.message_id;
                } else {
                    console.error(`Group Summary Error for ${groupId}:`, err.message);
                }
            }
        }
    } catch (error) {
        console.error("Summary Update Error:", error);
    }
}

module.exports = updateGroupSummary;
