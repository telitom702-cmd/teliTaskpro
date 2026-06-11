const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: String,
    link: String,
    reward: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // রেওয়ার্ড অন/অফ
    completedBy: [{ type: String }], // যারা টাস্ক করেছে
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', taskSchema);
