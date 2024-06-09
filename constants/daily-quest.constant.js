const {
    DAILY_QUEST_TYPE_EARN_60_BANANAS,
    DAILY_QUEST_TYPE_EARN_80_BANANAS,
    DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON,
    DAILY_QUEST_TYPE_COMPLETE_3_LESSON,
    DAILY_QUEST_TYPE_SPEND_15_MIN,
    DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY,
    DAILY_QUEST_TYPE_EARN_5_GEMS,
    DAILY_QUEST_TYPE_ADD_2_FRIENDS,
} = require('./app.constant')

const ACTION_NAME_EARN_BANANAS = 'action_EARN_BANANAS'
const ACTION_NAME_FOLLOW_FRIENDS = 'action_FOLLOW'
const ACTION_NAME_EARN_GEMS = 'action_EARN_GEMS'
const ACTION_NAME_QUIZ_CORRECTLY = 'action_QUIZ_CORRECTLY'
const ACTION_NAME_COMPLETE_LESSON = 'action_COMPLETE_LESSON'
const ACTION_NAME_COMPLETE_PERFECT_LESSON = 'action_COMPLETE_PERFECT_LESSON'
const ACTION_NAME_SPEND_LESSON_TIME = 'action_SPEND_LESSON_TIME'

// primary
const PRIMARY_DAILY_QUESTS = [
    {
        id: DAILY_QUEST_TYPE_EARN_60_BANANAS, // done
        name: 'Earn 60 bananas',
    },
    {
        id: DAILY_QUEST_TYPE_EARN_80_BANANAS, // done
        name: 'Earn 80 bananas',
    },
]

// randomly
const RANDOMLY_DAILY_QUESTS = [
    {
        id: DAILY_QUEST_TYPE_COMPLETE_2_PERFECT_LESSON, // done
        name: 'Complete 2 perfect lessons',
    },
    {
        id: DAILY_QUEST_TYPE_COMPLETE_3_LESSON, // done
        name: 'Complete 3 lessons',
    },
    {
        id: DAILY_QUEST_TYPE_SPEND_15_MIN,
        name: 'Spend 15 minutes learning',
    },
    {
        id: DAILY_QUEST_TYPE_ANSWER_10_CORRECTLY, // done
        name: 'Answer 10 quizzes correctly',
    },
    {
        id: DAILY_QUEST_TYPE_EARN_5_GEMS, // done
        name: 'Earn 5 gems',
    },
    {
        id: DAILY_QUEST_TYPE_ADD_2_FRIENDS, // done
        name: 'Add 2 friends',
    },
]

const DAILY_QUEST_REWARDS = [
    {
        id: 1,
        name: '1 Gems',
        gemsAmount: 1,
    },
    {
        id: 2,
        name: '2 Gems',
        gemsAmount: 2,
    },
    {
        id: 3,
        name: '3 Gems',
        gemsAmount: 3,
    },
    {
        id: 5,
        name: '4 Gems',
        gemsAmount: 4,
    },
]

module.exports = {
    PRIMARY_DAILY_QUESTS,
    RANDOMLY_DAILY_QUESTS,
    DAILY_QUEST_REWARDS,
    ACTION_NAME_EARN_BANANAS,
    ACTION_NAME_FOLLOW_FRIENDS,
    ACTION_NAME_EARN_GEMS,
    ACTION_NAME_QUIZ_CORRECTLY,
    ACTION_NAME_COMPLETE_LESSON,
    ACTION_NAME_COMPLETE_PERFECT_LESSON,
    ACTION_NAME_SPEND_LESSON_TIME,
}
