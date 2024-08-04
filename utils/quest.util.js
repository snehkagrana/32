const dayjs = require('dayjs')
const {
    PRIMARY_DAILY_QUESTS,
    RANDOMLY_DAILY_QUESTS,
} = require('../constants/daily-quest.constant')

const {
    DAILY_QUEST_TYPE_EARN_60_BANANAS,
    DAILY_QUEST_TYPE_EARN_80_BANANAS,
    DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON,
    DAILY_QUEST_TYPE_COMPLETE_3_LESSON,
    DAILY_QUEST_TYPE_SPEND_15_MIN,
    DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY,
    DAILY_QUEST_TYPE_EARN_5_GEMS,
    DAILY_QUEST_TYPE_ADD_2_FRIENDS,
    DEFAULT_TIMEZONE,
} = require('../constants/app.constant')

const { getRandomInt } = require('./common.util')

const createRandomDailyQuest = user => {
    // prettier-ignore
    const QUEST_1 = PRIMARY_DAILY_QUESTS[getRandomInt(PRIMARY_DAILY_QUESTS.length)]

    // prettier-ignore
    const QUEST_2 = RANDOMLY_DAILY_QUESTS[getRandomInt(RANDOMLY_DAILY_QUESTS.length)]

    const getMaxValue = questId => {
        let value = 0
        switch (questId) {
            case DAILY_QUEST_TYPE_EARN_60_BANANAS:
                value = 60
                break
            case DAILY_QUEST_TYPE_EARN_80_BANANAS:
                value = 80
                break
            case DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON:
                value = 2
                break
            case DAILY_QUEST_TYPE_COMPLETE_3_LESSON:
                value = 3
                break
            case DAILY_QUEST_TYPE_SPEND_15_MIN:
                value = 15
                break
            case DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY:
                value = 10
                break
            case DAILY_QUEST_TYPE_EARN_5_GEMS:
                value = 5
                break
            case DAILY_QUEST_TYPE_ADD_2_FRIENDS:
                value = 2
                break
            default:
                value = 0
                break
        }

        return value
    }

    return [
        {
            sequence: 1,
            questId: QUEST_1.id,
            questName: QUEST_1.name,
            isCompleted: false,
            progress: 0,
            maxValue: getMaxValue(QUEST_1.id),
            date: new Date(),
            completedDate: null,
            claimedAt: null,
        },
        {
            sequence: 2,
            questId: QUEST_2.id,
            questName: QUEST_2.name,
            isCompleted: false,
            progress: 0,
            maxValue: getMaxValue(QUEST_2.id),
            date: new Date(),
            completedDate: null,
            claimedAt: null,
        },
    ]
}

const checkIsActiveDailyQuestToday = (arrUserQuest, userTimezone) => {
    let result = false

    const timeZone = userTimezone || DEFAULT_TIMEZONE

    const DATE_USER_TIMEZONE = new Date().toLocaleString('en-US', {
        timeZone,
    })

    consol.log(
        'checkIsActiveDailyQuestToday:DATE_USER_TIMEZONE->',
        DATE_USER_TIMEZONE
    )

    // const now = dayjs(new Date())
    if (arrUserQuest?.length > 0) {
        const todayUserDailyQuest = arrUserQuest.filter(item => {
            const dateQuest = dayjs(item.date)?.toISOString()?.slice(0, 10)
            const dateToday = dayjs(DATE_USER_TIMEZONE)
                ?.toISOString()
                ?.slice(0, 10)
            console.log('checkIsActiveDailyQuestToday:dateQuest->', dateQuest)
            console.log('checkIsActiveDailyQuestToday:dateToday->', dateToday)

            return dateQuest === dateToday
            // dayjs(DATE_USER_TIMEZONE).isSame(x.date, 'day')
        })

        // prettier-ignore
        const sequenceQuest1 = todayUserDailyQuest.find(x => x.sequence === 1) || null

        // prettier-ignore
        const sequenceQuest2 = todayUserDailyQuest.find(x => x.sequence === 2) || null

        if (sequenceQuest1 && sequenceQuest2) {
            result = true
        } else {
            result = false
        }

        return result
    } else {
        return result
    }
}

const getActiveDailyQuest = arrUserQuest => {
    let result = []
    const now = dayjs(new Date())
    if (arrUserQuest?.length > 0) {
        // prettier-ignore
        const todayUserDailyQuest = arrUserQuest.filter(x => now.isSame(x.date, 'day')) || []

        // prettier-ignore
        const sequenceQuest1 = todayUserDailyQuest.find(x => x.sequence === 1) || null

        // prettier-ignore
        const sequenceQuest2 = todayUserDailyQuest.find(x => x.sequence === 2) || null

        if (sequenceQuest1 && !sequenceQuest1?.isCompleted) {
            result = [...result, sequenceQuest1]
        }

        if (sequenceQuest2 && !sequenceQuest2?.isCompleted) {
            result = [...result, sequenceQuest2]
        }
        return result
    } else {
        return result
    }
}

module.exports = {
    createRandomDailyQuest,
    checkIsActiveDailyQuestToday,
    getActiveDailyQuest,
}
