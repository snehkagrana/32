const UserModel = require('../models/user')
const dayjs = require('dayjs')

exports.answerQuestion = async ({ userId, guestId, itemId, isCorrect }) => {
    let user = await UserModel.findById(userId).exec()
    let result = null

    if (user) {
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    heart:
                        !isCorrect && user.heart > 0
                            ? user.heart - 1
                            : user.heart,
                    lastHeartAccruedAt: new Date(),
                },
            },
            { new: true }
        ).exec()

        console.log('user-->>', user)
    }

    return result
}
