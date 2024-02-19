const UserModel = require('../models/user')
const FeedbackQuizModel = require('../models/quizFeedback')

exports.getQuizFeedback = async ({ skill, category, subCategory }) => {
    let result = null
    const feedbacks = await FeedbackQuizModel.find({
        skill,
        category,
        subCategory,
    })
    if (Array.isArray(feedbacks)) {
        result = feedbacks
    }
    return result
}

exports.submitQuizFeedback = async body => {
    let result = null

    const { email, skill, category, subCategory, feedback, submittedAt } = body

    const user = await UserModel.findOne({ email })

    // check user already submit to this quiz
    const isAlreadySubmitted = await FeedbackQuizModel.findOne({
        email,
        skill,
        category,
        subCategory,
    })
    if (isAlreadySubmitted) {
        await FeedbackQuizModel.deleteOne({
            email,
            skill,
            category,
            subCategory,
        })
    }

    if (user) {
        result = await FeedbackQuizModel.create({
            email,
            skill,
            category,
            subCategory,
            feedback,
            submittedAt,
        })
    } else {
        result = false
    }
    return result
}
