const mongoose = require('mongoose')

const RewardSchema = new mongoose.Schema({
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
    variants: [
        {
            claimCode: {
                type: String,
                required: true,
            },
            pin: String,
            isAvailable: Boolean,
        },
    ],
})

RewardSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret?.currencyValue) {
            ret.currencyValue = ret.currencyValue.toString()
        }
        return ret
    },
})

module.exports = mongoose.model('Reward', RewardSchema)
