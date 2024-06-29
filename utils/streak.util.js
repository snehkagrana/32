const dayjs = require('dayjs')

const checkHasStreakToday = userDayStreak => {
    if (userDayStreak?.length > 0) {
        const streakExist = userDayStreak?.find(x => {
            if (dayjs(new Date()).isSame(x, 'day')) {
                return true
            } else {
                return false
            }
        })
        return Boolean(streakExist)
    }
    return false
}

const getStreakDiffDays = lastCompletedDay => {
    const formattedToday = dayjs(new Date()).format('YYYY-MM-DD')
    // prettier-ignore
    const formattedLastCompleteDay = dayjs(lastCompletedDay).format('YYYY-MM-DD')

    return dayjs(formattedToday).diff(formattedLastCompleteDay, 'day')
}

module.exports = {
    checkHasStreakToday,
    getStreakDiffDays,
}
