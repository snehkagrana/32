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
    const result = await AccountService.checkAvailabilityUsername({
        username: req.body.username,
        authenticatedUserEmail: req.user.email,
    })
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

exports.uploadPhoto = async (req, res) => {
    return res.json({
        message: 'Ok',
        data: req.file.location,
    })
}

exports.changeAvatar = async (req, res) => {
    const result = await AccountService.changeAvatar(
        req.user.email,
        req.body.avatarId
    )
    if (result) {
        return res.json({
            message: 'Your avatar has been change',
        })
    }
    return res.status(400).json({ message: 'Failed to update avatar!' })
}

exports.toggleFollow = async (req, res) => {
    const result = await AccountService.toggleFollow({
        authUserId: req.user._id,
        action: req.body.action,
        userId: req.body.userId,
    })
    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed!' })
}

exports.syncFriendship = async (req, res) => {
    const result = await AccountService.syncFriendship({
        userId: req.user._id,
    })
    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed!' })
}

exports.searchFriends = async (req, res) => {
    const result = await AccountService.searchFriends({
        userId: req.user._id,
        searchTerm: req.query.searchTerm,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed!' })
}
