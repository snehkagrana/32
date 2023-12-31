const UserModel = require('../models/user')
const cacheUtil = require('../utils/cache.util')
const { daysDifference, generateReferralCode } = require('../utils/common.util')
const { mailTransporter } = require('../utils/mail.util')
const { initializeDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')
const base64url = require('base64url')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { sendEmailForgotPassword } = require('../email/send-email')
const { appConfig } = require('../configs/app.config')
const dayjs = require('dayjs')

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
    const today = new Date()
    const refCode = generateReferralCode()
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
                    // prettier-ignore
                    heart: typeof user?.heart === 'number' ? user.heart : appConfig.defaultHeart,
                    // prettier-ignore
                    referralCode: !user?.referralCode ? refCode : user.referralCode,

                    // prettier-ignore
                    unlimitedHeart: user?.unlimitedHeart && dayjs(user.unlimitedHeart).isAfter(dayjs(today).toISOString(), 'second') ? user.unlimitedHeart : null,
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

exports.sendLinkForgotPassword = async (email, baseUrl) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        const token = base64url(crypto.randomBytes(20))
        await UserModel.findOneAndUpdate(
            { email },
            { $set: { password_reset_token: token } }
        ).exec()

        const recoveryLink = `${baseUrl}/reset-password/${user.email}/${token}`

        await sendEmailForgotPassword({
            link: recoveryLink,
            from: process.env.MAIL,
            to: user.email,
            name: user?.displayName ? user.displayName : user?.username ?? '',
        })

        result = true
    } else {
        result = false
    }
    return result
}

exports.resetPassword = async (email, password, token) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()

    if (user && token === user.password_reset_token) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            { $set: { password: hashedPassword, password_reset_token: '' } }
        )
        result = true
    } else {
        result = false
    }
    return result
}
