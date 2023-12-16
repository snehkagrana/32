//Model for user account

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    displayName: String,
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
        },
    ],
    xp: {
        current: Number,
        daily: Number,
        total: Number,
        level: Number,
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
    password_reset_token: String,
    diamond: Number,
    rewards: [
        {
            rewardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reward',
            },
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
            claimCode: {
                type: String,
                required: true,
            },
            pin: String,
            type: {
                type: String,
                required: true,
            },
            imageURL: {
                type: String,
            },
            notes: String,
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
