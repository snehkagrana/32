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

    /**
     * @deprecated
     */
    dayStreak: [
        {
            type: Date,
        },
    ],

    calendarStreak: [
        {
            date: {
                type: Date,
                default: null,
            },
            isFreeze: {
                type: Boolean,
                default: false,
            },
        },
    ],

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
    dailyQuest: [
        {
            sequence: Number,
            questId: String,
            questName: String,
            isCompleted: Boolean,
            progress: Number,
            maxValue: Number,
            date: Date,
            completedDate: {
                type: Date,
                default: null,
            },
            claimedAt: {
                type: Date,
                default: null,
            },
        },
    ],

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

    /** @deprecated */
    lastLessonCategoryName: String,

    nextLesson: {
        skill: {
            type: String,
        },
        category: {
            type: String,
        },
        subCategory: {
            type: String,
        },
    },

    userTimezone: {
        type: String,
        default: null,
    },
})

module.exports = mongoose.model('Guest', GuestSchema)
