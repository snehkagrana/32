const GuestModel = require('../models/guest')
const cacheUtil = require('../utils/cache.util')
const { daysDifference } = require('../utils/common.util')
const { initializeDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')
const { appConfig } = require('../configs/app.config')

exports.createGuest = async data => {
    return await GuestModel.create(data)
}

exports.findGuestById = async id => {
    return GuestModel.findById(id)
}

exports.logoutUser = (token, exp) => {
    const now = new Date()
    const expire = new Date(exp * 1000)
    const milliseconds = expire.getTime() - now.getTime()
    /* ------- BlackList Token ------ */
    return cacheUtil.set(token, token, milliseconds)
}

exports.syncGuest = async guestId => {
    let result = false
    let guest = await GuestModel.findById(guestId).exec()

    if (guest) {
        const daysDiff = daysDifference(guest.lastCompletedDay)
        if (daysDiff === 1) {
            // Do nothing, the streak is already up-to-date
        } else if (daysDiff === 2) {
            // User missed one day, reset streak to 0
            guest.streak = 0
        } else if (daysDiff === 0) {
            //keep streak the same
        } else {
            // User missed more than one day, keep streak at 0
            guest.streak = 0
        }

        if (daysDiff !== 0) {
            guest.xp.current = 0
            guest.xp.daily = 0
        }

        const updatedGuestResult = await GuestModel.findOneAndUpdate(
            { _id: guest._id },
            {
                $set: {
                    diamond: initializeDiamondUser(
                        guest?.diamond ? parseInt(guest.diamond, 10) : 0,
                        guest?.xp?.total ? guest.xp.total : 0,
                        guest.diamondInitialized
                    ),
                    diamondInitialized: true,
                    streak: guest.streak,
                    xp: {
                        current: guest?.xp?.current ? guest.xp.current : 0,
                        daily: guest?.xp?.daily ? guest.xp.daily : 0,
                        total: guest?.xp?.total ? guest.xp.total : 0,
                        level: 1, // keep level 1 for guest
                    },
                    // prettier-ignore
                    heart: typeof guest?.heart === 'number' ? guest.heart : appConfig.defaultHeart,

                    lastActiveAt: new Date(),
                },
            }
        )
        if (updatedGuestResult) {
            result = true
        }
    } else {
        result = false
    }

    return result
}

exports.deleteGuest = async guestId => {
    return await GuestModel.deleteOne({ _id: guestId })
}
