const GuestService = require('../services/guest.service')
const jwtUtil = require('../utils/jwt.util')
const { appConfig } = require('../configs/app.config')
const { DEFAULT_GUEST_NAME, SERVER_TIMEZONE } = require('../constants/app.constant')
const base64url = require('base64url')
const crypto = require('crypto')
const dayjs = require('dayjs')

exports.init = async (req, res) => {
    const dateString = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })
    const now = dayjs(dateString).format()

    const isExist = await GuestService.findGuestById(req.body.email)
    const registerToken = base64url(crypto.randomBytes(20))

    if (isExist) {
        return res.status(400).json({
            message: 'Guest id already exists!',
        })
    }

    const data = {
        displayName: DEFAULT_GUEST_NAME,
        email: '',
        role: 'basic',
        streak: 0,
        lastCompletedDay: null,
        diamond: 0,
        diamondInitialized: true,
        xp: {
            current: 0,
            daily: 0,
            total: 0,
            level: 1,
            weekly: 0,
        },
        heart: appConfig.defaultHeart || 5,
        lastHeartAccruedAt: now,
        registerToken,
        createdAt: now,
    }

    const guest = await GuestService.createGuest(data)

    const accessToken = await jwtUtil.createToken({
        _id: guest._id,
        email: 'GUEST',
    })

    return res.json({
        message: 'Success',
        data: guest,
        accessToken,
    })
}

exports.syncGuest = async (req, res) => {
    const result = await GuestService.syncGuest(req.user._id)
    if (result) {
        return res.json({ message: 'Sync successfully.' })
    }
    return res.status(400).json({ message: 'Failed to sync.' })
}

exports.getGuest = async (req, res) => {
    if (req.user._id && req.user.email === 'GUEST') {
        const guest = await GuestService.findGuestById(req.user._id)
        return res.json({
            data: guest,
            message: 'Success.',
        })
    }

    return res.status(400).json({
        message: 'Something wen wrong!',
    })
}

exports.logout = async (req, res) => {
    await GuestService.logoutUser(req.token, req.user.exp)
    return res.json({ message: 'Logged out successfully.' })
}
