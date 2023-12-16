const mongoose = require('mongoose')

const RewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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
