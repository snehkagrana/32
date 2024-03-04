const { appConfig } = require('../configs/app.config')
const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')

var ObjectId = require('mongoose').Types.ObjectId

exports.getMyRewards = async email => {
    const user = await UserModel.findOne({ email })
    if (user) {
        return user._doc.rewards
    }
}

exports.markSeenMyReward = async (email, body) => {
    let user = await UserModel.findOne({ email }).exec()
    let result = false

    if (user) {
        // update user rewards
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    rewards: user.rewards.map(x => {
                        if (
                            x.rewardId == body.rewardId &&
                            x.variantId == body.variantId
                        ) {
                            return {
                                ...x._doc,
                                hasSeen: true,
                                isRedeemed: true,
                            }
                        } else {
                            return x._doc
                        }
                    }),
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.checkAvailabilityUsername = async ({
    username,
    authenticatedUserEmail,
}) => {
    let result = false
    // prettier-ignore
    const authenticatedUser = await UserModel.findOne({ email: authenticatedUserEmail }).exec()
    const user = await UserModel.findOne({ username }).exec()
    if (user && authenticatedUser?.username === username) {
        result = true
    } else if (!user) {
        result = true
    } else {
        result = false
    }

    return result
}

exports.sendCodeVerifyEmail = async ({ email }) => {
    const code = generateOTP(4)
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        await UserModel.findOneAndUpdate(
            { email },
            { $set: { verifyEmailCode: code } },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.verifyEmail = async ({ code, email }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user && user?.verifyEmailCode === code) {
        user = await UserModel.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    verifyEmailCode: '',
                    emailVerifiedAt: new Date(),
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.updateProfile = async (email, body) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        // update user
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    // email: body.email ?? user.email, // don't update email for now
                    username: body.username ?? user.username,
                    displayName: body.displayName ?? user.displayName,
                    phoneNumber: body.phoneNumber ?? user.phoneNumber ?? null,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.changeAvatar = async (email, avatarId) => {
    let result = false
    const avatarExtension = 'jpg'
    let user = await UserModel.findOne({ email }).exec()
    if (user && avatarId) {
        // update user
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    avatarId,
                    imgPath: `${appConfig.appBaseUrl}/static-files/avatars/${avatarId}.${avatarExtension}`,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.toggleFollow = async ({ authUserId, action, userId }) => {
    let result = false
    let authUser = await UserModel.findOne({ _id: authUserId }).exec()
    let user = await UserModel.findOne({ _id: userId }).exec()

    if (authUser && user && action && userId !== authUserId) {
        if (action === 'follow') {
            // prettier-ignore
            let currentFollowing = authUser?.following?.filter(x => x.userId !== userId) || []
            let newFollowing = [
                ...currentFollowing,
                {
                    userId: user._id,
                    // prettier-ignore
                    displayName: user?.displayName ? user.displayName : user.username || '',
                    totalXp: user?.xp?.total ? user.xp.total : 0,
                    level: user?.xp?.level ? user.xp.level : 1,
                    imgPath: user?.imgPath ? user.imgPath : '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]
            // update user
            authUser = await UserModel.findOneAndUpdate(
                { _id: authUserId },
                {
                    $set: {
                        following: newFollowing,
                    },
                },
                { new: true }
            ).exec()

            // prettier-ignore
            let currentFollowers = user?.followers?.filter(x => x.userId !== authUserId) || []
            let newFollowers = [
                ...currentFollowers,
                {
                    userId: authUser._id,
                    // prettier-ignore
                    displayName: authUser?.displayName ? authUser.displayName : authUser.username || '',
                    totalXp: authUser?.xp?.total ? authUser.xp.total : 0,
                    level: authUser?.xp?.level ? authUser.xp.level : 1,
                    imgPath: authUser?.imgPath ? authUser.imgPath : '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]
            user = await UserModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        followers: newFollowers,
                    },
                },
                { new: true }
            ).exec()

            result = true
        } else if (action === 'unfollow') {
            // prettier-ignore
            let currentFollowing = authUser?.following?.filter(x => x.userId !== userId) || []
            // update user
            authUser = await UserModel.findOneAndUpdate(
                { _id: authUserId },
                {
                    $set: {
                        following: currentFollowing,
                    },
                },
                { new: true }
            ).exec()

            // prettier-ignore
            let currentFollowers = user?.followers?.filter(x => x.userId !== authUserId) || []
            user = await UserModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        followers: currentFollowers,
                    },
                },
                { new: true }
            ).exec()

            result = true
        }
    } else {
        result = false
    }
    return result
}

exports.syncFriendship = async ({ userId }) => {
    let result = false
    let authUser = await UserModel.findOne({ _id: userId }).exec()

    const followers = authUser?.followers || []
    const following = authUser?.following || []

    if (followers.length > 0) {
        let newFollowers = []
        for (const f of followers) {
            const _user = await UserModel.findOne({ _id: f.userId })
            newFollowers.push({
                // prettier-ignore
                displayName: _user?.displayName ? _user.displayName : _user.username || '',
                totalXp: _user?.xp?.total ? _user.xp.total : f.totalXp,
                level: _user?.xp?.level ? _user.xp.level : f.level,
                imgPath: _user?.imgPath ? _user.imgPath : '',
                updatedAt: new Date(),
                createdAt: f.createdAt,
                userId: f.userId,
            })
        }
        // update user
        authUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    followers: newFollowers,
                },
            },
            { new: true }
        ).exec()
        result = true
    }

    if (following.length > 0) {
        let newFollowing = []
        for (const f of following) {
            const _user = await UserModel.findOne({ _id: f.userId })
            newFollowing.push({
                // prettier-ignore
                displayName: _user?.displayName ? _user.displayName : _user.username || '',
                totalXp: _user?.xp?.total ? _user.xp.total : f.totalXp,
                level: _user?.xp?.level ? _user.xp.level : f.level,
                imgPath: _user?.imgPath ? _user.imgPath : '',
                updatedAt: new Date(),
                createdAt: f.createdAt,
                userId: f.userId,
            })
        }
        // update user
        authUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    following: newFollowing,
                },
            },
            { new: true }
        ).exec()
        result = true
    }

    return result
}
