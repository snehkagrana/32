const admin = require('firebase-admin')
const NotificationService = require('../services/notification.service')
const {
    STREAK_NOTIFICATION_TYPE,
    RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE,
    RANDOMLY_STREAK_NOTIFICATION_TYPE,
    RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE,
    SATURDAY_LEADERBOARD_NOTIFICATION_TYPE,
    LEADERBOARD_NOTIFICATION_TYPE,
    FRIEND_LEADERBOARD_NOTIFICATION_TYPE,
} = require('../constants/notification-type.constant')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')
const { getRandomInt } = require('./common.util')
const UserModel = require('../models/user')
const { getFirstName } = require('./user.util')

const ANDROID_sendNotification = async ({ token, title, body, data }) => {
    try {
        if (!token || typeof token !== 'string') {
            // throw new Error('Invalid FCM token provided')
            return
        }
        const message = {
            data: {
                title: title,
                body: body,
                data: data ? JSON.stringify(data) : '',
            },
            android: {
                priority: 'high',
            },
            token: token,
        }
        const response = await admin.messaging().send(message)
        return response
    } catch (error) {
        console.error('Error sending message:', error.message)
        return
        // throw error
    }
}

const sendNotification = async ({ token, title, body, data }) => {
    try {
        if (!token || typeof token !== 'string') {
            // throw new Error('Invalid FCM token provided')
            return
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
        return
        // throw error
    }
}

const NotificationStreak = {
    sendReminder: async ({ typeId, user, streakNumber, lessonName }) => {
        const params = {
            streakNumber: streakNumber || 0,
            lessonName: lessonName
                ? lessonName?.split('_')?.join(' ')
                : user?.last_played?.sub_category?.split('_')?.join(' ') || '',
            name: getFirstName(user) || '',
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
            shouldSaveHistory: true,
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
            streakNumber: streakNumber || 0,
            hoursLeft: hoursLeft || 0,
            lessonName: lessonName
                ? lessonName?.split('_')?.join(' ')
                : user?.last_played?.sub_category?.split('_')?.join(' ') || '',
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
            shouldSaveHistory: true,
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
            lessonName: lessonName
                ? lessonName?.split('_')?.join(' ')
                : user?.last_played?.sub_category?.split('_')?.join(' ') || '',
            name: getFirstName(user) || '',
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
            shouldSaveHistory: true,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },
}

const LeaderboardReminder = {
    sendRandomReminder: async ({
        userId,
        friendName,
        myFriendPosition,
        positionAboveOfMeId,
        myPosition,
        lessonName,
        daysLeft,
    }) => {
        const myProfile = await UserModel.findOne({
            _id: userId,
        })
        if (myProfile) {
            // prettier-ignore
            const isFriendExist = myProfile?.following?.find((x) => x.userId == positionAboveOfMeId) || null
            if (
                isFriendExist &&
                myPosition !== 1 &&
                myFriendPosition !== 0 &&
                myFriendPosition < myPosition
            ) {
                return await LeaderboardReminder.sendFriendReminder({
                    userId,
                    friendName: friendName || '',
                })
            } else {
                const TYPE_ID = getRandomInt(
                    Object.keys(RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE).length
                )
                const params = {
                    lessonName: lessonName
                        ? lessonName?.split('_')?.join(' ')
                        : user?.last_played?.sub_category
                              ?.split('_')
                              ?.join(' ') || '',
                    daysLeft: daysLeft || 0,
                }
                if (!RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID]) {
                    return false
                }
                // prettier-ignore
                const DATA = {
                    userId,
                    title: RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
                    body: RANDOMLY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
                    type: NOTIFICATION_TYPE.leaderboard,
                    dataId: null,
                    shouldSaveHistory: true,
                }
                return await NotificationService.sendAndSaveNotification(DATA)
            }
        }
    },
    sendSaturdayReminder: async ({
        userId,
        friendName,
        myFriendPosition,
        positionAboveOfMeId,
        myPosition,
        hoursLeft,
    }) => {
        const myProfile = await UserModel.findOne({
            _id: userId,
        })
        if (myProfile) {
            // prettier-ignore
            const isFriendExist = myProfile.following?.find((x) => x.userId == positionAboveOfMeId) || null
            if (
                isFriendExist &&
                myPosition !== 1 &&
                myFriendPosition !== 0 &&
                myFriendPosition < myPosition
            ) {
                return await LeaderboardReminder.sendFriendReminder({
                    userId,
                    friendName: friendName || '',
                })
            } else {
                const TYPE_ID = 1
                const params = {
                    hoursLeft: hoursLeft || 0,
                }
                if (!SATURDAY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID]) {
                    return false
                }
                // prettier-ignore
                const DATA = {
                    userId,
                    title: SATURDAY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
                    body: SATURDAY_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
                    type: NOTIFICATION_TYPE.leaderboard,
                    dataId: null,
                    shouldSaveHistory: true,
                }
                return await NotificationService.sendAndSaveNotification(DATA)
            }
        }
    },

    sendFriendReminder: async ({ userId, friendName }) => {
        const TYPE_ID = 1
        const params = {
            friendName: friendName || '',
        }
        if (!FRIEND_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID]) {
            return false
        }
        // prettier-ignore
        const DATA = {
            userId,
            title: FRIEND_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
            body: FRIEND_LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
            type: NOTIFICATION_TYPE.leaderboard,
            dataId: null,
            shouldSaveHistory: true,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },

    sendResultNotification: async ({ user, rank }) => {
        const TYPE_ID = 'RESULT'
        const params = {
            rank: rank || 0,
        }
        if (!LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID]) {
            return false
        }
        // prettier-ignore
        const DATA = {
            title: LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.title || '',
            body: LEADERBOARD_NOTIFICATION_TYPE[TYPE_ID](params)?.body || '',
            userId: user._id,
            type: NOTIFICATION_TYPE.leaderboard,
            dataId: null,
            shouldSaveHistory: true,
        }
        return await NotificationService.sendAndSaveNotification(DATA)
    },
}

module.exports = {
    ANDROID_sendNotification,
    sendNotification,
    NotificationStreak,
    NotificationReminder,
    LeaderboardReminder,
}
