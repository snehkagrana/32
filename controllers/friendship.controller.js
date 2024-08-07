const FriendshipService = require('../services/friendship.service')

exports.getFollowers = async (req, res) => {
    const result = await FriendshipService.getFollowers({
        id: req.body.id,
    })
    if (Array.isArray(result)) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get followers!' })
}

exports.getFollowing = async (req, res) => {
    const result = await FriendshipService.getFollowing({
        id: req.body.id,
    })
    if (Array.isArray(result)) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get following!' })
}
