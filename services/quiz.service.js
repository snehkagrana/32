const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const { getToday, daysDifference } = require('../utils/common.util')
const { calculateDiamondUser } = require('../utils/reward.util')
const { getLevelByXpPoints } = require('../utils/xp.utils')
const ReferralService = require('./referral.service')
const dayjs = require('dayjs')
const {
    MAX_HEARTS,
    DAILY_QUEST_TYPE_EARN_60_BANANAS,
} = require('../constants/app.constant')
const DailyQuestService = require('./daily-quest.service')
const {
    ACTION_NAME_EARN_BANANAS,
    ACTION_NAME_COMPLETE_LESSON,
    ACTION_NAME_EARN_GEMS,
    ACTION_NAME_COMPLETE_PERFECT_LESSON,
} = require('../constants/daily-quest.constant')

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

    const now = new Date()

    if (user) {
        const today = dayjs(new Date()).format('YYYY-MM-DD')
        let allScoresList = user.score || []

        allScoresList.push({
            skill: body.skill,
            category: body.category,
            sub_category: body.sub_category,
            points: body.points,
            xp: body.xp,
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

        /**
         * @deprecated
         */
        const completedDays = {
            ...oldValue,
            [dayOfWeek]: today,
        }

        /**
         * ----- DAY STREAK -------
         * New logic to save day streak
         * ------------------------
         */
        const prevDayStreak = user?.dayStreak || []
        const dayStreak = [...prevDayStreak, dayjs(now).toISOString()]

        const isAllAnsweredCorrectly = () => {
            return body.score.every(s => s > 0)
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
                newDiamondAwarded = 0
            }
            return newDiamondAwarded
        }

        user = await UserModel.updateOne(
            { email: user.email },
            {
                $set: {
                    diamond: user.diamond + getGemsAwarded(),
                    score: allScoresList,
                    lastLessonCategoryName: body.category,
                    lastCompleteLessonDate: new Date(),
                    last_played: {
                        skill: body.skill,
                        category: body.category,
                        sub_category: body.sub_category,
                    },
                    streak: user.streak,
                    lastCompletedDay: user.lastCompletedDay,
                    completedDays: completedDays,
                    dayStreak,
                },
            }
        )

        if (getGemsAwarded() > 0) {
            await DailyQuestService.syncDailyQuest({
                userId: authUser._id,
                actionName: ACTION_NAME_EARN_GEMS,
                value: getGemsAwarded(),
            })
        }

        if (isAllAnsweredCorrectly()) {
            await DailyQuestService.syncDailyQuest({
                userId: authUser._id,
                actionName: ACTION_NAME_COMPLETE_PERFECT_LESSON,
                value: 1,
            })
        }

        result = true
    } else if (guest && authUser.email === 'GUEST') {
        const today = getToday().toISOString().split('T')[0]
        let allScoresList = guest.score || []

        allScoresList.push({
            skill: body.skill,
            category: body.category,
            sub_category: body.sub_category,
            points: body.points,
            xp: body.xp,
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

        /**
         * ----- DAY STREAK -------
         * New logic to save day streak
         * ------------------------
         */
        const prevDayStreak = guest?.dayStreak || []
        const dayStreak = [...prevDayStreak, dayjs(now).toISOString()]

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
                newDiamondAwarded = 0
            }
            return newDiamondAwarded
        }

        guest = await GuestModel.updateOne(
            { _id: guest._id },
            {
                $set: {
                    diamond: guest.diamond + getGemsAwarded(),
                    score: allScoresList,
                    last_played: {
                        skill: body.skill,
                        category: body.category,
                        sub_category: body.sub_category,
                    },
                    streak: guest.streak,
                    lastCompletedDay: guest.lastCompletedDay,
                    completedDays: completedDays,
                    dayStreak,
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

    /**
     * NOTES
     * 0 - Sunday
     * 1 - Monday
     */
    const dayOfWeek = dayjs(new Date()).day()
    // console.log('dayOfWeek', dayOfWeek)

    if (user) {
        ReferralService.validateReferral({ userId: authUser._id })
        // prettier-ignore
        const weeklyXp = typeof user.xp?.weekly === 'number' ? user.xp?.weekly + xp : xp

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
                        weekly: weeklyXp,
                    },
                    // prettier-ignore
                    numberOfLessonCompleteToday: typeof user.numberOfLessonCompleteToday === 'number'
                        ? user.numberOfLessonCompleteToday + 1
                        : 1,
                },
            }
        )

        await DailyQuestService.syncDailyQuest({
            userId: authUser._id,
            actionName: ACTION_NAME_EARN_BANANAS,
            value: xp,
        })

        await DailyQuestService.syncDailyQuest({
            userId: authUser._id,
            actionName: ACTION_NAME_COMPLETE_LESSON,
            value: 1,
        })

        result = true
    } else if (guest && authUser.email === 'GUEST') {
        // prettier-ignore
        const weeklyXp = typeof guest.xp?.weekly === 'number' ? guest.xp?.weekly + xp : xp
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
                        weekly: weeklyXp,
                    },
                },
            }
        )
        result = true
    }

    return result
}
