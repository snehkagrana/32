const { appConfig } = require('../configs/app.config')
const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')
const { validateEmail } = require('../utils/common.util')
const NotificationService = require('../services/notification.service')
const {
    NOTIFICATION_TYPE,
    MAX_FREEZE_STREAK,
    GEMS_STREAK_FREEZE_AMOUNT,
} = require('../constants/app.constant')
const { getFirstName, getFullName } = require('../utils/user.util')
const DailyQuestService = require('../services/daily-quest.service')
const {
    ACTION_NAME_FOLLOW_FRIENDS,
} = require('../constants/daily-quest.constant')

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
                    firstName: body.firstName ?? user.firstName,
                    lastName: body.lastName ?? user.lastName,
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

    let notificationData = null

    if (authUser && user && action && userId !== authUserId) {
        notificationData = {
            userId: userId,
            type: NOTIFICATION_TYPE.friends_follow,
            dataId: null,
            shouldSaveHistory: true,
        }

        if (action === 'follow') {
            notificationData = {
                ...notificationData,
                title: `Following`,
                body: `Hey ${getFirstName(user)}!, ${getFirstName(
                    authUser
                )} added you as a friend.`,
            }

            // prettier-ignore
            let currentFollowing = authUser?.following?.filter(x => x.userId !== userId) || []
            let newFollowing = [
                ...currentFollowing,
                {
                    userId: user._id,
                    // prettier-ignore
                    displayName: getFirstName(user),
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
                    displayName: getFullName(authUser),
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

            await NotificationService.sendAndSaveNotification(notificationData)

            await DailyQuestService.syncDailyQuest({
                userId: authUserId,
                actionName: ACTION_NAME_FOLLOW_FRIENDS,
                value: 1,
            })

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
                displayName: getFullName(_user),
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
                displayName: getFullName(_user),
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

exports.searchFriends = async ({ userId, searchTerm }) => {
    let result = null
    let query = {}
    if (searchTerm) {
        query.$or = [
            { displayName: { $regex: searchTerm } },
            { firstName: { $regex: searchTerm } },
            { lastName: { $regex: searchTerm } },
            { username: { $regex: searchTerm } },
        ]
        const users = await UserModel.find(query)
        // prettier-ignore
        let filteredUsers = users?.filter(x => {
            if(x._id !== userId && !validateEmail(x?.username)) {
                return x
            }
        }) || []
        result = filteredUsers?.map(x => ({
            avatarId: x._doc?.avatarId,
            _id: x._doc?._id,
            displayName: getFirstName(x._doc),
            username: x._doc?.username || '',
            email: x._doc?.email || '',
            xp: x._doc?.xp,
            imgPath: x._doc?.imgPath,
        }))
    } else {
        result = null
    }

    return result
}

exports.saveFCMToken = async ({ email, token, os }) => {
    let result = false
    const previousFcmUserToken = await UserModel.findOne({
        fcmToken: token,
    }).exec()
    if (previousFcmUserToken) {
        await UserModel.findOneAndUpdate(
            { email: previousFcmUserToken.email },
            {
                $set: {
                    fcmToken: '',
                },
            },
            { new: true }
        ).exec()
    }

    let user = await UserModel.findOne({ email }).exec()
    if (user && token) {
        // update user
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    fcmToken: token,
                    os: os,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.removeFCMToken = async ({ email }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        // update user
        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    fcmToken: null,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.saveNextLesson = async ({ email, skill, category, subCategory }) => {
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    // prettier-ignore
                    nextLesson: {
                        skill: skill ? skill : user?.nextLesson?.skill || '',
                        category: category ? category : user?.nextLesson?.category || '',
                        subCategory: subCategory ? subCategory : user?.nextLesson?.subCategory || '',
                    },
                },
            },
            { new: true }
        ).exec()
    }
    return {
        skill: skill ? skill : user?.nextLesson?.skill || '',
        category: category ? category : user?.nextLesson?.category || '',
        subCategory: subCategory
            ? subCategory
            : user?.nextLesson?.subCategory || '',
    }
}

exports.refillFreezeStreak = async ({ email, amount }) => {
    let result = false

    let user = await UserModel.findOne({ email }).exec()

    const prevUserFreeze = user?.availableStreakFreeze || 0
    const totalPurchasedGems = GEMS_STREAK_FREEZE_AMOUNT * amount

    const FREEZE_AMOUNT =
        amount + prevUserFreeze <= MAX_FREEZE_STREAK
            ? amount + prevUserFreeze
            : MAX_FREEZE_STREAK
    if (
        user &&
        user?.availableStreakFreeze < MAX_FREEZE_STREAK &&
        user?.diamond >= totalPurchasedGems
    ) {
        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    availableStreakFreeze: FREEZE_AMOUNT,
                    diamond: user.diamond - totalPurchasedGems,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}
