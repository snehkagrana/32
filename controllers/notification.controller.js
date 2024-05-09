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

exports.markAllRead = async (req, res, next) => {
    const result = await NotificationService.markAllRead({
        userId: req.user._id,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed mark all read notifications' })
}

exports.markRead = async (req, res, next) => {
    const result = await NotificationService.markRead({
        userId: req.user._id,
        notificationId: req.params.notificationId,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: null,
        })
    }
    return res.status(400).json({ message: 'Failed to read notification' })
}

exports.getUnreadNotification = async (req, res, next) => {
    const result = await NotificationService.getUnreadNotification({
        userId: req.user._id,
    })

    return res.json({
        message: 'Success',
        data: result,
    })
}

// admin get notifee user
exports.admin_getNotifeeUsers = async (req, res, next) => {
    const result = await NotificationService.admin_getNotifeeUsers()
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed get users' })
}

// admin send general notification
exports.admin_sendGeneralNotification = async (req, res, next) => {
    const result = await NotificationService.admin_sendGeneralNotification({
        users: req.body.users || [],
        title: req.body.title || '',
        body: req.body.body || '',
        imageUrl: req.body.imageUrl || null,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to send notification' })
}

// admin send general notification
exports.admin_uploadImage = async (req, res) => {
    return res.json({
        message: 'Ok',
        data: req.file.location,
    })
}

// admin send general notification
exports.userPressActionNotification = async (req, res, next) => {
    console.log('USER PRESS ACTION NOTIFICATION', res.body)
    return res.json({
        message: 'OK!',
        data: null,
    })
}
