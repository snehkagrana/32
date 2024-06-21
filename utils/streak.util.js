const dayjs = require('dayjs')

const checkHasStreakToday = userDayStreak => {
    if (userDayStreak?.length > 0) {
        const streakExist = userDayStreak?.find(x => {
            if (dayjs(now).isSame(x, 'day')) {
                return true
            } else {
                return false
            }
        })
        return Boolean(streakExist)
    }
    return false
}

module.exports = {
    checkHasStreakToday,
}
