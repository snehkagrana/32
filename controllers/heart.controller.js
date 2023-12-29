const HeartService = require('../services/heart.service')

exports.refillHearts = async (req, res) => {
    const { gemsAmount } = req.body
    const result = await HeartService.refillHearts(req.user._id, gemsAmount)

    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed to refill hearts' })
}
