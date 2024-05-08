const cron = require('node-cron')
const UserModel = require('../models/user')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')

const NotificationService = require('../services/notification.service')

const sendStreakNotification = async ({ title, body, userId }) => {
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

cron.schedule('*/10 * * * *', async function () {
    const today = new Date()

    /**
     * NOTES
     * dayOfWeek 0 - Sunday
     * dayOfWeek 1 - Monday
     */
    const dayOfWeek = dayjs(today).day()
    const hour = dayjs(today).hour()
    const minute = dayjs(today).minute()

    console.log('CRONJOB RUN -> At every 10th minute.' + dayOfWeek)
    // console.log('dayOfWeek', dayOfWeek)
    // console.log('hour', hour)
    // console.log('minute', minute)
})

// module.exports = { sendStreakNotification }
