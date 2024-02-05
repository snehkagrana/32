const AccountService = require('../services/account.service')

exports.getMyRewards = async (req, res) => {
    const result = await AccountService.getMyRewards(req.user.email)
    if (result) {
        return res.json({
            message: 'Success',
            data:
                result?.length > 0
                    ? result.map(x => ({
                          ...x._doc,
                          currencyValue: x._doc?.currencyValue
                              ? x._doc.currencyValue.toString()
                              : null,
                      }))
                    : [],
        })
    }
    return res.status(400).json({ message: 'Failed to get my reward' })
}

exports.markSeenMyReward = async (req, res) => {
    const result = await AccountService.markSeenMyReward(
        req.user.email,
        req.body
    )
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed!' })
}

exports.checkAvailabilityUsername = async (req, res) => {
    const result = await AccountService.checkAvailabilityUsername(
        req.body.username
    )
    if (result) {
        return res.json({
            message: 'Available',
        })
    }
    return res.status(400).json({ message: 'Not available!' })
}

exports.sendCodeVerifyEmail = async (req, res) => {
    const result = await AccountService.sendCodeVerifyEmail({
        email: req.body.email,
    })
    if (result) {
        return res.json({
            message: 'Ok',
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to send verify email code!' })
}

exports.verifyEmail = async (req, res) => {
    const { code, email, newEmail } = req.body
    const result = await AccountService.verifyEmail({ code, email, newEmail })
    if (result) {
        return res.json({
            message: 'Ok',
        })
    }
    return res
        .status(400)
        .json({ message: 'Failed to send verify email code!' })

    return res.status(400).json({ message: 'Not available!' })
}

exports.updateProfile = async (req, res) => {
    const result = await AccountService.updateProfile(req.user.email, req.body)
    if (result) {
        return res.json({
            message: 'Profile updated',
        })
    }
    return res.status(400).json({ message: 'Failed to update profile!' })
}
