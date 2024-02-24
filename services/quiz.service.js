const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const { getToday, daysDifference } = require('../utils/common.util')
const { calculateDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')
const ReferralService = require('./referral.service')
const dayjs = require('dayjs')
const { MAX_HEARTS } = require('../constants/app.constant')

exports.answerQuestion = async ({ userId, guestId, itemId, isCorrect }) => {
    let result = null
    let user = await UserModel.findById(userId).exec()
    let guest = await GuestModel.findById(guestId).exec()

    if (user) {
        // prettier-ignore
        const MUST_REDUCE_HEART = Boolean(!isCorrect) && Boolean(!user?.unlimitedHeart) && user?.heart > 0
        const IS_LOST_1ST_HEARTS = user.heart === MAX_HEARTS

        user = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    heart: MUST_REDUCE_HEART ? user.heart - 1 : user.heart,
                    // prettier-ignore
                    lastHeartAccruedAt: MUST_REDUCE_HEART && IS_LOST_1ST_HEARTS ? new Date() : user.lastHeartAccruedAt || null,
                },
            },
            { new: true }
        ).exec()
    } else if (guest) {
        // prettier-ignore
        const MUST_REDUCE_HEART = Boolean(!isCorrect) && guest?.heart > 0
        const IS_LOST_1ST_HEARTS = guest.heart === MAX_HEARTS

        guest = await GuestModel.findOneAndUpdate(
            { _id: guest._id },
            {
                $set: {
                    heart: MUST_REDUCE_HEART ? guest.heart - 1 : guest.heart,
                    // prettier-ignore
                    lastHeartAccruedAt: MUST_REDUCE_HEART && IS_LOST_1ST_HEARTS ? new Date() : guest.lastHeartAccruedAt || null,
                },
            },
            { new: true }
        ).exec()
    }

    return result
}

// New save score
exports.saveScore = async ({ authUser, body }) => {
    let result = null
    let user = await UserModel.findById(authUser._id).exec()
    let guest = await GuestModel.findById(authUser._id).exec()

    if (user) {
        const today = dayjs(new Date()).format('YYYY-MM-DD')
        let allScoresList = user.score || []

        allScoresList.push({
            skill: body.skill,
            category: body.category,
            sub_category: body.sub_category,
            points: body.points,
        })

        const daysDiff = daysDifference(user.lastCompletedDay)

        if (daysDiff === 0) {
        } else if (daysDiff === 1) {
            user.streak++
        } else {
            // If more than one day is missed, reset streak to 1 since user played today
            user.streak = 1
        }

        user.lastCompletedDay = today

        const dayOfWeek = (getToday().getDay() + 6) % 7

        const oldValue = user.completedDays || {}

        user.lastCompletedDay = today
        const completedDays = {
            ...oldValue,
            [dayOfWeek]: today,
        }

        const getGemsAwarded = () => {
            let newDiamondAwarded = 0
            // sample body.score = [1, 0, 1, 0, 1]
            if (body?.score?.length > 0) {
                const correctAnswers = body.score.filter(s => s > 0)
                // all correct
                if (body.score.length === correctAnswers.length) {
                    newDiamondAwarded = 3
                }
                // upto 2 wrong answers
                else if (correctAnswers.length + 2 >= body.score.length) {
                    newDiamondAwarded = 2
                }
                // upto 3 wrong answers
                else if (correctAnswers.length + 3 >= body.score.length) {
                    newDiamondAwarded = 1
                } else {
                    newDiamondAwarded = 0
                }
            } else {
                // return current diamond
                return user.diamond
            }
            return user.diamond + newDiamondAwarded
        }

        user = await UserModel.updateOne(
            { email: user.email },
            {
                $set: {
                    diamond: getGemsAwarded(),
                    score: allScoresList,
                    last_played: {
                        skill: body.skill,
                        category: body.category,
                        sub_category: body.sub_category,
                    },
                    streak: user.streak,
                    lastCompletedDay: user.lastCompletedDay,
                    completedDays: completedDays,
                },
            }
        )
        result = true
    } else if (guest && authUser.email === 'GUEST') {
        const today = getToday().toISOString().split('T')[0]
        let allScoresList = guest.score || []

        allScoresList.push({
            skill: body.skill,
            category: body.category,
            sub_category: body.sub_category,
            points: body.points,
        })

        const daysDiff = daysDifference(guest.lastCompletedDay)

        if (daysDiff === 0) {
        } else if (daysDiff === 1) {
            guest.streak++
        } else {
            // If more than one day is missed, reset streak to 1 since user played today
            guest.streak = 1
        }

        guest.lastCompletedDay = today

        const dayOfWeek = (getToday().getDay() + 6) % 7
        const oldValue = guest.completedDays || {}

        guest.lastCompletedDay = today
        const completedDays = {
            ...oldValue,
            [dayOfWeek]: today,
        }

        const getGemsAwarded = () => {
            let newDiamondAwarded = 0
            // sample body.score = [1, 0, 1, 0, 1]
            if (body?.score?.length > 0) {
                const correctAnswers = body.score.filter(s => s > 0)
                // all correct
                if (body.score.length === correctAnswers.length) {
                    newDiamondAwarded = 3
                }
                // upto 2 wrong answers
                else if (correctAnswers.length + 2 >= body.score.length) {
                    newDiamondAwarded = 2
                }
                // upto 3 wrong answers
                else if (correctAnswers.length + 3 >= body.score.length) {
                    newDiamondAwarded = 1
                } else {
                    newDiamondAwarded = 0
                }
            } else {
                // return current diamond
                return guest.diamond
            }
            return guest.diamond + newDiamondAwarded
        }

        guest = await GuestModel.updateOne(
            { _id: guest._id },
            {
                $set: {
                    diamond: getGemsAwarded(),
                    score: allScoresList,
                    last_played: {
                        skill: body.skill,
                        category: body.category,
                        sub_category: body.sub_category,
                    },
                    streak: guest.streak,
                    lastCompletedDay: guest.lastCompletedDay,
                    completedDays: completedDays,
                },
            }
        )
        result = true
    }

    return result
}

// Save XP
exports.saveXp = async ({ authUser, xp }) => {
    let result = null
    let user = await UserModel.findById(authUser._id).exec()
    let guest = await GuestModel.findById(authUser._id).exec()

    if (user) {
        ReferralService.validateReferral({ userId: authUser._id })
        user = await UserModel.updateOne(
            { email: user.email },
            {
                $set: {
                    diamond: calculateDiamondUser(
                        user?.diamond ? parseInt(user.diamond, 10) : 0,
                        user?.xp?.total ? user.xp.total : 0,
                        xp
                    ),
                    diamondInitialized: true,
                    xp: {
                        current: xp,
                        daily: user.xp.daily ? user.xp.daily + xp : xp,
                        total: user.xp.total ? user.xp.total + xp : xp,
                        level: getLevelByXpPoints(
                            user?.xp?.total ? user.xp.total + xp : 0
                        ),
                    },
                },
            }
        )
        result = true
    } else if (guest && authUser.email === 'GUEST') {
        guest = await GuestModel.updateOne(
            { _id: guest._id },
            {
                $set: {
                    diamond: calculateDiamondUser(
                        guest?.diamond ? parseInt(guest.diamond, 10) : 0,
                        guest?.xp?.total ? guest.xp.total : 0,
                        xp
                    ),
                    diamondInitialized: true,
                    xp: {
                        current: xp,
                        daily: guest.xp.daily ? guest.xp.daily + xp : xp,
                        total: guest.xp.total ? guest.xp.total + xp : xp,
                        level: 1, // keep level 1 for guest
                    },
                },
            }
        )
        result = true
    }

    return result
}
