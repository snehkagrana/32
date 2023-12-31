const ReferralModel = require('../models/referral')
const UserModel = require('../models/user')

exports.create = async ({ referralCode, userId }) => {
    let result = false

    const owner = await UserModel.findOne({
        referralCode,
    }).exec()

    const referralExists = await ReferralModel.findOne({
        referralCode,
        userId,
        ownerId: owner._id,
    }).exec()

    if (!referralExists) {
        referral = await ReferralModel.create({
            referralCode,
            userId,
            ownerId: owner._id,
            isValid: false,
        })
        result = true
    }

    return result
}
