const { MAX_HEARTS } = require('../constants/app.constant')
const UserModel = require('../models/user')

exports.refillHearts = async (userId, gemsAmount) => {
    let user = await UserModel.findById(userId).exec()
    let result = false

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
    }

    return result
}
