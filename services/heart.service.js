const { MAX_HEARTS, SERVER_TIMEZONE } = require('../constants/app.constant')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const dayjs = require('dayjs')

exports.refillHearts = async ({ user: userParams, gemsAmount }) => {
    let result = false
    let user = await UserModel.findById(userParams._id).exec()
    let guest = await GuestModel.findById(userParams._id).exec()

    const dateString = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })
    const now = dayjs(dateString).format()

    // check user diamond
    if (user && user?.diamond >= gemsAmount) {
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    heart: MAX_HEARTS,
                    diamond: user.diamond - gemsAmount,
                    lastHeartAccruedAt: now,
                },
            },
            { new: true }
        ).exec()
        result = true
    } else if (
        guest &&
        userParams.email === 'GUEST' &&
        guest?.diamond >= gemsAmount
    ) {
        guest = await GuestModel.findOneAndUpdate(
            { _id: guest._id },
            {
                $set: {
                    heart: MAX_HEARTS,
                    diamond: guest.diamond - gemsAmount,
                    lastHeartAccruedAt: now,
                },
            },
            { new: true }
        ).exec()
        result = true
    }

    return result
}
