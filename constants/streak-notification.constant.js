const STREAK_NOTIFICATION_TYPE = {
    1: ({ name }) => {
        return {
            typeId: 1,
            title: `${name} we miss you.`,
            body: "Looks like you didn't get the time. That's ok, take a quick lesson today",
        }
    },
    2: () => {
        return {
            typeId: 2,
            title: `You missed your lesson.`,
            body: 'You know what happens now 🔫',
        }
    },
    3: ({ streakNumber }) => {
        return {
            typeId: 3,
            title: `🚨SAVE YOUR STREAK!!`,
            body: `You will lose your ${streakNumber} streak. Complete a lesson now.`,
        }
    },
    4: ({ hoursLeft, streakNumber }) => {
        return {
            typeId: 4,
            title: `Clock is ticking🕰...`,
            body: `Only ${hoursLeft} hours left. Complete a lesson now to save your
            ${streakNumber} day streak.`,
        }
    },
}

module.exports = {
    STREAK_NOTIFICATION_TYPE,
}
