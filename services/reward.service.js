const RewardModel = require('../models/reward')
const UserModel = require('../models/user')

var ObjectId = require('mongoose').Types.ObjectId

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

exports.upload = async (file, id) => {
    RewardModel.findById(id, async (err, doc) => {
        if (err) {
            console.log('ERROR', err)
        } else {
            if (file && file.location) {
                const res = await RewardModel.updateOne(
                    { _id: id },
                    { $set: { imageURL: file.location } }
                )
            } else {
                return res.json({
                    imageUrl: doc.imageUrl,
                })
            }
        }
        res.json({
            imageUrl: req.file.location, // URL of the uploaded file in S3
        })
    })
}

exports.redeem = async (email, body) => {
    let reward = await RewardModel.findById(body.itemId)
    let user = await UserModel.findOne({ email })

    const getUpdateUserRewards = userRewards => {
        const newUserReward = {
            ...reward._doc,
            rewardId: reward._doc,
            variantId: reward._doc.variants.find(x => x._id == body.variantId)
                ._id,
            claimCode: reward._doc.variants.find(x => x._id == body.variantId)
                .claimCode,
            pin: reward._doc.variants.find(x => x._id == body.variantId).pin,
            notes: body.notes,
            isRedeemed: true,
            hasSeen: true,
            redeemedAt: new Date().toISOString(),
        }
        if (userRewards.length > 0) {
            return [...userRewards, newUserReward]
        } else {
            return [newUserReward]
        }
    }

    reward = await RewardModel.findByIdAndUpdate(body.itemId, {
        $set: {
            variants: reward.variants.filter(x => x._id != body.variantId),
        },
    }).exec()

    user = await UserModel.findOneAndUpdate(
        { email },
        {
            $set: {
                diamond: user.diamond - reward._doc.diamondValue,
                rewards: getUpdateUserRewards(user?.rewards ?? []),
            },
        },
        { new: true }
    ).exec()

    return user.rewards.find(
        x => x.rewardId == body.itemId && x.variantId == body.variantId
    )
}
