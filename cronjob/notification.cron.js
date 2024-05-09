const cron = require('node-cron')
const UserModel = require('../models/user')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')

const NotificationService = require('../services/notification.service')

const sendStreakNotification = async ({ title, body, userId }) => {

    const title = "You missed your lesson. You know what happens now🔫"

    const notificationData = {
        title,
        body,
        userId,
        type: NOTIFICATION_TYPE.streak,
        dataId: null,
    }
    // send notification
    await NotificationService.sendAndSaveNotification(notificationData)
}

module.exports = { sendStreakNotification }
