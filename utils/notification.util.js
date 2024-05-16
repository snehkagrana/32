const admin = require('firebase-admin')
const NotificationService = require('../services/notification.service')
const { STREAK_NOTIFICATION_TYPE, REMINDER_NOTIFICATION_TYPE } = require('../constants/notification-type.constant')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')
const { getRandomInt } = require('./common.util')

const sendNotification = async ({ token, title, body, data }) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid FCM token provided')
        }
        const message = {
            notification: {
                title: title,
                body: body,
            },
            data: data || {},
            android: {
                notification: {
                    sound: 'Default',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'Default',
                    },
                },
            },
            token: token,
        }
        const response = await admin.messaging().send(message)
        return response
    } catch (error) {
        console.error('Error sending message:', error.message)
        throw error
    }
}

const NotificationStreak = {
    sendNotification: async ({ typeId, user, streakNumber, hoursLeft }) => {
        const data = {
            title: STREAK_NOTIFICATION_TYPE[typeId]({ name: user.displayName, streakNumber, hoursLeft }).title,
            body: STREAK_NOTIFICATION_TYPE[typeId]({ name: user.displayName }).body,
            userId: user._id,
            type: NOTIFICATION_TYPE.streak,
            dataId: null,
            streakNotificationTypeId: STREAK_NOTIFICATION_TYPE[typeId]({ name: user.displayName }).typeId,
        }
        await NotificationService.sendAndSaveNotification(data)
    },

    sendRandomReminder: async () => {},
}

const NotificationReminder = {
    sendNotification: async ({ user }) => {
        const TYPE_ID = getRandomInt(Object.keys(REMINDER_NOTIFICATION_TYPE).length)
        const data = {
            title: REMINDER_NOTIFICATION_TYPE[TYPE_ID]({ name: user.displayName }).title,
            body: REMINDER_NOTIFICATION_TYPE[TYPE_ID]({ name: user.displayName }).body,
            userId: user._id,
            type: NOTIFICATION_TYPE.streak,
            dataId: null,
        }
        await NotificationService.sendAndSaveNotification(data)
    },
}

module.exports = {
    sendNotification,
    NotificationStreak,
    NotificationReminder,
}
