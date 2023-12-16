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
    if (req.body.items?.length > 0) {
        const items = req.body.items.map(item => ({
            ...item,
            isRedeemed: false,
            hasSeen: false,
            redeemedAt: null,
        }))
        await RewardService.giftReward(req.body.email, items)
        return res.json({
            message: 'Gift reward successfully.',
        })
    } else {
        return res.status(400).json({ message: 'Items cannot empty or null' })
    }
}

// find all reward for user basic
exports.findAll = async (req, res) => {
    const rewards = await RewardService.findAll(req)
    const filteredRewards = rewards.map(item => ({
        ...item._doc,
        pin: null,
        claimCode: null,
    }))
    console.log('filteredRewards', filteredRewards)
    return res.json({
        data: rewards,
        message: 'Success.',
    })
}
