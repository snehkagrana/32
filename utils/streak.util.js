const dayjs = require('dayjs')
const { DEFAULT_TIMEZONE } = require('../constants/app.constant')

const checkHasStreakToday = (
    calendarStreak = [],
    userTimezone = DEFAULT_TIMEZONE
) => {
    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone: userTimezone,
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
    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone: userTimezone,
    })
    const formattedToday = dayjs(DATE_USER_TIMEZONE).format('YYYY-MM-DD')
    // prettier-ignore
    const formattedLastCompleteDay = dayjs(lastCompletedDay).format('YYYY-MM-DD')

    console.log('formattedToday', formattedToday)
    console.log('formattedLastCompleteDay', formattedLastCompleteDay)

    return dayjs(formattedToday).diff(formattedLastCompleteDay, 'day')
}

const validateAndConvertToNewObjectCalendarStreak = (calendarStreak = []) => {
    const _calendarStreak = [...calendarStreak]
    if (
        _calendarStreak?.length > 0 &&
        typeof _calendarStreak?.[0] === 'string'
    ) {
        console.log('_calendarStreak', _calendarStreak)
        return _calendarStreak.map(item => ({
            date: item,
            isFreeze: false,
        }))
    }
    return calendarStreak
}

module.exports = {
    checkHasStreakToday,
    getStreakDiffDays,
    validateAndConvertToNewObjectCalendarStreak,
}
