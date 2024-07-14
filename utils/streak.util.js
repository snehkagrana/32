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
    const timeZone = userTimezone || DEFAULT_TIMEZONE
    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone,
    })
    const formattedToday = dayjs(DATE_USER_TIMEZONE).format('YYYY-MM-DD')
    // prettier-ignore
    const formattedLastCompleteDay = dayjs(lastCompletedDay).format('YYYY-MM-DD')

    console.log('formattedToday', formattedToday)
    console.log('formattedLastCompleteDay', formattedLastCompleteDay)

    return dayjs(formattedToday).diff(formattedLastCompleteDay, 'day')
}

const validateAndConvertToNewObjectCalendarStreak = (userDayStreak = []) => {
    console.log('validateAndConvertToNewObjectCalendarStreak', userDayStreak)
    const _userDayStreak = [...userDayStreak]
    if (_userDayStreak?.length > 0 && typeof _userDayStreak?.[0] === 'string') {
        console.log('_userDayStreak', _userDayStreak)
        return _userDayStreak.map(item => ({
            date: item,
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
