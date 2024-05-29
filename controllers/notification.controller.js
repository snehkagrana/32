const NotificationService = require('../services/notification.service')

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
        authUserId: req.user._id,
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
    console.log('USER PRESS ACTION NOTIFICATION', req.body)
    return res.json({
        message: 'OK!',
        data: null,
    })
}

// admin get notification template
exports.admin_getNotificationTemplate = async (req, res, next) => {
    const result = await NotificationService.admin_getNotificationTemplate()
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to get notification template' })
}

// admin create notification template
exports.admin_createNotificationTemplate = async (req, res, next) => {
    const result = await NotificationService.admin_createNotificationTemplate(
        req.body
    )
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to get notification template' })
}

// admin update notification template
exports.admin_updateNotificationTemplate = async (req, res, next) => {
    const result = await NotificationService.admin_updateNotificationTemplate({
        body: req.body,
        id: req.params.id,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to get notification template' })
}

exports.admin_deleteNotificationTemplate = async (req, res) => {
    const result = await NotificationService.admin_deleteNotificationTemplate(
        req.params.id
    )
    if (result) {
        return res.json({
            message: 'Success.',
            data: result,
        })
    }
}

// admin update notification template
exports.admin_getNotificationHistory = async (req, res, next) => {
    const result = await NotificationService.admin_getNotificationHistory(
        req.body
    )
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to get notification history' })
}
