const { BATCH_EVENT_TIME_SPENT } = require('../constants/app.constant')
const QuizService = require('../services/quiz.service')

exports.invoke = async (req, res) => {
    const {
        eventType,
        eventTimestamp,
        userId,
        guestId,
        itemId,
        isCorrect,
        ...rest
    } = req.body

    let result = false

    switch (eventType) {
        case BATCH_EVENT_TIME_SPENT:
            await QuizService.answerQuestion({
                userId,
                guestId,
                itemId,
                isCorrect,
            })
            result = true
            break
        default:
            result = true
            break
    }

    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed to get users' })
}
