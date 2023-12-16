const UserModel = require('../models/user')
const cacheUtil = require('../utils/cache.util')
const { daysDifference } = require('../utils/common.util')
const { getDiamondUser } = require('../utils/reward.util')
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
    UserModel.findOne({ email }, async (err, doc) => {
        if (err) {
            console.log('ERROR', err)
        } else {
            if (doc) {
                const daysDiff = daysDifference(doc.lastCompletedDay)
                if (daysDiff === 1) {
                    // Do nothing, the streak is already up-to-date
                } else if (daysDiff === 2) {
                    // User missed one day, reset streak to 0
                    doc.streak = 0
                } else if (daysDiff === 0) {
                    //keep streak the same
                } else {
                    // User missed more than one day, keep streak at 0
                    doc.streak = 0
                }

                if (daysDiff !== 0) {
                    doc.xp.current = 0
                    doc.xp.daily = 0
                }

                // console.log("getDiamondUser", getDiamondUser(doc.diamond))

                await UserModel.findOneAndUpdate(
                    { email },
                    {
                        $set: {
                            diamond: getDiamondUser(
                                doc?.diamond ? parseInt(doc.diamond, 10) : 0,
                                doc?.xp?.total ? doc.xp.total : 0
                            ),
                            streak: doc.streak,
                            xp: {
                                current: doc?.xp?.current ? doc.xp.current : 0,
                                daily: doc?.xp?.daily ? doc.xp.daily : 0,
                                total: doc?.xp?.total ? doc.xp.total : 0,
                                level: getLevelByXpPoints(
                                    doc?.xp?.total
                                        ? parseInt(doc.xp.total, 10)
                                        : 0
                                ),
                            },
                        },
                    }
                )
            }
        }
    })
}
