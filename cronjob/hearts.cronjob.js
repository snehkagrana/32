const cron = require('node-cron')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const { MAX_HEARTS, HEARTS_REFILL_RATE } = require('../constants/app.constant')
const dayjs = require('dayjs')

cron.schedule('* * * * *', async function () {
    const today = new Date()
    const users = await UserModel.find({
        heart: { $lt: MAX_HEARTS },
        unlimitedHeart: null,
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    const guests = await GuestModel.find({
        heart: { $lt: MAX_HEARTS },
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

    // guest
    if (guests.length > 0) {
        guests.forEach(async guest => {
            // prettier-ignore
            if (guest?.lastHeartAccruedAt && dayjs(today).diff(guest.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {
                await GuestModel.updateOne(
                    { _id: guest._id },
                    { $set: {
                        heart: guest.heart + 1,
                        lastHeartAccruedAt: new Date()
                    } }
                ).exec()
            }
        })
    }
})
