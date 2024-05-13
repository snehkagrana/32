const mongoose = require('mongoose')

const NotificationTemplateModel = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
})

module.exports = mongoose.model(
    'NotificationTemplate',
    NotificationTemplateModel
)
