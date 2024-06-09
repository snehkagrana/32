const UserModel = require('../models/user')
const dayjs = require('dayjs')
const {
    DAILY_QUEST_TYPE_EARN_60_BANANAS,
    DAILY_QUEST_TYPE_EARN_80_BANANAS,
    DAILY_QUEST_TYPE_ADD_2_FRIENDS,
    DAILY_QUEST_TYPE_EARN_5_GEMS,
    DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY,
    DAILY_QUEST_TYPE_COMPLETE_3_LESSON,
    DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON,
    DAILY_QUEST_TYPE_SPEND_15_MIN,
} = require('../constants/app.constant')
const {
    ACTION_NAME_EARN_BANANAS,
    ACTION_NAME_FOLLOW_FRIENDS,
    ACTION_NAME_EARN_GEMS,
    ACTION_NAME_QUIZ_CORRECTLY,
    DAILY_QUEST_REWARDS,
    ACTION_NAME_COMPLETE_LESSON,
    ACTION_NAME_COMPLETE_PERFECT_LESSON,
    ACTION_NAME_SPEND_LESSON_TIME,
} = require('../constants/daily-quest.constant')
const { getRandomInt } = require('../utils/common.util')

exports.syncDailyQuest = async ({ userId, actionName, value }) => {
    const now = dayjs(new Date())
    const NOW = new Date()
    let user = await UserModel.findOne({ _id: userId })
    const allUserDailyQuests = user.dailyQuest || []

    if (user && allUserDailyQuests?.length > 0) {
        const updatedActiveDailyQuests = allUserDailyQuests.map((x, index) => {
            if (/* now.isSame(x.date, 'day') && */ !x.isCompleted) {
                // prettier-ignore
                if (actionName === ACTION_NAME_EARN_GEMS && x.questId === DAILY_QUEST_TYPE_EARN_5_GEMS) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else if (actionName === ACTION_NAME_EARN_BANANAS && (x.questId === DAILY_QUEST_TYPE_EARN_60_BANANAS || x.questId === DAILY_QUEST_TYPE_EARN_80_BANANAS)) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else if (actionName === ACTION_NAME_FOLLOW_FRIENDS && x.questId === DAILY_QUEST_TYPE_ADD_2_FRIENDS) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else if (actionName === ACTION_NAME_QUIZ_CORRECTLY && x.questId === DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                } 
                // prettier-ignore
                else if (actionName === ACTION_NAME_COMPLETE_LESSON && x.questId === DAILY_QUEST_TYPE_COMPLETE_3_LESSON) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else if (actionName === ACTION_NAME_COMPLETE_PERFECT_LESSON && x.questId === DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else if (actionName === ACTION_NAME_SPEND_LESSON_TIME && x.questId === DAILY_QUEST_TYPE_SPEND_15_MIN) {
                    return {
                        ...x?.toObject(),
                        progress: x.progress + value,
                        isCompleted: x.progress + value >= x.maxValue ? true : false,
                        completedDate: x.progress + value >= x.maxValue ? NOW : null,
                    }
                }
                // prettier-ignore
                else {
                    return x?.toObject()
                }
            } else {
                return x?.toObject()
            }
        })

        const updateUserResult = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    dailyQuest: updatedActiveDailyQuests,
                },
            }
        )
        if (updateUserResult) {
            result = true
        }
    }

    return true
}

exports.claimDailyQuest = async ({ userId, dailyQuestId }) => {
    let result = 0
    const NOW = new Date()
    let user = await UserModel.findOne({ _id: userId })
    const allUserDailyQuests = user.dailyQuest || []

    // prettier-ignore
    const DIAMOND_OBJ = DAILY_QUEST_REWARDS[getRandomInt(DAILY_QUEST_REWARDS.length)]

    if (DIAMOND_OBJ && user && allUserDailyQuests?.length > 0) {
        // prettier-ignore
        const quest = allUserDailyQuests.find(x => x.questId == dailyQuestId) || null

        // prettier-ignore
        if (quest?.claimedAt === null) {
            const updatedActiveDailyQuests = allUserDailyQuests.map(x => {
                if (x.questId == dailyQuestId) {
                    return {
                        ...x?.toObject(),
                        claimedAt: NOW,
                    }
                } else {
                    return x?.toObject()
                }
            })
    
            const updateUserResult = await UserModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        dailyQuest: updatedActiveDailyQuests,
                        diamond: user.diamond + DIAMOND_OBJ.gemsAmount,
                    },
                }
            )
            if (updateUserResult) {
                result = DIAMOND_OBJ.gemsAmount || 1
            }
        } else {
            result= 0
        }
    } else {
        result = 0
    }

    return result
}
