const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')

exports.getMyRewards = async email => {
    const user = await UserModel.findOne({ email })
    if (user) {
        return user._doc.rewards
    }
}

exports.markSeenMyReward = async (email, body) => {
    let user = await UserModel.findOne({ email }).exec()
    let result = false

    if (user) {
        // update user rewards
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    rewards: user.rewards.map(x => {
                        if (
                            x.rewardId == body.rewardId &&
                            x.variantId == body.variantId
                        ) {
                            return {
                                ...x._doc,
                                hasSeen: true,
                                isRedeemed: true,
                            }
                        } else {
                            return x._doc
                        }
                    }),
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.checkAvailabilityUsername = async ({
    username,
    authenticatedUserEmail,
}) => {
    let result = false
    // prettier-ignore
    const authenticatedUser = await UserModel.findOne({ email: authenticatedUserEmail }).exec()
    const user = await UserModel.findOne({ username }).exec()
    if (user && authenticatedUser?.username === username) {
        result = true
    } else if (!user) {
        result = true
    } else {
        result = false
    }

    return result
}

exports.sendCodeVerifyEmail = async ({ email }) => {
    const code = generateOTP(4)
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        await UserModel.findOneAndUpdate(
            { email },
            { $set: { verifyEmailCode: code } },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.verifyEmail = async ({ code, email }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user && user?.verifyEmailCode === code) {
        user = await UserModel.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    verifyEmailCode: '',
                    emailVerifiedAt: new Date(),
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.updateProfile = async (email, body) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        // update user
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    // email: body.email ?? user.email, // don't update email for now
                    username: body.username ?? user.username,
                    displayName: body.displayName ?? user.displayName,
                    phoneNumber: body.phoneNumber ?? user.phoneNumber ?? null,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}
