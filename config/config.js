/**
 * TeliTask Pro - Configuration File
 * সব সেটিংস সরাসরি এখানে দেওয়া হয়েছে।
 */

module.exports = {
    
    // --- 🤖 Telegram Bot Settings ---
    BOT_TOKEN: '8600984479:AAFtkrYCx_WNnp8zK8I34LoifqAD-t7rfOE', 
    
    // --- 👨‍💼 Admin Settings ---
    ADMIN_IDS: [
        8248792819,  // আপনার টেলিগ্রাম আইডি
    ],

    // --- 📊 Group Summary Settings ---
    GROUP_IDS: [
        -1003194263389,  // আপনার মূল টেলিগ্রাম গ্রুপের আইডি
    ],

    // বট স্বয়ংক্রিয়ভাবে যে মেসেজগুলো এডিট করবে তাদের আইডি এখানে সেভ হবে (হাতে কিছু দিতে হবে না)
    SUMMARY_MESSAGE_IDS: {}, 

    // --- 🗄️ Database Settings ---
    // ডাটাবেসের নাম telitask_pro বসানো হয়েছে
    MONGO_URI: 'mongodb+srv://mongodbpy_db_user:pPgtRKyHsm8GvJF2@cluster0.u2ft5ps.mongodb.net/telitask_pro?retryWrites=true&w=majority&appName=Cluster0',

    // --- 💰 Earning & Withdraw Settings ---
    MIN_WITHDRAW_BDT: 100,     
    MIN_WITHDRAW_USD: 5,       
    WITHDRAW_AUTO_REJECT_DAYS: 7, 

    // --- 🔒 Security Settings ---
    ENABLE_VPN_BLOCK: true,    
    ENABLE_DUPLICATE_CHECK: true, 

    // --- 🎨 System Settings ---
    DEFAULT_THEME: 'dark',     
    
    // --- ⚙️ App Settings ---
    APP_URL: 'https://telitaskpro-1.onrender.com', 
    APP_NAME: 'TeliTask Pro',
    
};
