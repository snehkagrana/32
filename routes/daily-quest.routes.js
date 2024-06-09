const express = require('express')
const router = express.Router()

const DailyQuestController = require('../controllers/daily-quest.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/daily-quest.validation')
const validate = require('../utils/validator.util')

// Sync daily quest
router.post(
    '/daily-quest/sync',
    validate(schema.syncDailyQuest),
    AuthGuard,
    ErrorHandler(DailyQuestController.syncDailyQuest)
)

router.post(
    '/daily-quest/claim',
    validate(schema.claimDailyQuest),
    AuthGuard,
    ErrorHandler(DailyQuestController.claimDailyQuest)
)

module.exports = router
