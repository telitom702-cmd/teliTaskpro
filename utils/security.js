const User = require('../models/User');

async function checkDuplicateAndVPN(req, res, next) {
    const { userId, deviceId, ip, isVPN } = req.body;

    // ১. VPN Check
    if (isVPN) {
        return res.status(403).json({ error: "VPN usage detected. Please turn off VPN." });
    }

    // ২. Duplicate Account Check (একই ডিভাইসে একাধিক অ্যাকাউন্ট)
    const existingDevice = await User.findOne({ deviceIds: deviceId });
    if (existingDevice && existingDevice.userId !== userId) {
        await User.updateOne({ userId: existingDevice.userId }, { isBanned: true }); // আগের অ্যাকাউন্ট ব্যান
        return res.status(403).json({ error: "Duplicate account detected!" });
    }

    // ডিভাইস আইডি ইউজারের লিস্টে অ্যাড করা
    await User.updateOne({ userId: userId }, { $addToSet: { deviceIds: deviceId } });
    
    next();
}

module.exports = { checkDuplicateAndVPN };
