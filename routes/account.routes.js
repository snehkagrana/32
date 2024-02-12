const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/account.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const AccountValidations = require('../validations/account.validation')
const validate = require('../utils/validator.util')
const { multerUpload } = require('../configs/multer.config')

// Get my reward
router.get(
    '/account/my-reward',
    AuthGuard,
    ErrorHandler(AccountController.getMyRewards)
)

// Mark seed my rewards
router.post(
    '/account/my-reward/markseen',
    validate(AccountValidations.markSeenReward),
    AuthGuard,
    ErrorHandler(AccountController.markSeenMyReward)
)

// Send code verify email
router.post(
    '/account/email/verify/send-code',
    validate(AccountValidations.sendCodeVerifyEmail),
    AuthGuard,
    ErrorHandler(AccountController.sendCodeVerifyEmail)
)

// Verify email
router.post(
    '/account/email/verify',
    validate(AccountValidations.verifyEmail),
    AuthGuard,
    ErrorHandler(AccountController.verifyEmail)
)

// check availability username
router.post(
    '/account/username/availability',
    validate(AccountValidations.checkAvailabilityUsername),
    AuthGuard,
    ErrorHandler(AccountController.checkAvailabilityUsername)
)

// update profile
router.post(
    '/account/update',
    validate(AccountValidations.updateProfile),
    AuthGuard,
    ErrorHandler(AccountController.updateProfile)
)

// Upload photo
router.post(
    '/account/upload-photo',
    AuthGuard,
    multerUpload.single('photo'),
    ErrorHandler(AccountController.uploadPhoto)
)

module.exports = router
