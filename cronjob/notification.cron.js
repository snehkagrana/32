const cron = require('node-cron')
const UserModel = require('../models/user')
const { NOTIFICATION_TYPE } = require('../constants/app.constant')

const NotificationService = require('../services/notification.service')

cron.schedule('*/10 * * * *', async function () {
    const today = new Date()
    const users = await UserModel.find({
        fcmToken: { $exists: true },
    }).exec()

    if (users.length > 0) {
        users.forEach(async user => {
            const notificationData = {
                title: `Hi ${user.displayName || user.username}`,
                body: `This is a notification schedule that sent every 10 minutes to user has FCM token`,
                userId: user._id,
                type: NOTIFICATION_TYPE.common,
                dataId: null,
            }
            await NotificationService.sendAndSaveNotification(notificationData)
        })
    }
})
