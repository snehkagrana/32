const QuizService = require('../services/quiz.service')

exports.saveScore = async (req, res) => {
    const result = await QuizService.saveScore({
        authUser: req.user,
        body: req.body,
    })
    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed to save score' })
}

exports.saveXp = async (req, res) => {
    const result = await QuizService.saveXp({
        authUser: req.user,
        xp: req.body.xp,
    })
    if (result) {
        return res.json({
            message: 'Success',
        })
    }
    return res.status(400).json({ message: 'Failed to save score' })
}
