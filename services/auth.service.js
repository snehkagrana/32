const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const VerifyRegisterCodeModel = require('../models/verifyRegisterCode')
const cacheUtil = require('../utils/cache.util')
const {
    daysDifference,
    generateReferralCode,
    getToday,
    generateUsername,
} = require('../utils/common.util')
const { mailTransporter } = require('../utils/mail.util')
const { initializeDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')
const base64url = require('base64url')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const {
    sendEmailForgotPassword,
    sendEmailVerifyRegisterCode,
    sendOtpEmailForgotPassword,
} = require('../email/send-email')
const { appConfig } = require('../configs/app.config')
const dayjs = require('dayjs')
const { generateOTP } = require('../utils/otp.util')
const jwtUtil = require('../utils/jwt.util')
const jwtConfig = require('../configs/jwt.config')

exports.sendRegisterCode = async email => {
    const code = generateOTP(4)
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    let isExist = await VerifyRegisterCodeModel.findOne({ email })

    if (!user) {
        if (isExist) {
            isExist = await VerifyRegisterCodeModel.findOneAndUpdate(
                { email },
                { $set: { code } },
                { new: true }
            ).exec()
        } else {
            isExist = await VerifyRegisterCodeModel.create({ email, code })
        }

        await sendEmailVerifyRegisterCode({
            code,
            from: process.env.MAIL,
            to: email,
        })

        result = true
    }
    return result
}

exports.checkRegisterCode = async email => {
    let result = false
    let isExist = await VerifyRegisterCodeModel.findOne({ email })
    if (isExist) {
        result = true
    }
    return result
}

exports.verifyRegisterCode = async (email, code) => {
    let result = false
    let isExist = await VerifyRegisterCodeModel.findOne({
        email,
        code,
    }).exec()
    if (isExist) {
        result = true
    } else {
        result = false
    }
    return result
}

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
                    // prettier-ignore
                    username: !user?.username ? generateUsername(user.displayName) : user.username,
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

exports.sendCodeForgotPassword = async email => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        const code = generateOTP(4)
        await UserModel.findOneAndUpdate(
            { email },
            { $set: { passwordResetCode: code } }
        ).exec()
        await sendOtpEmailForgotPassword({
            code: code,
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

exports.verifyCodeForgotPassword = async (email, code) => {
    let result = false
    let userExist = await UserModel.findOne({
        email,
        passwordResetCode: code,
    }).exec()
    if (userExist) {
        result = true
    } else {
        result = false
    }
    return result
}

exports.resetPassword = async ({ email, password, token, code }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()

    // request coming from web app
    if (user && token && token === user.password_reset_token) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            { $set: { password: hashedPassword, password_reset_token: '' } }
        )
        result = true
    }

    // request coming form mobile app
    else if (
        user &&
        code &&
        parseInt(code) === parseInt(user?.passwordResetCode)
    ) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            { $set: { password: hashedPassword, passwordResetCode: '' } }
        )
        result = true
    }

    return result
}

exports.syncRegisterGoogle = async ({ email, data }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()

    if (user) {
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    streak: data.streak,
                    lastCompletedDay: data.lastCompletedDay,
                    diamond: data.diamond,
                    xp: data.xp,
                    score: data.score,
                    completedDays: data.completedDays,
                    last_played: data.last_played,
                    heart: data.heart || appConfig.defaultHeart,
                    lastHeartAccruedAt: data.lastHeartAccruedAt || new Date(),
                    lastClaimedGemsDailyQuest:
                        data.lastClaimedGemsDailyQuest || null,
                    unlimitedHeart: null,
                },
            }
        )
        if (user) {
            result = true
        }
    } else {
        result = false
    }

    return result
}

exports.googleSignInMobile = async ({
    displayName,
    email,
    photo,
    registerToken,
    syncId,
}) => {
    const refCode = generateReferralCode()

    /**
     * checking if another user with same email already exists
     **/
    let user = await UserModel.findOne({ email }).exec()

    if (user) {
        const token = await jwtUtil.createToken({
            _id: user._id,
            email: user.email,
        })
        return {
            access_token: token,
            token_type: 'Bearer',
            expires_in: jwtConfig.ttl,
            message: 'Success.',
        }
    } else {
        let newGoogleUser = {
            username: generateUsername(displayName),
            displayName: displayName,
            email: email,
            password: '',
            role: 'basic',
            streak: 0,
            lastCompletedDay: null,
            imgPath: photo || null,
            diamond: 0,
            xp: {
                current: 0,
                daily: 0,
                total: 0,
                level: 1,
            },
            heart: appConfig.defaultHeart || 5,
            lastHeartAccruedAt: new Date(),
            unlimitedHeart: null,
            referralCode: refCode,
            registeredAt: new Date(),
            emailVerifiedAt: new Date(),
        }

        // sync guest data
        if (registerToken && syncId) {
            const guestData = await GuestModel.findById(syncId)
            if (guestData) {
                newGoogleUser = {
                    ...newGoogleUser,
                    streak: guestData.streak,
                    lastCompletedDay: guestData.lastCompletedDay,
                    diamond: guestData.diamond,
                    xp: guestData.xp,
                    score: guestData.score,
                    completedDays: guestData.completedDays,
                    last_played: guestData.last_played,
                    heart: guestData.heart || appConfig.defaultHeart,
                    lastHeartAccruedAt:
                        guestData.lastHeartAccruedAt || new Date(),
                    lastClaimedGemsDailyQuest:
                        guestData.lastClaimedGemsDailyQuest || null,
                    unlimitedHeart: null,
                }
                GuestModel.deleteOne({ _id: syncId })
            }
        }
        const newUser = await UserModel.create(newGoogleUser)
        const token = await jwtUtil.createToken({
            _id: newUser._id,
            email: newUser.email,
        })
        return {
            access_token: token,
            token_type: 'Bearer',
            expires_in: jwtConfig.ttl,
            message: 'Success.',
        }
    }
}
