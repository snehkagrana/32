const { appConfig } = require('../configs/app.config')
const NotificationModel = require('../models/notification')
const NotificationTemplateModel = require('../models/notificationTemplate')
const DeliveredNotificationHistoryModel = require('../models/deliveredNotificationHistory')
const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')
const { validateEmail } = require('../utils/common.util')
const { sendNotification } = require('../utils/notification.util')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')
const user = require('../models/user')

exports.getNotificationList = async ({ userId }) => {
    const notifications = await NotificationModel.find({ userId }).sort({
        createdAt: 'desc',
    })
    return notifications
}

exports.markAllRead = async ({ userId }) => {
    await NotificationModel.updateMany(
        { userId },
        {
            $set: {
                readAt: new Date(),
            },
        },
        { new: true }
    )
    return true
}

exports.markRead = async ({ userId, notificationId }) => {
    // update notification
    await NotificationModel.findOneAndUpdate(
        { _id: notificationId },
        {
            $set: {
                readAt: new Date(),
            },
        },
        { new: true }
    ).exec()
    return true
}

exports.getUnreadNotification = async ({ userId }) => {
    const notifications = await NotificationModel.find({
        userId,
        readAt: null,
    }).exec()
    return notifications.length || 0
}

exports.sendAndSaveNotification = async ({
    userId,
    title,
    body,
    type,
    dataId,
    streakNotificationTypeId,
}) => {
    let result = false
    const user = await UserModel.findOne({ _id: userId })

    if (user?.fcmToken) {
        const notifications = await NotificationModel.create({
            userId,
            title: title || '',
            body: body || '',
            type: type || 'common',
            dataId: dataId || null,
            readAt: null,
        })
        await sendNotification({
            token: user.fcmToken,
            title,
            body,
            data: dataId ? { dataId } : {},
        })

        if (streakNotificationTypeId) {
            // prettier-ignore
            await UserModel.updateOne(
                { _id: userId },
                {
                    $set: { lastDeliveredStreakNotificationType: streakNotificationTypeId },
                }
            ).exec()
        }

        result = true
        return notifications
    }

    return result
}

exports.admin_getNotifeeUsers = async () => {
    const users = await UserModel.find({ fcmToken: { $exists: true } }).exec()
    if (users?.length > 0) {
        return users?.map(x => ({
            _id: x._id,
            displayName: x.displayName || x.username,
            email: x.email,
            imgPath: x.imgPath || null,
        }))
    }
    return []
}

exports.admin_sendGeneralNotification = async ({
    users,
    title,
    body,
    imageUrl,
    authUserId,
}) => {
    let result = false

    const NAME_PATTERN = '[[NAME]]'
    const EMAIL_PATTERN = '[[EMAIL]]'

    if (users?.length > 0) {
        result = true
        users.forEach(async user => {
            let replacedTitle = ''
            let replacedBody = ''

            // prettier-ignore
            replacedTitle = title.replace(NAME_PATTERN, user?.displayName || 'User')
            // prettier-ignore
            replacedTitle = replacedTitle.replace(EMAIL_PATTERN, user?.email || '')

            // prettier-ignore
            replacedBody = body.replace(NAME_PATTERN, user?.displayName || 'User')
            // prettier-ignore
            replacedBody = replacedBody.replace(EMAIL_PATTERN, user?.email || '')

            const notificationData = {
                userId: user.userId,
                title: replacedTitle,
                body: replacedBody,
                imageUrl: imageUrl || '',
                type: NOTIFICATION_TYPE.common,
                dataId: null,
            }

            await this.sendAndSaveNotification(notificationData)
        })

        await DeliveredNotificationHistoryModel.create({
            sendBy: authUserId,
            title,
            body,
            imageUrl: imageUrl || '',
            type: NOTIFICATION_TYPE.common,
            createdAt: new Date(),
            users,
        })
    }

    return result
}

exports.admin_getNotificationTemplate = async () => {
    return await NotificationTemplateModel.find({}).sort({
        createdAt: 'desc',
    })
}

exports.admin_createNotificationTemplate = body => {
    return NotificationTemplateModel.create(body)
}

exports.admin_updateNotificationTemplate = async body => {
    const { _id, ...rest } = body
    return await NotificationTemplateModel.findOneAndUpdate(
        { _id: _id },
        rest,
        { new: true }
    )
}

exports.admin_deleteNotificationTemplate = async id => {
    return await NotificationTemplateModel.deleteOne({ _id: id })
}
