//Model for user account

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    /** @deprecated */
    displayName: String,

    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    imgPath: {
        type: String,
    },
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
            xp: {
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
    password_reset_token: String,
    passwordResetCode: String,
    diamond: Number,

    // for new user who has claim diamond in first time it's should be true
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
    numberOfLessonCompleteToday: Number,
    rewards: [
        {
            rewardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reward',
            },
            variantId: mongoose.Schema.Types.ObjectId,
            givenBy: {
                type: {
                    userId: mongoose.Schema.Types.ObjectId,
                    displayName: String,
                    email: String,
                },
                required: false,
                default: null,
            },
            claimCode: {
                type: String,
                required: true,
            },
            pin: String,
            name: {
                type: String,
                required: true,
            },
            description: String,
            brandUrl: String,
            currencyValue: {
                type: mongoose.Schema.Types.Decimal128,
                required: true,
            },
            currencyCode: {
                type: String,
            },
            diamondValue: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            imageURL: {
                type: String,
            },
            notes: {
                type: String,
                required: false,
                default: null,
            },
            receivedAt: {
                type: Date,
                // `Date.now()` returns the current unix timestamp as a number
                default: Date.now,
            },
            redeemedAt: Date,
            isRedeemed: {
                type: Boolean,
                required: true,
            },
            hasSeen: {
                type: Boolean,
                required: true,
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
    unlimitedHeart: Date,
    referralCode: String,
    registeredAt: Date,
    numberOfSuccessReferrals: Number,
    emailVerifiedAt: Date,
    verifyEmailCode: String,
    phoneNumber: String,
    avatarId: {
        type: Number,
        default: null,
    },
    following: [
        {
            userId: String,
            displayName: String,
            totalXp: Number,
            level: Number,
            imgPath: {
                type: String,
                default: null,
            },
            createdAt: Date,
            updatedAt: {
                type: Date,
                default: null,
            },
        },
    ],
    followers: [
        {
            userId: String,
            displayName: String,
            totalXp: Number,
            level: Number,
            imgPath: {
                type: String,
                default: null,
            },
            createdAt: Date,
            updatedAt: {
                type: Date,
                default: null,
            },
        },
    ],
    leaderBoards: [
        {
            leaderBoardId: String,
            startDate: Date,
            endDate: Date,
            hasSeen: Boolean,
            position: Number,
            xp: Number,
        },
    ],
    fcmToken: String,
    os: String,

    /** @deprecated */
    lastLessonCategoryName: String,

    lastDeliveredStreakNotificationType: Number,
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

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.password = null
        ret.rewards = ret.rewards.map(x => {
            if (x?.currencyValue) {
                return {
                    ...x,
                    currencyValue: x.currencyValue.toString(),
                }
            }
            return x
        })
        return ret
    },
})

module.exports = mongoose.model('User', UserSchema)
