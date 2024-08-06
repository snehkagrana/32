const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/auth.controller')
const GuestController = require('../controllers/guest.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/auth.validation')
const validate = require('../utils/validator.util')

router.post(
    '/auth/google-signin-mobile',
    validate(schema.googleSignInMobile),
    ErrorHandler(AuthController.googleSignInMobile)
)

router.post(
    '/auth/register/send-code',
    validate(schema.sendRegisterCode),
    ErrorHandler(AuthController.sendRegisterCode)
)
router.post(
    '/auth/register/check-code',
    validate(schema.checkRegisterCode),
    ErrorHandler(AuthController.checkRegisterCode)
)
router.post(
    '/auth/register/verify-code',
    validate(schema.verifyRegisterCode),
    ErrorHandler(AuthController.verifyRegisterCode)
)
router.post(
    '/auth/register',
    validate(schema.register),
    ErrorHandler(AuthController.register)
)
router.post(
    '/auth/login',
    validate(schema.login),
    ErrorHandler(AuthController.login)
)
router.get('/auth/user', AuthGuard, ErrorHandler(AuthController.getUser))
router.get('/auth/sync', AuthGuard, ErrorHandler(AuthController.syncUser))
router.get('/auth/logout', AuthGuard, ErrorHandler(AuthController.logout))
router.post(
    '/auth/forgot-password/send-link',
    validate(schema.sendLinkForgotPassword),
    ErrorHandler(AuthController.sendLinkForgotPassword)
)
router.post(
    '/auth/forgot-password/send-code',
    validate(schema.sendCodeForgotPassword),
    ErrorHandler(AuthController.sendCodeForgotPassword)
)
router.post(
    '/auth/forgot-password/verify-code',
    validate(schema.verifyCodeForgotPassword),
    ErrorHandler(AuthController.verifyCodeForgotPassword)
)
router.post(
    '/auth/reset-password',
    validate(schema.resetPassword),
    ErrorHandler(AuthController.resetPassword)
)

router.get('/auth/guest/init', ErrorHandler(GuestController.init))

router.get(
    '/auth/guest/sync',
    AuthGuard,
    ErrorHandler(GuestController.syncGuest)
)

router.post(
    '/auth/guest/register/sync-google',
    AuthGuard,
    ErrorHandler(AuthController.syncRegisterGoogle)
)

router.get('/auth/guest', AuthGuard, ErrorHandler(GuestController.getGuest))

router.post(
    '/auth/account/delete',
    AuthGuard,
    ErrorHandler(AuthController.deleteAccount)
)

module.exports = router
