const FeedbackService = require('../services/feedback.service')

exports.submitQuizFeedback = async (req, res, next) => {
    const email = req?.user?.email || req.body.email
    const result = await FeedbackService.submitQuizFeedback({
        email,
        skill: req.body.skill,
        category: req.body.category,
        subCategory: req.body.subCategory,
        feedback: req.body.feedback,
        submittedAt: new Date(),
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to submit quiz feedback' })
}

exports.getQuizFeedback = async (req, res) => {
    const result = await FeedbackService.getQuizFeedback({
        skill: req.query.skill,
        category: req.query.category,
        subCategory: req.query.subCategory,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get quiz feedback' })
}
