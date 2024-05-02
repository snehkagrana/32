const express = require('express')
const router = express.Router()

const NotificationController = require('../controllers/notification.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const AdminMiddleware = require('../middlewares/admin.middleware')
const schema = require('../validations/notification.validation')
const validate = require('../utils/validator.util')

// Send general notification
router.post(
    '/admin/notification/general/send',
    validate(schema.sendGeneralNotification),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_sendGeneralNotification)
)

// Get notifee user
router.get(
    '/admin/notification/users',
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_getNotifeeUsers)
)

// Send notification
router.post(
    '/notification/send',
    validate(schema.sendNotification),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.sendNotifications)
)

// Get notification
router.get(
    '/notification/list',
    AuthGuard,
    ErrorHandler(NotificationController.getNotifications)
)

// Mark read
router.get(
    '/notification/mark-all-read',
    AuthGuard,
    ErrorHandler(NotificationController.markAllRead)
)

// Mark read
router.get(
    '/notification/mark-read/:notificationId',
    AuthGuard,
    ErrorHandler(NotificationController.markRead)
)

module.exports = router
