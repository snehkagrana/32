const AuthService = require('../services/auth.service')
const GuestService = require('../services/guest.service')
const ReferralService = require('../services/referral.service')
const jwtConfig = require('../configs/jwt.config')
const bcryptUtil = require('../utils/bcrypt.util')
const jwtUtil = require('../utils/jwt.util')
const { appConfig } = require('../configs/app.config')
const { generateReferralCode, generateUsername } = require('../utils/common.util')

exports.sendRegisterCode = async (req, res) => {
    const isExist = await AuthService.findUserByEmail(req.body.email)
    if (isExist) {
        return res.status(400).json({
            message: 'This email has been taken',
        })
    }
    const result = await AuthService.sendRegisterCode(req.body.email)
    if (result) {
        return res.json({ message: 'OK' })
    }
    return res.status(400).json({ message: 'Failed to send register code' })
}

exports.checkRegisterCode = async (req, res) => {
    const result = await AuthService.checkRegisterCode(req.body.email)
    if (result) {
        return res.json({ message: 'OK' })
    }
    return res.status(400).json({ message: 'Register code not found' })
}

exports.verifyRegisterCode = async (req, res) => {
    const result = await AuthService.verifyRegisterCode(req.body.email, req.body.code)
    if (result) {
        return res.json({ message: 'Verified' })
    }
    return res.status(400).json({ message: 'Incorrect otp code' })
}

exports.register = async (req, res) => {
    const refCode = generateReferralCode()
    const isExist = await AuthService.findUserByEmail(req.body.email)

    if (isExist) {
        return res.status(400).json({
            redirect: '/register',
            message: 'User Already Exists!',
        })
    }
    const hashedPassword = await bcryptUtil.createHash(req.body.password)

    let newUser = {
        username: generateUsername(req.body.displayName),
        displayName: req.body.displayName,
        email: req.body.email,
        password: hashedPassword,
        role: 'basic',
        streak: 0,
        lastCompletedDay: null,
        diamond: 0,
        xp: {
            current: 0,
            daily: 0,
            total: 0,
            level: 1,
            weekly: 0,
        },
        heart: appConfig.defaultHeart || 5,
        lastHeartAccruedAt: new Date(),
        unlimitedHeart: null,
        referralCode: refCode,
        registeredAt: new Date(),
        emailVerifiedAt: req.body.clientType === 'mobile' ? new Date() : null,
        following: [],
        followers: [],
        fcmToken: '',
        lastLessonCategoryName: '',
        lastCompleteLessonDate: null,
    }

    // sync guest data
    if (req.body?.registerToken && req.body?.syncId) {
        const guestData = await GuestService.findGuestById(req.body.syncId)
        if (guestData) {
            newUser = {
                ...newUser,
                streak: guestData.streak,
                lastCompletedDay: guestData.lastCompletedDay,
                diamond: guestData.diamond,
                xp: guestData.xp,
                score: guestData.score,
                completedDays: guestData.completedDays,
                last_played: guestData.last_played,
                heart: guestData.heart || appConfig.defaultHeart,
                lastHeartAccruedAt: guestData.lastHeartAccruedAt || new Date(),
                lastClaimedGemsDailyQuest: guestData.lastClaimedGemsDailyQuest || null,
                unlimitedHeart: null,
                following: [],
                followers: [],
            }
        }
        GuestService.deleteGuest(req.body?.syncId)
    }

    const user = await AuthService.createUser(newUser)
    user.password = ''

    if (req.body?.referralCode) {
        ReferralService.create({
            userId: user._id,
            referralCode: req.body.referralCode,
        })
    }

    return res.json({
        redirect: '/login',
        message: 'User Created' /* user: user*/,
    })
}

exports.googleSignInMobile = async (req, res) => {
    const { email, displayName, photo, registerToken, syncId } = req.body
    const result = await AuthService.googleSignInMobile({
        displayName,
        email,
        photo,
        registerToken,
        syncId,
    })
    if (result) {
        return res.json(result)
    }
    return res.status(400).json({ message: 'Failed to signin with google' })
}

exports.login = async (req, res) => {
    const user = await AuthService.findUserByEmail(req.body.email)
    await AuthService.syncUser(req.body.email)
    if (user) {
        const isMatched = await bcryptUtil.compareHash(req.body.password, user.password)
        if (isMatched) {
            const token = await jwtUtil.createToken({
                _id: user._id,
                email: user.email,
            })

            return res.json({
                data: {
                    access_token: token,
                    token_type: 'Bearer',
                    expires_in: jwtConfig.ttl,
                },
                message: 'Success.',
            })
        }

        if (user.email === undefined || user.email === '') {
            var redir = {
                redirect: '/updateemail',
                message: 'It is mandatory to update your email.',
            }
            return res.json(redir)
        }
    }

    return res.status(400).json({ message: 'Incorrect Email or Wrong Password' })
}

exports.getUser = async (req, res) => {
    const user = await AuthService.findUserById(req.user._id)
    user.password = ''
    return res.json({
        data: user,
        message: 'Success.',
    })
}

exports.syncUser = async (req, res) => {
    const result = await AuthService.syncUser(req.user.email)
    if (result) {
        return res.json({ message: 'Sync successfully.' })
    }
    return res.status(400).json({ message: 'Failed to sync.' })
}

exports.logout = async (req, res) => {
    await AuthService.logoutUser(req.token, req.user.exp)
    return res.json({ message: 'Logged out successfully.' })
}

exports.sendLinkForgotPassword = async (req, res) => {
    const result = await AuthService.sendLinkForgotPassword(req.body.email, req.body.baseUrl)
    if (result) {
        return res.json({ message: 'Send link successfully.' })
    }
    return res.status(400).json({ message: 'Failed to send forgot password link.' })
}

exports.sendCodeForgotPassword = async (req, res) => {
    const isExist = await AuthService.findUserByEmail(req.body.email)
    if (!isExist) {
        return res.status(400).json({
            message: 'Email not found',
        })
    }

    const result = await AuthService.sendCodeForgotPassword(req.body.email)
    if (result) {
        return res.json({ message: 'Send otp code successfully.' })
    }
    return res.status(400).json({ message: 'Failed to send otp code forgot password.' })
}

exports.verifyCodeForgotPassword = async (req, res) => {
    const result = await AuthService.verifyCodeForgotPassword(req.body.email, req.body.code)
    if (result) {
        return res.json({ message: 'Verified.' })
    }
    return res.status(400).json({ message: 'Incorrect otp code' })
}

exports.resetPassword = async (req, res) => {
    const result = await AuthService.resetPassword({
        email: req.body.email,
        password: req.body.password,
        token: req.body.token,
        code: req.body.code,
    })
    if (result) {
        return res.json({ message: 'Reset Password successfully.' })
    }
    return res.status(400).json({ message: 'Failed to reset password.' })
}

exports.syncRegisterGoogle = async (req, res) => {
    let result = false
    // sync guest data
    if (req.body?.registerToken && req.body?.syncId) {
        const guestData = await GuestService.findGuestById(req.body.syncId)
        if (guestData) {
            const data = {
                streak: guestData.streak,
                lastCompletedDay: guestData.lastCompletedDay,
                diamond: guestData.diamond,
                xp: guestData.xp,
                score: guestData.score,
                completedDays: guestData.completedDays,
                last_played: guestData.last_played,
                heart: guestData.heart || appConfig.defaultHeart,
                lastHeartAccruedAt: guestData.lastHeartAccruedAt || new Date(),
                lastClaimedGemsDailyQuest: guestData.lastClaimedGemsDailyQuest || null,
                unlimitedHeart: null,
                lastLessonCategoryName: guestData.lastLessonCategoryName || '',
                lastCompleteLessonDate: guestData.lastCompleteLessonDate || null,
            }
            result = await AuthService.syncRegisterGoogle({
                email: req.user.email,
                data,
            })
            GuestService.deleteGuest(req.body.syncId)
        }
    }
    if (result) {
        return res.json({ message: 'Sync successfully.' })
    } else {
        return res.status(400).json({ message: 'Failed to sync.' })
    }
}
