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
    NotificationStreak,
    NotificationReminder,
    LeaderboardReminder,
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
            // console.log(`->>usersLessHeart -> ${user.email}:${user.heart}`)
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

    console.log('->LOCALE_DAY_OF_WEEK ', LOCALE_DAY_OF_WEEK)
    console.log('->LOCALE_HOUR', LOCALE_HOUR)
    console.log('->LOCALE_MINUTE', LOCALE_MINUTE)

    // user with 0 streak
    const usersHasFCMToken = await UserModel.find({
        fcmToken: { $exists: true },
    }).exec()

    if (usersHasFCMToken?.length > 0) {
        // console.log('usersHasFCMToken.length', usersHasFCMToken.length)
        usersHasFCMToken.forEach(async user => {
            // prettier-ignore
            /**
             * NOTES
             * DIFF_DAY = 0 === User done lesson today
             * DIFF_DAY = 1 === Last done lesson yesterday
             * DIFF_DAY = 2 === User missed one day, streak will reset to 0
             * ...so on
             */
            const DIFF_DAY = dayjs(TODAY).diff(user.lastCompletedDay, 'day') || -1

            if (DIFF_DAY === 0 && user.streak > 0) {
                // prettier-ignore
                console.log(`---^^^ DIFF_DAY === 0 && user.streak > 0 -> ${user.email}:${DIFF_DAY}`)

                const STREAK_COMBO_NOTIFICATION_DATA = {
                    user,
                    typeId: 'STREAK_COMBO',
                    streakNumber: user.streak,
                    lessonName: user.lastLessonCategoryName,
                }

                // (When streak reaches a milestone - 5-day, 15-day, 25-day, 30-day, 50-day, 75-day, 100-day)
                if (
                    userStreak === 5 ||
                    userStreak === 15 ||
                    userStreak === 25 ||
                    userStreak === 30 ||
                    userStreak === 50 ||
                    userStreak === 75 ||
                    userStreak === 100
                ) {
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationStreak.sendReminder(STREAK_COMBO_NOTIFICATION_DATA)
                        }
                    }
                }
            } else if (DIFF_DAY === 1 && user.streak > 0) {
                // prettier-ignore
                console.log(`--->>> DIFF_DAY === 1 && user.streak > 0 -> ${user.email}:${DIFF_DAY}`)

                const STREAK_REMINDER_DATA = {
                    user: user,
                    streakNumber: user.streak || 0,
                    hoursLeft: 0,
                    lessonName: user.lastLessonCategoryName,
                }
                const LESSON_REMINDER_DATA = {
                    user: user,
                    lessonName: user.lastLessonCategoryName,
                }
                // prettier-ignore
                if (LOCALE_DAY_OF_WEEK === 1) {
                    if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 2) {
                    if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 3) {
                    if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 4) {
                    if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 5) {
                    if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 6) {
                    if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                        await NotificationStreak.sendRandomReminder(STREAK_REMINDER_DATA)
                    }
                }
                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 0) {
                    if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                        await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                    }
                }
            } else if (user.streak === 0 || DIFF_DAY >= 2) {
                /**
                 * NOTES: User streak only synced when user logged in
                 * Users may not do lessons but their streak is still more than 0
                 */
                // prettier-ignore
                console.log(`<<<--- user.streak === 0 || DIFF_DAY >= 2 ${user.email} : ${DIFF_DAY}`)
                // DIFF DAY 2
                if (DIFF_DAY === 2) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_1',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 3
                else if (DIFF_DAY === 3) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_2',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 4
                else if (DIFF_DAY === 4) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_3',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 5
                else if (DIFF_DAY === 5) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_4',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 6
                else if (DIFF_DAY === 6) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_5',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 7
                else if (DIFF_DAY === 7) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_6',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 8
                else if (DIFF_DAY === 8) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_7',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 9
                else if (DIFF_DAY === 9) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_8',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 10
                else if (DIFF_DAY === 10) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_9',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 11
                else if (DIFF_DAY === 11) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_10',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
                // DIFF DAY 12
                else if (DIFF_DAY === 12) {
                    const STREAK_REMINDER_DATA = {
                        user: user,
                        typeId: 'DAY_11',
                        streakNumber: 0,
                        lessonName: user.lastLessonCategoryName,
                    }
                    const LESSON_REMINDER_DATA = {
                        user: user,
                        lessonName: user.lastLessonCategoryName,
                    }
                    // prettier-ignore
                    if (LOCALE_DAY_OF_WEEK === 1) {
                        if(LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 2) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 3) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 4) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 5) {
                        if(LOCALE_HOUR === 20 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 6) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        } else if(LOCALE_HOUR === 22 && LOCALE_MINUTE >= 15 && LOCALE_MINUTE < 20) {
                            await NotificationStreak.sendReminder(STREAK_REMINDER_DATA)
                        }
                    }
                    // prettier-ignore
                    else if (LOCALE_DAY_OF_WEEK === 0) {
                        if(LOCALE_HOUR === 15 && LOCALE_MINUTE >= 0 && LOCALE_MINUTE < 5) {
                            await NotificationReminder.sendRandomReminder(LESSON_REMINDER_DATA)
                        }
                    }
                }
            }
        })
    }

    /**
     * -------------
     * LEADERBOARD
     * -------------
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

                // prettier-ignore
                if (LOCALE_DAY_OF_WEEK === 5) {
                    const DAY_LEFT = dayjs(currentActiveLeaderBoard.endDate).diff(LOCALE_DATE_NOW, 'day') || 0
                    if (LOCALE_HOUR === 13 && LOCALE_MINUTE >= 45 && LOCALE_MINUTE < 50) {
                        users.forEach(async (x) => {
                            const LEADERBOARD_REMINDER_DATA = {
                                lessonName: x.lastLessonCategoryName,
                                daysLeft: DAY_LEFT
                            }
                            await LeaderboardReminder.sendRandomReminder(LEADERBOARD_REMINDER_DATA);
                        })
                    }
                }

                // prettier-ignore
                else if (LOCALE_DAY_OF_WEEK === 0) {
                    const HOUR_LEFT = dayjs(currentActiveLeaderBoard.endDate).diff(LOCALE_DATE_NOW, 'hour') || 0
                    if (LOCALE_HOUR === 21 && LOCALE_MINUTE >= 30 && LOCALE_MINUTE < 35) {
                        if(leaderBoardUsers?.length > 0) {
                            leaderBoardUsers.forEach(async (x, index) => {
                                await LeaderboardReminder.sendSundayReminder({
                                    userId: x.userId,
                                    friendName: leaderBoardUsers?.[index - 1]?.displayName || '',
                                    myFriendPosition: index,
                                    positionAboveOfMeId: leaderBoardUsers?.[index - 1]?.userId || null,
                                    myPosition: index + 1,
                                    hoursLeft: HOUR_LEFT || 0,
                                });
                            })
                        }
                    }
                }
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

            let newLeaderBoardResult = null

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
                newLeaderBoardResult = await LeaderBoardModel.create({
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
                newLeaderBoardResult = await LeaderBoardModel.create({
                    isActive: true,
                    startDate: LOCALE_DATE_NOW,
                    endDate,
                    lastUpdate: TODAY,
                    users: [],
                })
            }

            /**
             * TODO
             * get previos leaderboard and send notification result
             */
            if (newLeaderBoardResult && LOCALE_DAY_OF_WEEK === 1) {
                if (
                    LOCALE_HOUR === 9 &&
                    LOCALE_MINUTE >= 0 &&
                    LOCALE_MINUTE < 5
                ) {
                    const prevLeaderBoards = await LeaderBoardModel.find({
                        isActive: false,
                        startDate: { $lt: newLeaderBoardResult.startDate },
                    })
                    if (prevLeaderBoards?.length > 0) {
                        // prettier-ignore
                        const lastWeekLeaderboard = prevLeaderBoards?.[prevLeaderBoards.length - 1];
                        if (lastWeekLeaderboard?.users?.length > 0) {
                            for (const u of lastWeekLeaderboard?.users) {
                                const user = await UserModel.findOne({
                                    _id: u.userId,
                                })
                                if (user) {
                                    const LEADERBOARD_RESULT_DATA = {
                                        user,
                                        rank: u.position,
                                    }
                                    await LeaderboardReminder.sendResultNotification(
                                        LEADERBOARD_RESULT_DATA
                                    )
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // console.log('Do nothing')
        }
    }
})

// const TODAY = new Date()
// const DIFF_DAY = dayjs(TODAY).diff('2024-05-16T00:00:00.000+00:00', 'day')
// console.log(`->>DIFF_DAY -> ${DIFF_DAY}`)
// console.log(`->>TODAY -> ${TODAY}`)
