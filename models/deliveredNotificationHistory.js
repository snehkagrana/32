const mongoose = require('mongoose')

const DeliveredNotificationHistoryModel = new mongoose.Schema({
    sendBy: { type: String, default: 'system' },
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
    isFromDashboard: Boolean,

    // delivered at
    createdAt: {
        type: Date,
        default: Date.now,
    },

    // users who receipt this notification
    users: [
        {
            userId: String,
            displayName: String,
            imgPath: {
                type: String,
                default: null,
            },
        },
    ],
})

module.exports = mongoose.model(
    'DeliveredNotificationHistory',
    DeliveredNotificationHistoryModel
)
