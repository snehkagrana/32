const RewardService = require('../services/reward.service')

exports.create = async (req, res) => {
    const result = await RewardService.create(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}

exports.update = async (req, res) => {
    const result = await RewardService.update(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}

exports.findAll = async (req, res) => {
    const rewards = await RewardService.findAll(req)
    return res.json({
        data: rewards,
        message: 'Success.',
    })
}

exports.remove = async (req, res) => {
    const result = await RewardService.remove(req.body.id)
    if (result) {
        return res.json({
            message: 'Success.',
            data: result,
        })
    }
}

exports.giftReward = async (req, res) => {
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
