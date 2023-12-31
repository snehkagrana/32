const UserModel = require('../models/user')

exports.answerQuestion = async ({ userId, guestId, itemId, isCorrect }) => {
    let user = await UserModel.findById(userId).exec()
    let result = null

    if (user) {
        // prettier-ignore
        const MUST_REDUCE_HEART = Boolean(!isCorrect) && Boolean(!user?.unlimitedHeart) && user?.heart > 0

        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    heart: MUST_REDUCE_HEART ? user.heart - 1 : user.heart,
                    // prettier-ignore
                    lastHeartAccruedAt: MUST_REDUCE_HEART ? new Date() : user.lastHeartAccruedAt || null,
                },
            },
            { new: true }
        ).exec()
    }

    return result
}
