const mongoose = require('mongoose')

const NotificationModel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String },
    type: {
        type: String,
        enum: [
            'common',
            'reminder',
            'friends_follow',
            'leaderboard',
            'heart_refill',
            'streak',
        ],
        default: 'common',
    },
    dataId: { type: String, default: null },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    readAt: { type: Date, default: null },
})

module.exports = mongoose.model('Notification', NotificationModel)
