const mongoose = require('mongoose')

const ReferralModel = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCode: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        required: true,
    },
    registerAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Referral', ReferralModel)
