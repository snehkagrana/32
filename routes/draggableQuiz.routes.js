const express = require('express')
const router = express.Router()

const DraggableQuizController = require('../controllers/draggableQuiz.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const schema = require('../validations/draggableQuiz.validation')
const validate = require('../utils/validator.util')
const AuthGuard = require('../middlewares/auth.middleware')
const AdminMiddleware = require('../middlewares/admin.middleware')

// Fill heart routes
router.post(
    'admin/quiz/draggable',
    validate(schema.save),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(DraggableQuizController.admin_create)
)

module.exports = router
