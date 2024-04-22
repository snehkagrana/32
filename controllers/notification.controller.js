const NotificationService = require('../services/notification.service')

exports.sendNotifications = async (req, res, next) => {
    const result = await NotificationService.sendAndSaveNotification({
        userId: req.user._id,
        title: req.body.title,
        body: req.body.body,
        type: req.body.type,
        dataId: req.body.dataId,
    })

    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to send notification' })
}

exports.getNotifications = async (req, res, next) => {
    const result = await NotificationService.getNotificationList({
        userId: req.user._id,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get notification' })
}
