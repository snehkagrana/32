const AuthService = require('../services/auth.service')
const jwtConfig = require('../configs/jwt.config')
const bcryptUtil = require('../utils/bcrypt.util')
const jwtUtil = require('../utils/jwt.util')
const { appConfig } = require('../configs/app.config')
const { generateReferralCode } = require('../utils/common.util')

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

    const newUser = {
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
        },
        heart: appConfig.defaultHeart,
        lastHeartAccruedAt: new Date(),
        referralCode: refCode,
        registeredAt: new Date(),
    }

    const user = await AuthService.createUser(newUser)
    user.password = ''

    return res.json({
        redirect: '/login',
        message: 'User Created' /* user: user*/,
    })
}

exports.login = async (req, res) => {
    const user = await AuthService.findUserByEmail(req.body.email)
    await AuthService.syncUser(req.body.email)
    if (user) {
        const isMatched = await bcryptUtil.compareHash(
            req.body.password,
            user.password
        )
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

    return res
        .status(400)
        .json({ message: 'Incorrect Email or Wrong Password' })
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
    const result = await AuthService.sendLinkForgotPassword(
        req.body.email,
        req.body.baseUrl
    )
    if (result) {
        return res.json({ message: 'Send link successfully.' })
    }
    return res
        .status(400)
        .json({ message: 'Failed to send forgot password link.' })
}

exports.resetPassword = async (req, res) => {
    const result = await AuthService.resetPassword(
        req.body.email,
        req.body.password,
        req.body.token
    )
    if (result) {
        return res.json({ message: 'Reset Password successfully.' })
    }
    return res.status(400).json({ message: 'Failed to reset password.' })
}
