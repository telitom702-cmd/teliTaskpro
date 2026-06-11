const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Telegram ID
    username: String,
    balance: { type: Number, default: 0 },
    deviceIds: [String], // ডিভাইস আইডির লিস্ট
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    lastIP: String,
    lastVPN: Boolean // VPN ব্যবহার করছে কিনা
});
module.exports = mongoose.model('User', userSchema);
