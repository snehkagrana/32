const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/account.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const AccountValidations = require('../validations/account.validation')
const validate = require('../utils/validator.util')

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

module.exports = router
