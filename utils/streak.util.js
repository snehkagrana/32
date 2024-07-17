const dayjs = require('dayjs')
const { DEFAULT_TIMEZONE } = require('../constants/app.constant')

const checkHasStreakToday = (calendarStreak = [], userTimezone) => {
    const timeZone = userTimezone || DEFAULT_TIMEZONE
    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone,
    })
    if (calendarStreak?.length > 0) {
        const streakExist = calendarStreak?.find(x => {
            if (dayjs(DATE_USER_TIMEZONE).isSame(x?.date, 'day')) {
                return true
            } else {
                return false
            }
        })
        return Boolean(streakExist)
    }
    return false
}

const getStreakDiffDays = (lastCompletedDay, userTimezone) => {
    if (!lastCompletedDay || !userTimezone) {
        return null
    } else {
        const DATE_TODAY = new Date()

        const timeZone = userTimezone || DEFAULT_TIMEZONE
        const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
            timeZone,
        })

        const dateUserTimezoneToday = dayjs(DATE_USER_TIMEZONE)
            .toISOString()
            ?.slice(0, 10)
        const dateServerTimezoneToday = dayjs(DATE_TODAY)
            .toISOString()
            ?.slice(0, 10)
        const dateUserLastCompleteLesson = lastCompletedDay?.slice(0, 10)

        // console.log(
        //     'FORMATTED-> dayjs(DATE_USER_TIMEZONE)',
        //     dayjs(DATE_USER_TIMEZONE).format()
        // )
        // console.log(
        //     'FORMATTED-> dayjs(lastCompletedDay)',
        //     dayjs(lastCompletedDay).format()
        // )

        // const userDateToday = dayjs(DATE_USER_TIMEZONE).toISOString()
        // const serverDateToday = dayjs(date).toISOString()

        // // prettier-ignore
        // const userLastCompleteDay = dayjs(lastCompletedDay).toISOString()

        // console.log('timeZone->', timeZone)
        // console.log('userDateToday->', userDateToday)
        // console.log('userLastCompleteDay->', userLastCompleteDay)

        // console.log("GET DAY ->>> userLastCompleteDay", dayjs(userLastCompleteDay).day())
        // console.log("GET DAY ->>> serverDateToday", dayjs(serverDateToday).day())
        // console.log("GET DAY ->>> serverDateToday", dayjs(serverDateToday).day())

        console.log(
            'USER DIFF HOUR->',
            dayjs(dateUserTimezoneToday).diff(
                dateUserLastCompleteLesson,
                'hour'
            )
        )
        console.log(
            'SERVER DIFF HOUR->',
            dayjs(dateServerTimezoneToday).diff(
                dateUserLastCompleteLesson,
                'hour'
            )
        )

        return dayjs(dateUserTimezoneToday).diff(
            dateUserLastCompleteLesson,
            'day'
        )
    }
}

const validateAndConvertToNewObjectCalendarStreak = (userDayStreak = []) => {
    console.log('validateAndConvertToNewObjectCalendarStreak', userDayStreak)
    const _userDayStreak = [...userDayStreak]
    if (_userDayStreak?.length > 0) {
        console.log('_userDayStreak', _userDayStreak)
        return _userDayStreak.map(item => ({
            date: dayjs(item).toISOString(),
            isFreeze: false,
        }))
    }
    return userDayStreak
}

module.exports = {
    checkHasStreakToday,
    getStreakDiffDays,
    validateAndConvertToNewObjectCalendarStreak,
}
