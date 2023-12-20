const RewardService = require('../services/reward.service')

exports.admin_create = async (req, res) => {
    const result = await RewardService.create(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}

exports.admin_update = async (req, res) => {
    const result = await RewardService.update(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}

exports.admin_findAll = async (req, res) => {
    const rewards = await RewardService.findAll(req)
    return res.json({
        data: rewards,
        message: 'Success.',
    })
}

exports.admin_remove = async (req, res) => {
    const result = await RewardService.remove(req.body.id)
    if (result) {
        return res.json({
            message: 'Success.',
            data: result,
        })
    }
}

exports.admin_giftReward = async (req, res) => {
    if (req.user.email && req.body) {
        const result = await RewardService.giftReward(req.user.email, req.body)
        if (result) {
            return res.json({
                message: 'Gift reward successfully.',
                data: {
                    ...result._doc,
                    currencyValue: result?._doc?.currencyValue
                        ? result._doc.currencyValue.toString()
                        : null,
                },
            })
        }
        return res.status(400).json({ message: 'Failed to gift reward' })
    } else {
        return res.status(400).json({ message: 'Item id cannot be empty' })
    }
}

exports.admin_upload = async (req, res) => {
    const { file, itemId } = req.body
    if (itemId) {
        const result = await RewardService.upload(file, itemId)
        // console.log('result->>', result)
        res.json({
            imageUrl: req.file.location, // URL of the uploaded file in S3
        })
    } else {
        return res.json({
            message: 'Ok',
            data: req.file.location,
        })
    }
}

// find all reward for user basic
exports.findAll = async (req, res) => {
    const rewards = await RewardService.findAll(req)
    const filteredRewards = rewards.map(item => ({
        ...item._doc,

        // hide pin & claim code
        // prettier-ignore
        variants: item._doc?.variants?.length > 0 ? item._doc.variants.filter(x => x._doc.isAvailable).map(v => {
            return {
                ...v._doc,
                pin: null,
                claimCode: null,
            }
        }) : [],
        // prettier-ignore
        currencyValue: item._doc?.currencyValue ? item._doc.currencyValue.toString() : null,
    }))
    return res.json({
        data: filteredRewards,
        message: 'Success.',
    })
}

// Redeem reward
exports.redeem = async (req, res) => {
    if (req.user.email && req.body) {
        const result = await RewardService.redeem(req.user.email, req.body)
        if (result) {
            return res.json({
                message: 'Redeem successfully.',
                data: {
                    ...result._doc,
                    currencyValue: result?._doc?.currencyValue
                        ? result._doc.currencyValue.toString()
                        : null,
                },
            })
        }
        return res.status(400).json({ message: 'Error' })
    } else {
        return res.status(400).json({ message: 'Item id cannot be empty' })
    }
}

// Claim reward
exports.claimReward = async (req, res) => {
    if (req.user.email && req.body?.type) {
        const result = await RewardService.claimReward(
            req.user.email,
            req.body.type
        )
        if (result) {
            return res.json({
                message: 'Claim reward successfully.',
                data: result,
            })
        }
        return res.status(400).json({ message: 'Error' })
    } else {
        return res.status(400).json({ message: 'Claim type cannot be empty' })
    }
}
