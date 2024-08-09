const UserModel = require('../models/user')
const FriendshipModel = require('../models/friendship')
const { default: mongoose } = require('mongoose')

exports.getFollowers = async ({ id }) => {
    const friendshipFollowers = await FriendshipModel.find({ to: id })
    const followers = await UserModel.find({
        _id: {
            $in: friendshipFollowers.map(x =>
                mongoose.Types.ObjectId(String(x.from))
            ),
        },
    })

    if (Array.isArray(followers)) {
        return followers?.map(item => ({
            _id: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            displayName: item.displayName,
            email: item.email,
            streak: item.streak,
            xp: item.xp,
            imgPath: item.imgPath,
        }))
    }
    return []
}

exports.getFollowing = async ({ id }) => {
    const friendShipFollowing = await FriendshipModel.find({ from: id })
    const following = await UserModel.find({
        _id: {
            $in: friendShipFollowing.map(x =>
                mongoose.Types.ObjectId(String(x.to))
            ),
        },
    })

    if (Array.isArray(following)) {
        return following?.map(item => ({
            _id: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            displayName: item.displayName,
            email: item.email,
            streak: item.streak,
            xp: item.xp,
            imgPath: item.imgPath,
        }))
    }
    return []
}
