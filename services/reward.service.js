const RewardModel = require('../models/reward')
const UserModel = require('../models/user')

exports.create = body => {
    return RewardModel.create(body)
}

exports.update = async body => {
    const { _id, ...rest } = body
    return await RewardModel.findOneAndUpdate({ _id: _id }, rest)
}

exports.findAll = async filters => {
    return RewardModel.find(filters)
}

exports.findById = async id => {
    return await RewardModel.findById(id)
}

exports.remove = async id => {
    return await RewardModel.deleteOne({ _id: id })
}

exports.giftReward = async (email, rewardItems) => {
    UserModel.findOne({ email }).exec(async function (err, user) {
        if (err) {
            console.log('ERROR', err)
        } else {
            if (user) {
                if (user?.rewards?.length > 0) {
                    const mergedRewards = [...user?.rewards, ...rewardItems]
                    return await UserModel.updateOne(
                        { email },
                        { $set: { rewards: mergedRewards } }
                    )
                } else {
                    return await UserModel.updateOne(
                        { email },
                        { $set: { rewards: rewardItems } }
                    )
                }
            }
        }
    })
}
