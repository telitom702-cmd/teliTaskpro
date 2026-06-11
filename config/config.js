/**
 * TeliTask Pro - Configuration File
 * এই ফাইলে সিস্টেমের সমস্ত সেনসিটিভ তথ্য এবং সেটিংস রাখা হয়েছে।
 * সিকিউরিটির জন্য লাইভ সার্ভারে .env ফাইল ব্যবহার করা উচিত।
 */

require('dotenv').config(); // .env ফাইল থেকে ভ্যারিয়েবল রিড করার জন্য (ঐচ্ছিক কিন্তু রিকমেন্ডেড)

module.exports = {
    
    // --- 🤖 Telegram Bot Settings ---
    BOT_TOKEN: process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN', // আপনার টেলিগ্রাম বট টোকেন
    
    // --- 👨‍💼 Admin Settings ---
    // যাদের Telegram ID এখানে দেওয়া থাকবে, শুধু তারাই এডমিন প্যানেল দেখতে পারবে এবং সব কন্ট্রোল করতে পারবে
    ADMIN_IDS: [
        123456789,  // আপনার টেলিগ্রাম আইডি (এখানে নাম্বার দিবেন, স্ট্রিং না)
        987654321   // অন্য কোনো এডমিনের আইডি (প্রয়োজন হলে দিন, না হলে মুছে দিন)
    ],

    // --- 📊 Group Summary Settings ---
    // যে গ্রুপগুলোতে লাইভ সামারি মেসেজ আপডেট হবে (লক্ষ্য: সুপারগ্রুপের আইডি -১০০ দিয়ে শুরু হয়)
    GROUP_IDS: [
        -1001234567890,  // আপনার মূল টেলিগ্রাম গ্রুপের আইডি
        // -1009876543210  // আরও গ্রুপ থাকলে এখানে যোগ করতে পারেন
    ],

    // বট স্বয়ংক্রিয়ভাবে যে মেসেজগুলো এডিট করবে তাদের আইডি এখানে সেভ হবে (হাতে কিছু দিতে হবে না)
    SUMMARY_MESSAGE_IDS: {}, 

    // --- 🗄️ Database Settings ---
    // MongoDB কানেকশন স্ট্রিং
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/telitask_pro',

    // --- 💰 Earning & Withdraw Settings ---
    MIN_WITHDRAW_BDT: 100,     // bKash/Nagad এ মিনিমাম উইথড্র টাকার পরিমাণ
    MIN_WITHDRAW_USD: 5,       // USD উইথড্র এর মিনিমাম পরিমাণ
    WITHDRAW_AUTO_REJECT_DAYS: 7, // কত দিন পর পেন্ডিং উইথড্র অটো রিজেক্ট হবে (ঐচ্ছিক)

    // --- 🔒 Security Settings ---
    ENABLE_VPN_BLOCK: true,    // VPN ব্যবহার করলে ব্লক করবে কিনা (true/false)
    ENABLE_DUPLICATE_CHECK: true, // একই ডিভাইস থেকে একাধিক অ্যাকাউন্ট ব্লক করবে কিনা (true/false)

    // --- 🎨 System Settings ---
    DEFAULT_THEME: 'dark',     // মিনি অ্যাপের ডিফল্ট থিম ('dark' বা 'light')
    
    // --- ⚙️ App Settings ---
    APP_URL: process.env.APP_URL || 'https://your-mini-app-domain.com', // টেলিগ্রাম মিনি অ্যাপের লিংক
    APP_NAME: 'TeliTask Pro',
    
};
