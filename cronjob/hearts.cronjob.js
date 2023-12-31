const cron = require('node-cron')
const UserModel = require('../models/user')
const { MAX_HEARTS, HEARTS_REFILL_RATE } = require('../constants/app.constant')
const dayjs = require('dayjs')

cron.schedule('* * * * *', async function () {
    const today = new Date()
    const users = await UserModel.find({
        heart: { $lt: MAX_HEARTS },
        unlimitedHeart: null,
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    if (users.length > 0) {
        users.forEach(async user => {
            // prettier-ignore
            if (user?.lastHeartAccruedAt && dayjs(today).diff(user.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {

                await UserModel.updateOne(
                    { email: user.email },
                    { $set: {
                        heart: user.heart + 1,
                        lastHeartAccruedAt: new Date()
                    } }
                ).exec()
            }
        })
    }
})
