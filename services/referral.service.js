const dayjs = require('dayjs')
const ReferralModel = require('../models/referral')
const UserModel = require('../models/user')
const {
    HOUR_OF_UNLIMITED_HEARTS,
    NUMBER_OF_SUCCESS_REFERRALS,
} = require('../constants/app.constant')

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

exports.validateReferral = async ({ userId }) => {
    let result = false
    const user = await UserModel.findById(userId)
    let referral = await ReferralModel.findOne({
        userId,
        isValid: false,
    }).exec()

    if (user && referral) {
        const referralOwner = await UserModel.findById(referral.ownerId).exec()

        if (referralOwner) {
            referral = await ReferralModel.findOneAndUpdate(
                {
                    userId,
                    ownerId: referralOwner._id,
                    referralCode: referral.referralCode,
                    isValid: false,
                },
                {
                    $set: {
                        isValid: true,
                    },
                }
            ).exec()

            const getUnlimitedHearts = totalOfSuccessReferral => {
                // prettier-ignore
                if (totalOfSuccessReferral === NUMBER_OF_SUCCESS_REFERRALS) {
                    return !referralOwner?.unlimitedHeart ? dayjs(new Date()).add(HOUR_OF_UNLIMITED_HEARTS, 'hour').toISOString() : referralOwner?.unlimitedHeart || null
                }
                else if(totalOfSuccessReferral > NUMBER_OF_SUCCESS_REFERRALS) {
                    const prevSuccessRef = Math.floor(totalOfSuccessReferral / NUMBER_OF_SUCCESS_REFERRALS);
                    if(totalOfSuccessReferral - (prevSuccessRef * NUMBER_OF_SUCCESS_REFERRALS) === 0) {
                        return !referralOwner?.unlimitedHeart ? dayjs(new Date()).add(HOUR_OF_UNLIMITED_HEARTS, 'hour').toISOString() : referralOwner?.unlimitedHeart || null
                    } else {
                        return referralOwner?.unlimitedHeart || null
                    }
                } else {
                    return referralOwner?.unlimitedHeart || null
                }
            }

            // Give unlimited heart to referral owner
            await UserModel.findOneAndUpdate(
                { email: referralOwner.email },
                {
                    $set: {
                        // prettier-ignore
                        unlimitedHeart: getUnlimitedHearts(!referralOwner?.numberOfSuccessReferrals ? 1 : referralOwner.numberOfSuccessReferrals + 1),

                        // prettier-ignore
                        numberOfSuccessReferrals: !referralOwner?.numberOfSuccessReferrals ? 1 : referralOwner.numberOfSuccessReferrals + 1,
                    },
                }
            ).exec()
        }
    }

    return result
}
