const getToday = () => {
    const now = new Date()
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    const year = today.getUTCFullYear()
    const month = today.getUTCMonth()
    const day = today.getUTCDate()

    return new Date(Date.UTC(year, month, day))
}

exports.daysDifference = lastDate => {
    const todayUTC = getToday()

    const day = lastDate ? lastDate.toISOString().split('T')[0] : 0
    const lastCompletedDay = new Date(day)
    const lastCompletedDayUTC = new Date(
        Date.UTC(
            lastCompletedDay.getUTCFullYear(),
            lastCompletedDay.getUTCMonth(),
            lastCompletedDay.getUTCDate()
        )
    )

    return Math.floor((todayUTC - lastCompletedDayUTC) / (1000 * 60 * 60 * 24))
}
