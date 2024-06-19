const express = require('express')
const router = express.Router()

const CommonController = require('../controllers/common.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

// prettier-ignore
router.get('/initialize/skills', ErrorHandler(CommonController.getInitialSkills))

// prettier-ignore
router.get('/initialize/informations', ErrorHandler(CommonController.getInitialInformations))

// prettier-ignore
router.get('/common/get-avatars', ErrorHandler(CommonController.getAvatars))

// Get next lesson
router.get(
    '/next-lesson',
    AuthGuard,
    ErrorHandler(CommonController.getNextLesson)
)

module.exports = router
