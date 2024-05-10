const mongoose = require('mongoose')

const GuestSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    role: String,
    score: [
        {
            skill: {
                type: String,
            },
            category: {
                type: String,
            },
            sub_category: {
                type: String,
            },
            points: {
                type: Number,
            },
        },
    ],
    xp: {
        current: Number,
        daily: Number,
        total: Number,
        level: Number,
        weekly: Number,
    },
    last_played: {
        skill: {
            type: String,
        },
        category: {
            type: String,
        },
        sub_category: {
            type: String,
        },
    },
    streak: Number,
    lastCompletedDay: Date,
    completedDays: {
        0: Date,
        1: Date,
        2: Date,
        3: Date,
        4: Date,
        5: Date,
        6: Date,
    },
    diamond: Number,
    diamondInitialized: Boolean,
    lastClaimedGemsDailyQuest: Date,
    heart: {
        type: Number,
        required: true,
    },
    lastHeartAccruedAt: {
        type: Date,
        default: undefined,
    },
    registerToken: String,
    createdAt: Date,
    lastActiveAt: Date,
    lastLessonCategoryName: String,
    lastCompleteLessonDate: Date,
})

module.exports = mongoose.model('Guest', GuestSchema)
