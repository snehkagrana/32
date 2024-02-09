const express = require('express')
const router = express.Router()

const CommonController = require('../controllers/common.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

// Get information dropdown
router.get('/initialize', ErrorHandler(CommonController.getInitialData))

// Get next lesson
router.get(
    '/next-lesson',
    AuthGuard,
    ErrorHandler(CommonController.getNextLesson)
)

module.exports = router
