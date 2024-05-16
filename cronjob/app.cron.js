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
    const today = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })

    /**
     * NOTES
     * dayOfWeek 0 - Sunday
     * dayOfWeek 1 - Monday
     */
    const dayOfWeek = dayjs(today).day()
    const hour = dayjs(today).hour()
    const minute = dayjs(today).minute()

    console.log('dayOfWeek', dayOfWeek)
    console.log('hour', hour)
    console.log('minute', minute)

    const users = await UserModel.find({
        heart: { $lt: MAX_HEARTS },
        unlimitedHeart: null,
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    const guests = await GuestModel.find({
        heart: { $lt: MAX_HEARTS },
        lastHeartAccruedAt: { $exists: true },
    }).exec()

    if (users.length > 0) {
        users.forEach(async user => {
            // prettier-ignore
            if (user?.lastHeartAccruedAt && dayjs(today).diff(user.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {

                await UserModel.updateOne(
                    { email: user.email },
                    { $set: {
                        heart: user.heart + 1,
                        lastHeartAccruedAt: new Date()
                    } }
                ).exec()

                if(user.heart >= 4) {
                    const lessonName = user?.lastLessonCategoryName
                        ? user?.lastLessonCategoryName?.split('_')?.join(' ')
                        : user?.last_played?.category?.split('_')?.join(' ') || ''
                    
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
    if (guests.length > 0) {
        guests.forEach(async guest => {
            // prettier-ignore
            if (guest?.lastHeartAccruedAt && dayjs(today).diff(guest.lastHeartAccruedAt, 'minute') > HEARTS_REFILL_RATE) {
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
     * Leaderboard
     */
    const currentActiveLeaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    }).exec()

    if (currentActiveLeaderBoard) {
        // Reset leaderboard
        if (dayOfWeek === 0 && hour === 23 && minute >= 50) {
            // if (dayOfWeek === 2 && hour === 14 && minute === 35) { // DEBUG
            await LeaderBoardModel.updateOne(
                { _id: currentActiveLeaderBoard._id },
                {
                    $set: {
                        isActive: false,
                        lastUpdate: today,
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
                        const userResultsLeaderBoard = user?.leaderBoards?.length > 0 ? [...user.leaderBoards,nextResultLeaderBoard] : [nextResultLeaderBoard]
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
            // sync leaderboard
            // prettier-ignore
            const users = await UserModel.find({ 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

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
                        lastUpdate: today,
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
        if (dayOfWeek >= 1) {
            // if (dayOfWeek >= 2) { // DEBUG
            const endDate = dayjs(today)
                .add(6, 'day')
                .hour(23)
                .minute(50)
                .toISOString()

            // prettier-ignore
            const users = await UserModel.find({ 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

            if (users?.length > 0) {
                // prettier-ignore
                let leaderBoardUsers = users.map(x => ({
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
                    startDate: today,
                    endDate,
                    lastUpdate: today,
                    users: leaderBoardUsers.map((x, index) => ({
                        ...x,
                        position: index + 1,
                    })),
                })
            } else {
                // Create this week leaderboard with empty users
                await LeaderBoardModel.create({
                    isActive: true,
                    startDate: today,
                    endDate,
                    lastUpdate: today,
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
    const today = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })

    /**
     * NOTES
     * dayOfWeek 0 - Sunday
     * dayOfWeek 1 - Monday
     */
    const dayOfWeek = dayjs(today).day()
    const hour = dayjs(today).hour()
    const minute = dayjs(today).minute()

    // console.log('dayOfWeek', dayOfWeek)
    // console.log('hour', hour)
    // console.log('minute', minute)

    // user with 0 streak
    const usersHasFCMToken = await UserModel.find({
        fcmToken: { $exists: true },
    }).exec()

    if (usersHasFCMToken.length > 0) {
        console.log('usersHasFCMToken.length', usersHasFCMToken.length)
        usersHasFCMToken.forEach(async user => {
            console.log(`${user.email} - ${user.streak}`)

            /**
             * User streak more than 0
             */
            if (user.streak > 0) {
                console.log(
                    `->> diff ${user.email} - ${dayjs(today).diff(
                        user.lastCompletedDay,
                        'day'
                    )}`
                )
                // Check if lesson done, if not - send Streak Reminder at 9:30PM.
                if (
                    user.lastCompletedDay &&
                    dayjs(today).diff(user.lastCompletedDay, 'day') !== 0
                ) {
                }
            } else if (user.streak === 0) {
                /**
                 * User with 0 streak
                 */
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

// const today = new Date().toLocaleString('en-US', {
//     timeZone: 'Asia/Kolkata',
// })

// const dayOfWeek = dayjs(today).day()
// const hour = dayjs(today).hour()
// const minute = dayjs(today).minute()

// console.log('->>>>>> dayOfWeek', dayOfWeek)
// console.log('->>>>>> hour', hour)

// const jakartaTime = new Date().toLocaleString()
// const kolkataTime = new Date().toLocaleString('en-US', {
//     timeZone: 'Asia/Kolkata',
// })

// console.log('->>> Asia/Jakarta', jakartaTime)
// console.log('->>> Asia/Kolkata', kolkataTime)

// const DAYJS_JAKARTA = dayjs(jakartaTime)
// const DAYJS_KOLKATA = dayjs(kolkataTime)

// console.log('->>> DAYJS_JAKARTA', DAYJS_JAKARTA.format())
// console.log('->>> DAYJS_KOLKATA', DAYJS_KOLKATA.format())
