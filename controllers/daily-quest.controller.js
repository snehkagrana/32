const DailyQuestService = require('../services/daily-quest.service')

exports.syncDailyQuest = async (req, res) => {
    const result = await DailyQuestService.syncDailyQuest({
        userId: req.user._id,
        actionName: req.body.actionName,
        value: req.body.value,
    })
    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed sync daily quest' })
}

exports.claimDailyQuest = async (req, res) => {
    const result = await DailyQuestService.claimDailyQuest({
        userId: req.user._id,
        dailyQuestId: req.body.dailyQuestId,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed claim daily quest' })
}
