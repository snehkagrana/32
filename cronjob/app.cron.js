const cron = require('node-cron')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const {
    MAX_HEARTS,
    HEARTS_REFILL_RATE,
    NOTIFICATION_TYPE,
    SERVER_TIMEZONE,
} = require('../constants/app.constant')
const dayjs = require('dayjs')
const LeaderBoardModel = require('../models/leaderboard')
const {
    MINIMUM_WEEKLY_XP_LEADER_BOARD,
    MAX_WEEKLY_USERS_LEADER_BOARD,
} = require('../constants/app.constant')
const NotificationService = require('../services/notification.service')
const {
    STREAK_NOTIFICATION_TYPE,
    REMINDER_NOTIFICATION_TYPE,
} = require('../constants/notification-type.constant')
const { daysDifference, getToday } = require('../utils/common.util')
const {
    NotificationStreak,
    NotificationReminder,
} = require('../utils/notification.util')

cron.schedule('* * * * *', async function () {
    const LOCALE_DATE_NOW = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })
    const TODAY = new Date()

    /**
     * NOTES
     * LOCALE_DAY_OF_WEEK  0 - Sunday
     * LOCALE_DAY_OF_WEEK  1 - Monday
     */
    const LOCALE_DAY_OF_WEEK = dayjs(LOCALE_DATE_NOW).day()
    const LOCALE_HOUR = dayjs(LOCALE_DATE_NOW).hour()
    const LOCALE_MINUTE = dayjs(LOCALE_DATE_NOW).minute()

    console.log('->LOCALE_DAY_OF_WEEK ', LOCALE_DAY_OF_WEEK)
    console.log('->LOCALE_HOUR', LOCALE_HOUR)
    console.log('->LOCALE_MINUTE', LOCALE_MINUTE)

    const usersLessHeart = await UserModel.find({
        heart: { $lt: MAX_HEARTS },
        unlimitedHeart: null,
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    const guestLessHeart = await GuestModel.find({
        heart: { $lt: MAX_HEARTS },
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    if (usersLessHeart.length > 0) {
        usersLessHeart.forEach(async user => {
            console.log(`->>usersLessHeart -> ${user.email}:${user.heart}`)
            // prettier-ignore
            if (user?.lastHeartAccruedAt && dayjs(TODAY).diff(user.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {

                await UserModel.updateOne(
                    { email: user.email },
                    { $set: {
                        heart: user.heart + 1,
                        lastHeartAccruedAt: TODAY
                    } },
                    { new: true }
                ).exec()

                if(user.heart >= MAX_HEARTS - 1) {
                    const lessonName = user?.lastLessonCategoryName
                        ? user?.lastLessonCategoryName?.split('_')?.join(' ')
                        : user?.last_played?.sub_category?.split('_')?.join(' ') || ''
                    
                    const notificationData = {
                        title: `💚 Your hearts are full`,
                        body: lessonName
                            ? `Continue learning about ${lessonName || ""}`
                            : `Continue learning`,
                        userId: user._id,
                        type: NOTIFICATION_TYPE.heart_refill, 
                        dataId: null,
                    }
                    // send notification
                    await NotificationService.sendAndSaveNotification(notificationData) 
                }
            }
        })
    }

    // guest
    if (guestLessHeart.length > 0) {
        guestLessHeart.forEach(async guest => {
            // prettier-ignore
            if (guest?.lastHeartAccruedAt && dayjs(TODAY).diff(guest.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {
                await GuestModel.updateOne(
                    { _id: guest._id },
                    { $set: {
                        heart: guest.heart + 1,
                        lastHeartAccruedAt: new Date()
                    } }
                ).exec()
            }
        })
    }

    /**
     * ---------------------
     * Leaderboard
     * ---------------------
     */
    const currentActiveLeaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    }).exec()

    if (currentActiveLeaderBoard) {
        // Reset leaderboard
        if (
            LOCALE_DAY_OF_WEEK === 0 &&
            LOCALE_HOUR === 23 &&
            LOCALE_MINUTE >= 50
        ) {
            // if (LOCALE_DAY_OF_WEEK  === 2 && LOCALE_HOUR === 14 && minute === 35) { // DEBUG
            await LeaderBoardModel.updateOne(
                { _id: currentActiveLeaderBoard._id },
                {
                    $set: {
                        isActive: false,
                        lastUpdate: TODAY,
                    },
                }
            ).exec()

            // also reset weekly xp users & save result previous leaderboard.
            // await UserModel.updateMany(
            //     { 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } },
            //     { $set: { 'xp.weekly': 0 } }
            // )
            if (currentActiveLeaderBoard?.users?.length > 0) {
                for (const u of currentActiveLeaderBoard.users) {
                    const user = await UserModel.findOne({ _id: u.userId })
                    if (user) {
                        // prettier-ignore
                        const nextResultLeaderBoard = {
                            leaderBoardId: currentActiveLeaderBoard._id,
                            startDate: currentActiveLeaderBoard.startDate,
                            endDate: currentActiveLeaderBoard.endDate,
                            hasSeen: false,
                            position: u.position,
                            xp: u.xp 
                        };

                        // prettier-ignore
                        const userResultsLeaderBoard = user?.leaderBoards?.length > 0
                                ? [...user.leaderBoards, nextResultLeaderBoard]
                                : [nextResultLeaderBoard]

                        await UserModel.updateOne(
                            { _id: u.userId },
                            {
                                $set: {
                                    'xp.weekly': 0,
                                    leaderBoards: userResultsLeaderBoard,
                                },
                            },
                            { new: true }
                        ).exec()
                    }
                }
            }
            // console.log('currentActiveLeaderBoard')
        } else {
            // console.log('sync Leaderboard')
            // Sync leaderboard data
            // prettier-ignore
            const users = await UserModel.find({
                'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD }
            }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

            if (users?.length > 0) {
                // prettier-ignore
                let leaderBoardUsers = users.map(x => ({
                    userId: x._doc._id, 
                    displayName: x._doc.displayName ? x._doc.displayName : x._doc.username || '',
                    xp: x._doc.xp.weekly || MINIMUM_WEEKLY_XP_LEADER_BOARD,
                    email: x._doc.email,
                    imgPath: x._doc.imgPath || '', 
                }));
                leaderBoardUsers.sort((a, b) => b.xp - a.xp)

                await LeaderBoardModel.updateOne(
                    { _id: currentActiveLeaderBoard._id },
                    {
                        lastUpdate: TODAY,
                        users: leaderBoardUsers.map((x, index) => ({
                            ...x,
                            position: index + 1,
                        })),
                    },
                    { new: true }
                )
            }
        }
    } else {
        /**
         * Create new weekly leaderboard
         */
        if (LOCALE_DAY_OF_WEEK >= 1) {
            // if (LOCALE_DAY_OF_WEEK  >= 2) { // DEBUG
            const endDate = dayjs(LOCALE_DATE_NOW)
                .add(6, 'day')
                .hour(23)
                .minute(50)
                .toISOString()

            // prettier-ignore
            const usersWithWeeklyXp = await UserModel.find({
                'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD }
            }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

            if (usersWithWeeklyXp?.length > 0) {
                // prettier-ignore
                let leaderBoardUsers = usersWithWeeklyXp.map(x => ({
                    userId: x._doc._id, 
                    displayName: x._doc.displayName ? x._doc.displayName : x._doc.username || '',
                    xp: x._doc.xp.weekly || MINIMUM_WEEKLY_XP_LEADER_BOARD,
                    email: x._doc.email,
                    imgPath: x._doc.imgPath || null,
                }));
                leaderBoardUsers.sort((a, b) => b.xp - a.xp)

                // Create this week leaderboard
                await LeaderBoardModel.create({
                    isActive: true,
                    startDate: LOCALE_DATE_NOW,
                    endDate,
                    lastUpdate: TODAY,
                    users: leaderBoardUsers.map((x, index) => ({
                        ...x,
                        position: index + 1,
                    })),
                })
            } else {
                // Create this week leaderboard with empty users
                await LeaderBoardModel.create({
                    isActive: true,
                    startDate: LOCALE_DATE_NOW,
                    endDate,
                    lastUpdate: TODAY,
                    users: [],
                })
            }
            // console.log('createNewLeaderboard')
        } else {
            // console.log('Do nothing')
        }
    }
})

// Cronjob At every 5th minute.
cron.schedule('*/5 * * * *', async function () {
    const LOCALE_DATE_NOW = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })
    const TODAY = new Date()

    /**
     * NOTES
     * LOCALE_DAY_OF_WEEK  0 - Sunday
     * LOCALE_DAY_OF_WEEK  1 - Monday
     */
    const LOCALE_DAY_OF_WEEK = dayjs(LOCALE_DATE_NOW).day()
    const LOCALE_HOUR = dayjs(LOCALE_DATE_NOW).hour()
    const LOCALE_MINUTE = dayjs(LOCALE_DATE_NOW).minute()

    // user with 0 streak
    const usersHasFCMToken = await UserModel.find({
        fcmToken: { $exists: true },
    }).exec()

    if (usersHasFCMToken?.length > 0) {
        console.log('usersHasFCMToken.length', usersHasFCMToken.length)
        usersHasFCMToken.forEach(async user => {
            console.log(`${user.email} - ${user.streak}`)

            /**
             * User streak more than 0
             */
            if (user.streak > 0) {
                console.log(
                    `->> diff ${user.email} - ${dayjs(TODAY).diff(
                        user.lastCompletedDay,
                        'day'
                    )}`
                )
                // Check if lesson done, if not - send Streak Reminder at 9:30PM. If Streak is 0, then message according to days not used
                if (
                    user.lastCompletedDay &&
                    dayjs(TODAY).diff(user.lastCompletedDay, 'day') !== 0
                ) {
                }
            } else if (user.streak === 0) {
                /**
                 * User streak is 0
                 */
                if (user?.lastCompletedDay) {
                    // prettier-ignore
                    const DIFF_DAY = dayjs(TODAY).diff(user.lastCompletedDay, 'day')
                    console.log(`->>DIFF_DAY -> ${user.email} - ${DIFF_DAY}`)
                }
            }
        })
    }

    /**
     * -------------
     * LEADER BOARD NOTIFICATION
     * -------------
     */

    /**
     * -------------
     * LESSON REMINDER
     * -------------
     */
})
