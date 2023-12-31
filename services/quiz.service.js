const UserModel = require('../models/user')

exports.answerQuestion = async ({ userId, guestId, itemId, isCorrect }) => {
    let user = await UserModel.findById(userId).exec()
    let result = null

    if (user) {
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    // prettier-ignore
                    heart:
                        Boolean(!isCorrect) && Boolean(!user?.unlimitedHeart) && user?.heart > 0
                            ? user.heart - 1
                            : user.heart,
                    lastHeartAccruedAt: new Date(),
                },
            },
            { new: true }
        ).exec()
    }

    return result
}
