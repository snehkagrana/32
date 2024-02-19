const mongoose = require('mongoose')

const QuizFeedback = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    skill: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    // quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    feedback: {
        type: String,
        enum: ['funny', 'love', 'surprised', 'angry', 'sad'],
    },
    submittedAt: Date,
})

module.exports = mongoose.model('QuizFeedback', QuizFeedback)
