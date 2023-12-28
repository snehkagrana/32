const { BATCH_EVENT_TIME_SPENT } = require('../constants/app.constant')
const HeartService = require('../services/heart.service')

exports.fillHeart = async (req, res) => {
    const { gemsAmount } = req.body
    const result = HeartService.fillHeart(gemsAmount, req.user._id)

    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed to get users' })
}
