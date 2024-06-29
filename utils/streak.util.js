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
    const formattedToday = dayjs(new Date()).format('YYYY-MM-DD')

    // prettier-ignore
    const formattedLastCompleteDay = dayjs(lastCompletedDay).format('YYYY-MM-DD')

    console.log('formattedToday', formattedToday)
    console.log('formattedLastCompleteDay', formattedLastCompleteDay)

    const dayDiff = dayjs(formattedToday).diff(formattedLastCompleteDay, 'day')

    console.log('<<<----- userHasMissesLesson -> dayDiff', dayDiff)

    // if (dayDiff === 1) {
    //     const hourDiff = dayjs(today).diff(lastCompletedDay, 'hour')
    //     console.log('<<<----- hourDiff', hourDiff)
    //     return true
    // } else {
    //     return false
    // }
}

module.exports = {
    checkHasStreakToday,
    userHasMissesLesson,
}
