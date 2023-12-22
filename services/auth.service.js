const UserModel = require('../models/user')
const cacheUtil = require('../utils/cache.util')
const { daysDifference } = require('../utils/common.util')
const { initializeDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')

exports.createUser = user => {
    return UserModel.create(user)
}

exports.findUserByEmail = async email => {
    return UserModel.findOne({ email })
}

exports.findUserById = async id => {
    return await UserModel.findById(id)
}

exports.logoutUser = (token, exp) => {
    const now = new Date()
    const expire = new Date(exp * 1000)
    const milliseconds = expire.getTime() - now.getTime()
    /* ------- BlackList Token ------ */
    return cacheUtil.set(token, token, milliseconds)
}

exports.syncUser = async email => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()

    if (user) {
        const daysDiff = daysDifference(user.lastCompletedDay)
        if (daysDiff === 1) {
            // Do nothing, the streak is already up-to-date
        } else if (daysDiff === 2) {
            // User missed one day, reset streak to 0
            user.streak = 0
        } else if (daysDiff === 0) {
            //keep streak the same
        } else {
            // User missed more than one day, keep streak at 0
            user.streak = 0
        }

        if (daysDiff !== 0) {
            user.xp.current = 0
            user.xp.daily = 0
        }

        const updateUserResult = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    diamond: initializeDiamondUser(
                        user?.diamond ? parseInt(user.diamond, 10) : 0,
                        user?.xp?.total ? user.xp.total : 0,
                        user.diamondInitialized
                    ),
                    diamondInitialized: true,
                    streak: user.streak,
                    xp: {
                        current: user?.xp?.current ? user.xp.current : 0,
                        daily: user?.xp?.daily ? user.xp.daily : 0,
                        total: user?.xp?.total ? user.xp.total : 0,
                        level: getLevelByXpPoints(
                            user?.xp?.total ? parseInt(user.xp.total, 10) : 0
                        ),
                    },
                },
            }
        )
        if (updateUserResult) {
            result = true
        }
    } else {
        result = false
    }

    return result
}
