const express = require('express')
const router = express.Router()

const NotificationController = require('../controllers/notification.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const AdminMiddleware = require('../middlewares/admin.middleware')
const schema = require('../validations/notification.validation')
const validate = require('../utils/validator.util')
const { multerUpload } = require('../configs/multer.config')

// Get notification history
router.get(
    '/admin/notification/history',
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_getNotificationHistory)
)

// Delete notification template
router.delete(
    '/admin/notification/template/:id',
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_deleteNotificationTemplate)
)

// Update notification template
router.put(
    '/admin/notification/template/:id',
    validate(schema.create),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_updateNotificationTemplate)
)

// Create notification template
router.post(
    '/admin/notification/template',
    validate(schema.create),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_createNotificationTemplate)
)

// Get notification template
router.get(
    '/admin/notification/template',
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(NotificationController.admin_getNotificationTemplate)
)

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

// Upload notification image
router.post(
    '/admin/notification/image',
    AuthGuard,
    AdminMiddleware,
    multerUpload.single('image'),
    ErrorHandler(NotificationController.admin_uploadImage)
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

// Get unread notification
router.get(
    '/notification/unread',
    AuthGuard,
    ErrorHandler(NotificationController.getUnreadNotification)
)

// [TEST] user press action notification
router.post(
    '/notification/press-action',
    AuthGuard,
    ErrorHandler(NotificationController.userPressActionNotification)
)

module.exports = router
