const admin = require('firebase-admin')
const NotificationService = require('../services/notification.service')
const {
    STREAK_NOTIFICATION_TYPE,
    RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE,
    RANDOMLY_STREAK_NOTIFICATION_TYPE,
    RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE,
} = require('../constants/notification-type.constant')
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
    sendReminder: async ({ typeId, user, streakNumber, lessonName }) => {
        const params = {
            streakNumber: streakNumber || 0,
            lessonName: lessonName || '',
            name: user.displayName || '',
        }
        if (!STREAK_NOTIFICATION_TYPE[typeId]) {
            return false
        }
        const DATA = {
            title: STREAK_NOTIFICATION_TYPE[typeId](params)?.title || '',
            body: STREAK_NOTIFICATION_TYPE[typeId](params)?.body || '',
            userId: user._id,
            type: NOTIFICATION_TYPE.streak,
            dataId: null,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },

    sendRandomReminder: async ({
        user,
        streakNumber,
        hoursLeft,
        lessonName,
    }) => {
        const TYPE_ID = getRandomInt(
            Object.keys(RANDOMLY_STREAK_NOTIFICATION_TYPE).length
        )
        const params = {
            // name: user.displayName || '',
            streakNumber: streakNumber || 0,
            hoursLeft: hoursLeft || 0,
            lessonName: lessonName || '',
        }
        if (!RANDOMLY_STREAK_NOTIFICATION_TYPE[TYPE_ID]) {
            return false
        }
        // prettier-ignore
        const DATA = {
            title: RANDOMLY_STREAK_NOTIFICATION_TYPE[TYPE_ID](params)?.title || "",
            body: RANDOMLY_STREAK_NOTIFICATION_TYPE[TYPE_ID](params)?.body || "",
            userId: user._id,
            type: NOTIFICATION_TYPE.streak,
            dataId: null,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },
}

const NotificationReminder = {
    sendRandomReminder: async ({ user, lessonName }) => {
        const TYPE_ID = getRandomInt(
            Object.keys(RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE).length
        )
        const params = {
            lessonName: lessonName || '',
            name: user.displayName || '',
        }
        if (!RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE[TYPE_ID]) {
            return false
        }
        // prettier-ignore
        const DATA = {
            title: RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
            body: RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
            userId: user._id,
            type: NOTIFICATION_TYPE.reminder,
            dataId: null,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },
}

const LeaderboardReminder = {
    sendRandomReminder: async ({ user, lessonName, daysLeft }) => {
        const TYPE_ID = getRandomInt(
            Object.keys(RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE).length
        )
        const params = {
            lessonName: lessonName || '',
            daysLeft: daysLeft || 0,
        }
        if (!RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID]) {
            return false
        }
        // prettier-ignore
        const DATA = {
            title: RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
            body: RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
            userId: user._id,
            type: NOTIFICATION_TYPE.leaderboard,
            dataId: null,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },
}

module.exports = {
    sendNotification,
    NotificationStreak,
    NotificationReminder,
    LeaderboardReminder,
}
