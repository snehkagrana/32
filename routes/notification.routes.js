const express = require('express')
const router = express.Router()

const NotificationController = require('../controllers/notification.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/notification.validation')
const validate = require('../utils/validator.util')

// Send notification
router.post(
    '/notification/send',
    validate(schema.sendNotification),
    AuthGuard,
    ErrorHandler(NotificationController.sendNotifications)
)

// Get notification
router.get(
    '/notification/list',
    AuthGuard,
    ErrorHandler(NotificationController.getNotifications)
)

module.exports = router
