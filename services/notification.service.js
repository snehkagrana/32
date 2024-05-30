const { appConfig } = require('../configs/app.config')
const NotificationModel = require('../models/notification')
const NotificationTemplateModel = require('../models/notificationTemplate')
const DeliveredNotificationHistoryModel = require('../models/deliveredNotificationHistory')
const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')
const { validateEmail } = require('../utils/common.util')
const { sendNotification } = require('../utils/notification.util')
const {
    NOTIFICATION_TYPE,
    SERVER_TIMEZONE,
    __DEV__,
} = require('../constants/app.constant')
const user = require('../models/user')
const moment = require('moment-timezone')
const { getFullName, getFirstName } = require('../utils/user.util')

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
    imageUrl,
    type,
    dataId,
    streakNotificationTypeId,
    shouldSaveHistory,
    isFromDashboard,
}) => {
    const user = await UserModel.findOne({ _id: userId })
    const NOW = Date.now()

    const notification = await NotificationModel.create({
        userId,
        title: title || '',
        body: body || '',
        imageUrl: imageUrl || '',
        type: type || 'common',
        dataId: dataId || null,
        createdAt: NOW,
        readAt: null,
    })

    if (!__DEV__) {
        if (notification && user?.fcmToken) {
            await sendNotification({
                token: user.fcmToken,
                title,
                body,
                data: {
                    dataId: String(dataId) || '',
                    imageUrl: String(imageUrl) || '',
                },
                // data: dataId ? { dataId } : {},
            })

            /**
             * @deprecated
             */
            // if (streakNotificationTypeId) {
            //     // prettier-ignore
            //     await UserModel.updateOne(
            //         { _id: userId },
            //         {
            //             $set: { lastDeliveredStreakNotificationType: streakNotificationTypeId },
            //         }
            //     ).exec()
            // }
        }
    }

    if (shouldSaveHistory) {
        await DeliveredNotificationHistoryModel.create({
            sendBy: 'system',
            title: title || '',
            body: body || '',
            imageUrl: imageUrl || '',
            type: type || NOTIFICATION_TYPE.common,
            createdAt: new Date(),
            isFromDashboard: isFromDashboard || false,
            users: [
                {
                    userId,
                    displayName: getFullName(user),
                    imgPath: user?.imgPath || '',
                },
            ],
        })
    }

    return notification
}

exports.admin_getNotifeeUsers = async () => {
    const users = await UserModel.find({ fcmToken: { $exists: true } }).exec()
    if (users?.length > 0) {
        return users?.map(x => ({
            _id: x._id,
            displayName: getFirstName(x),
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
            replacedTitle = title.replace(NAME_PATTERN, getFirstName(user) || 'User')
            // prettier-ignore
            replacedTitle = replacedTitle.replace(EMAIL_PATTERN, user?.email || '')

            // prettier-ignore
            replacedBody = body.replace(NAME_PATTERN, getFirstName(user) || 'User')
            // prettier-ignore
            replacedBody = replacedBody.replace(EMAIL_PATTERN, user?.email || '')

            const notificationData = {
                userId: user.userId,
                title: replacedTitle,
                body: replacedBody,
                imageUrl: imageUrl || '',
                type: NOTIFICATION_TYPE.common,
                dataId: null,
                shouldSaveHistory: false,
            }

            await this.sendAndSaveNotification(notificationData)
        })

        await DeliveredNotificationHistoryModel.create({
            sendBy: authUserId,
            title: title || '',
            body: body || '',
            imageUrl: imageUrl || '',
            type: NOTIFICATION_TYPE.common,
            createdAt: new Date(),
            isFromDashboard: true,
            users:
                users?.map(x => ({
                    userId: x?.userId || '',
                    displayName: getFirstName(x),
                    imgPath: x?.imageUrl || null,
                })) || [],
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

exports.admin_updateNotificationTemplate = async ({ body, id }) => {
    return await NotificationTemplateModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
    })
}

exports.admin_deleteNotificationTemplate = async id => {
    return await NotificationTemplateModel.deleteOne({ _id: id })
}

exports.admin_getNotificationHistory = async ({ type }) => {
    if (type) {
        return await DeliveredNotificationHistoryModel.find({
            type: type,
        }).sort({
            createdAt: 'desc',
        })
    }
    return await DeliveredNotificationHistoryModel.find({}).sort({
        createdAt: 'desc',
    })
}
