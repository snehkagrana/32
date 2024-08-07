const { appConfig } = require('../configs/app.config')
const UserModel = require('../models/user')
const { generateOTP } = require('../utils/otp.util')
const { validateEmail } = require('../utils/common.util')
const NotificationService = require('../services/notification.service')
const {
    NOTIFICATION_TYPE,
    MAX_FREEZE_STREAK,
    GEMS_STREAK_FREEZE_AMOUNT,
    GEMS_STREAK_CHALLENGE_AMOUNT,
    SERVER_TIMEZONE,
    STREAK_CHALLENGE_REWARD_BY_DAY,
} = require('../constants/app.constant')
const { getFirstName, getFullName } = require('../utils/user.util')
const DailyQuestService = require('../services/daily-quest.service')
const {
    ACTION_NAME_FOLLOW_FRIENDS,
} = require('../constants/daily-quest.constant')
const dayjs = require('dayjs')
const { getStreakDiffDays } = require('../utils/streak.util')
const FriendshipModel = require('../models/friendship')

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

            result = await FriendshipModel.create({
                from: authUserId,
                to: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            await NotificationService.sendAndSaveNotification(notificationData)

            await DailyQuestService.syncDailyQuest({
                userId: authUserId,
                actionName: ACTION_NAME_FOLLOW_FRIENDS,
                value: 1,
            })
            result = true
        } else if (action === 'unfollow') {
            result = await FriendshipModel.deleteMany({
                from: authUserId,
                to: userId,
            })
            result = true
        }
    } else {
        result = false
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

exports.joinStreakChallenge = async ({ email, numberOfDay }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()
    let progress = 0

    const streakDiffDays = getStreakDiffDays(
        user.lastCompletedDay,
        user.userTimezone
    )

    if (
        user?.streakChallenge?.isActive &&
        user?.streakChallenge?.progress !== user?.streakChallenge?.numberOfDay
    ) {
        progress = 1
    } else if (streakDiffDays === 0) {
        progress = 1
    }

    const NOW = new Date()
    const startDateUTC = dayjs(NOW).toISOString()
    const endDateUTC = dayjs(NOW).add(numberOfDay, 'day').toISOString()

    const isAbleToJoinChallenge = user?.streakChallenge?.isActive
        ? user?.streakChallenge?.progress === user?.streakChallenge?.numberOfDay
        : true

    if (
        user &&
        isAbleToJoinChallenge &&
        user?.diamond >= GEMS_STREAK_CHALLENGE_AMOUNT
    ) {
        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    streakChallenge: {
                        isActive: true,
                        numberOfDay: numberOfDay,
                        progress,
                        startDateUTC,
                        endDateUTC,
                        isExtend: false,
                        isFailed: false,
                    },
                    diamond: user.diamond - GEMS_STREAK_CHALLENGE_AMOUNT,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.extendStreakChallenge = async ({ email, numberOfDay }) => {
    let result = false
    let user = await UserModel.findOne({ email }).exec()

    const isActiveStreakChallenge = user?.streakChallenge?.isActive

    // const NOW = new Date()
    const prevStreakChallenge = user.streakChallenge || {}

    // prettier-ignore
    const startDateUTC = dayjs(user?.streakChallenge?.startDateUTC).toISOString()
    const endDateUTC = dayjs(startDateUTC).add(numberOfDay, 'day').toISOString()

    const newStreakChallenge = {
        ...prevStreakChallenge,
        isActive: true,
        numberOfDay: numberOfDay,
        startDateUTC,
        endDateUTC,
        isExtend: true,
        isFailed: false,
    }

    if (user && isActiveStreakChallenge) {
        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    streakChallenge: newStreakChallenge,
                    // diamond: user.diamond - GEMS_STREAK_CHALLENGE_AMOUNT,
                },
            },
            { new: true }
        ).exec()
        result = true
    }
    return result
}

exports.claimRewardStreakChallenge = async ({ email }) => {
    let result = 0
    let user = await UserModel.findOne({ email }).exec()

    const isActiveStreakChallenge = user?.streakChallenge?.isActive

    // prettier-ignore
    const isCompleteChallenge = user?.streakChallenge?.progress === user?.streakChallenge?.numberOfDay

    // const NOW = new Date()
    const prevStreakChallenge = user.streakChallenge || {}

    if (user && isActiveStreakChallenge && isCompleteChallenge) {
        const getDiamondReward = () => {
            return (
                STREAK_CHALLENGE_REWARD_BY_DAY?.[
                    prevStreakChallenge.numberOfDay
                ] || 0
            )
        }

        const newStreakChallenge = {
            ...prevStreakChallenge,
            isActive: false,
        }

        result = getDiamondReward()

        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    streakChallenge: newStreakChallenge,
                    diamond: user.diamond + getDiamondReward(),
                },
            },
            { new: true }
        ).exec()
    }
    return result
}
