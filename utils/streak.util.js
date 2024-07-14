const dayjs = require('dayjs')
const { DEFAULT_TIMEZONE } = require('../constants/app.constant')

const checkHasStreakToday = (
    userDayStreak,
    userTimezone = DEFAULT_TIMEZONE
) => {
    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone: userTimezone,
    })
    if (userDayStreak?.length > 0) {
        const streakExist = userDayStreak?.find(x => {
            if (dayjs(DATE_USER_TIMEZONE).isSame(x, 'day')) {
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

const validateAndConvertToNewObjectDayStreak = (userStreak = []) => {
    const _userDayStreak = [...userStreak]
    if (_userDayStreak?.length > 0 && typeof _userDayStreak?.[0] === 'string') {
        console.log('_userDayStreak', _userDayStreak)
        return _userDayStreak.map(item => ({
            date: item,
            isFreeze: false,
        }))
    }
    return userStreak
}

module.exports = {
    checkHasStreakToday,
    getStreakDiffDays,
    validateAndConvertToNewObjectDayStreak,
}
