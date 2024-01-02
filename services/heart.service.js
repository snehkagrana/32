const { MAX_HEARTS } = require('../constants/app.constant')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')

exports.refillHearts = async ({ user: userParams, gemsAmount }) => {
    let result = false
    let user = await UserModel.findById(userParams._id).exec()
    let guest = await GuestModel.findById(userParams._id).exec()

    // check user diamond
    if (user && user?.diamond >= gemsAmount) {
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    heart: MAX_HEARTS,
                    diamond: user.diamond - gemsAmount,
                    lastHeartAccruedAt: new Date(),
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
                    lastHeartAccruedAt: new Date(),
                },
            },
            { new: true }
        ).exec()
        result = true
    }

    return result
}
