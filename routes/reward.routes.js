const express = require('express')
const router = express.Router()

const RewardController = require('../controllers/reward.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/reward.validation')
const validate = require('../utils/validator.util')

// Create reward
router.post(
    '/admin/reward',
    validate(schema.create),
    ErrorHandler(RewardController.admin_create)
)

// Get list reward for admin
router.get(
    '/admin/reward',
    AuthGuard,
    ErrorHandler(RewardController.admin_findAll)
)

// Update reward
router.put(
    '/admin/reward',
    validate(schema.create),
    ErrorHandler(RewardController.admin_update)
)

// Delete reward
router.post(
    '/admin/reward/delete',
    validate(schema.delete),
    ErrorHandler(RewardController.admin_remove)
)

// Gift user reward
router.post(
    '/admin/reward/gift',
    validate(schema.giftReward),
    ErrorHandler(RewardController.admin_giftReward)
)


/**
 * Reward routes for user basic
 */
router.get('/reward', AuthGuard, ErrorHandler(RewardController.findAll))

// redeem
router.post(
    '/reward/redeem',
    validate(schema.giftReward),
    ErrorHandler(RewardController.redeem)
)

module.exports = router
