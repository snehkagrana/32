const RANDOMLY_STREAK_NOTIFICATION_TYPE = {
    // params { streakNumber, hoursLeft, lessonName }
    1: ({ streakNumber }) => {
        return {
            typeId: 1,
            title: `🚨SAVE YOUR STREAK!!`,
            body: `You will lose your ${
                streakNumber || ''
            } streak. Complete a lesson now.`,
        }
    },
    2: ({ hoursLeft, streakNumber }) => {
        return {
            typeId: 2,
            title: `Clock is ticking🕰...`,
            body: `Only ${hoursLeft} hours left. Complete a lesson now to save your
            ${streakNumber} day streak.`,
        }
    },
    3: ({ streakNumber }) => {
        return {
            typeId: 3,
            title: `⛓ Don't Break the Chain!`,
            body: `Your ${streakNumber} day streak is on the line. Keep it alive with a quick lesson!`,
        }
    },
    4: ({ hoursLeft, streakNumber }) => {
        return {
            typeId: 4,
            title: `⏳ Time's Running Out!`,
            body: `Hurry! Only ${hoursLeft} hours left to save your ${streakNumber} day streak. Let's keep it going!`,
        }
    },
    5: ({ streakNumber, lessonName }) => {
        return {
            typeId: 5,
            title: `Streak in Danger☠!`,
            body: ` You risk losing your ${streakNumber} day streak. Continue learning about ${lessonName}!`,
        }
    },
    6: () => {
        return {
            typeId: 6,
            title: `⏰ Last Chance!`,
            body: `The clock is ticking. Take a quick lesson and save your streak!`,
        }
    },
    7: ({ streakNumber }) => {
        return {
            typeId: 7,
            title: `🔥Keep the Flame Alive!`,
            body: `Protect your ${streakNumber} day streak from extinction. Complete a lesson now!`,
        }
    },
    8: ({ streakNumber, lessonName }) => {
        return {
            typeId: 8,
            title: `Bananas will rot🍌💀!`,
            body: `Don't let time slip away. Complete your ${lessonName} lesson to save your ${streakNumber} streak🔥.`,
        }
    },
    9: ({ streakNumber }) => {
        return {
            typeId: 9,
            title: `🆘Warning: Streak at Risk!`,
            body: `Your ${streakNumber} day streak is in danger. Don't let it break—complete a lesson now`,
        }
    },
    10: ({ streakNumber }) => {
        return {
            typeId: 10,
            title: `📢 Last Call!`,
            body: `You will lose your ${streakNumber} day streak. Keep it going with a lesson now.`,
        }
    },
    11: ({ streakNumber }) => {
        return {
            typeId: 11,
            title: `Streak you maintain - Snapchat ❌`,
            body: `Streak you should maintain-Fingo ✅. Go on and save your ${streakNumber} streak.`,
        }
    },
}

const STREAK_NOTIFICATION_TYPE = {
    // params list { streakNumber, lessonName, name }
    STREAK_COMBO: ({ streakNumber }) => {
        return {
            typeId: 'STREAK_COMBO',
            title: `🔥You are on fire!`,
            body: `Continue your ${streakNumber} day streak on Fingo!`,
        }
    },
    DAY_1: () => {
        return {
            typeId: 'DAY_1',
            title: `Get ready for what is coming for you`,
            body: `You missed your lesson. You know what happens now🔫.`,
        }
    },
    DAY_2: () => {
        return {
            typeId: 'DAY_2',
            title: `You did it again!?`,
            body: `It’s been 2 days since you completed a lesson. Continue learning on Fingo.`,
        }
    },
    DAY_3: () => {
        return {
            typeId: 'DAY_3',
            title: `Are you John Cena?🤼`,
            body: `Cauz we don’t see you completing your lessons. Take them now`,
        }
    },
    DAY_4: ({ name }) => {
        return {
            typeId: 'DAY_4',
            title: `${name}, we miss you`,
            body: `Looks like you didn’t get the time. That’s ok, take a quick lesson today.`,
        }
    },
    DAY_5: ({ lessonName }) => {
        return {
            typeId: 'DAY_5',
            title: `Looks like you hit the snooze button😴.`,
            body: `It’s been 5 days since we saw you. Come back and complete ${lessonName}.`,
        }
    },
    DAY_6: () => {
        return {
            typeId: 'DAY_6',
            title: `Earth has traveled over 15 million kilometers...`,
            body: `Around the Sun since you last completed a lesson on Fingo. Earn bananas and compete with your friends!`,
        }
    },
    DAY_7: () => {
        return {
            typeId: 'DAY_7',
            title: `A week of silence😶.`,
            body: `Don't you miss us? Complete a lesson and show some love🥹.`,
        }
    },
    DAY_8: () => {
        return {
            typeId: 'DAY_8',
            title: `It is absolutely bananas!🍌📛.`,
            body: `It's been 8 days since we last saw you! Earn bananas and compete with
            your friends.`,
        }
    },
    DAY_9: ({ name, lessonName }) => {
        return {
            typeId: 'DAY_9',
            title: `We are missing our star learner ${name}🌟.`,
            body: `Continue learning about ${lessonName} and get the top spot on the
            leaderboard.`,
        }
    },
    DAY_10: () => {
        return {
            typeId: 'DAY_10',
            title: `(fly noises🪰)`,
            body: `It's been a long day, without you my friend. Complete a lesson and join
            us, please?😞.`,
        }
    },
    DAY_11: () => {
        return {
            typeId: 'DAY_11',
            title: `Bye bye!👋`,
            body: `Looks like the notifications are not working. Do you still want to receive the notifications?`,
        }
    },
}

const RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE = {
    // param list { name, lessonName }
    1: ({ name }) => {
        return {
            typeId: 1,
            title: `Hi ${name}! Just a reminder.`,
            body: `It's time for your daily finance lesson. Take 4 minutes to complete your lesson now`,
        }
    },
    2: () => {
        return {
            typeId: 2,
            title: `Got 4 minutes?`,
            body: 'Quickly complete a finance lesson🏃.',
        }
    },
    3: () => {
        return {
            typeId: 3,
            title: `Take a break📳`,
            body: `Make your screen time count. Take a quick finance lesson now.`,
        }
    },
    4: () => {
        return {
            typeId: 4,
            title: `🏋Ready for some grind?`,
            body: `Well, your finance lessons won't take themselves.`,
        }
    },
    5: () => {
        return {
            typeId: 5,
            title: `Too much of Instagram?`,
            body: `Reduce your guilt, complete a lesson now.`,
        }
    },
    6: () => {
        return {
            typeId: 6,
            title: `It's that time again⌚.`,
            body: `Complete your lesson on Fingo.`,
        }
    },
    7: ({ lessonName }) => {
        return {
            typeId: 7,
            title: `Take a break from Snap👻, maybe?`,
            body: lessonName
                ? `Quickly complete your ${lessonName} lesson.`
                : `Quickly complete your lesson.`,
        }
    },
    8: () => {
        return {
            typeId: 8,
            title: `Sorry for interrupting🙇.`,
            body: `You forgot to earn bananas🍌 today. Do it now.`,
        }
    },
    9: ({ lessonName }) => {
        return {
            typeId: 9,
            title: `Bananas will rot🍌💀!`,
            body: lessonName
                ? `Complete ${lessonName || ''} lesson and earn more bananas.`
                : `Complete your lesson and earn more bananas.`,
        }
    },
    10: () => {
        return {
            typeId: 10,
            title: `PEN UP! It is FBI🔫.`,
            body: `(Fingo Bureau of Investing). Sorry, that was bad. But take your lesson now.`,
        }
    },
}

module.exports = {
    RANDOMLY_STREAK_NOTIFICATION_TYPE,
    STREAK_NOTIFICATION_TYPE,
    RANDOMLY_LESSON_REMINDER_NOTIFICATION_TYPE,
}
