const UserModel = require('../models/user')
const RewardModel = require('../models//reward')

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
