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

const userHasMissesLesson = lastCompletedDay => {
    const today = new Date()
    const dayDiff = dayjs(today).diff(lastCompletedDay, 'day')
    if (dayDiff === 1) {
        const hourDiff = dayjs(today).diff(lastCompletedDay, 'hour')
        console.log('<<<----- hourDiff', hourDiff)
    }

    return false
}

module.exports = {
    checkHasStreakToday,
    userHasMissesLesson,
}
