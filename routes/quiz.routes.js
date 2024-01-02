const express = require('express')
const router = express.Router()

const QuizController = require('../controllers/quiz.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/quiz.validation')
const validate = require('../utils/validator.util')

// Save score
router.post(
    '/save-score',
    validate(schema.saveScore),
    AuthGuard,
    ErrorHandler(QuizController.saveScore)
)

// Save xp
router.post(
    '/save-xp',
    validate(schema.saveXp),
    AuthGuard,
    ErrorHandler(QuizController.saveXp)
)

module.exports = router
