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
    ErrorHandler(RewardController.create)
)

// Get list reward
router.get('/admin/reward', AuthGuard, ErrorHandler(RewardController.findAll))

// Update reward
router.put(
    '/admin/reward',
    validate(schema.create),
    ErrorHandler(RewardController.update)
)

// Delete reward
router.post(
    '/admin/reward/delete',
    validate(schema.delete),
    ErrorHandler(RewardController.remove)
)

// Gift user reward
router.post(
    '/admin/reward/gift',
    validate(schema.giftReward),
    ErrorHandler(RewardController.giftReward)
)

module.exports = router
