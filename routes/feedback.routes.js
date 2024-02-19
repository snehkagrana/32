const express = require('express')
const router = express.Router()

const FeedbackController = require('../controllers/feedback.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/feedback.validation')
const validate = require('../utils/validator.util')

// Submit quiz feedback
router.post(
    '/feedback/quiz/submit',
    validate(schema.submitQuizFeedback),
    AuthGuard,
    ErrorHandler(FeedbackController.submitQuizFeedback)
)

// get quiz feedback
router.get(
    '/feedback/quiz',
    validate(schema.getQuizFeedback),
    AuthGuard,
    ErrorHandler(FeedbackController.getQuizFeedback)
)

module.exports = router
