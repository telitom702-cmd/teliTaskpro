const mongoose = require('mongoose');
const withdrawSchema = new mongoose.Schema({
    userId: String,
    method: { type: String, enum: ['bKash', 'Nagad', 'USD'] },
    amount: Number,
    accountNo: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    requestedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Withdraw', withdrawSchema);
