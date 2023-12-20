const express = require('express')
const router = express.Router()

const RewardController = require('../controllers/reward.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/reward.validation')
const validate = require('../utils/validator.util')
const { upload } = require('../server')
const { multerUpload } = require('../configs/multer.config')

// Update reward
router.post(
    '/admin/reward/update',
    validate(schema.create),
    AuthGuard,
    ErrorHandler(RewardController.admin_update)
)

// Create reward
router.post(
    '/admin/reward',
    validate(schema.create),
    AuthGuard,
    ErrorHandler(RewardController.admin_create)
)

// Get list reward for admin
router.get(
    '/admin/reward',
    AuthGuard,
    ErrorHandler(RewardController.admin_findAll)
)

// Delete reward
router.post(
    '/admin/reward/delete',
    validate(schema.delete),
    AuthGuard,
    ErrorHandler(RewardController.admin_remove)
)

// Gift user reward
router.post(
    '/admin/reward/gift',
    validate(schema.giftReward),
    AuthGuard,
    ErrorHandler(RewardController.admin_giftReward)
)

// Upload image
router.post(
    '/admin/reward/upload',
    AuthGuard,
    multerUpload.single('photo'),
    ErrorHandler(RewardController.admin_upload)
)

/**
 * Reward routes for user basic
 */
router.get('/reward', ErrorHandler(RewardController.findAll))

// redeem
router.post(
    '/reward/redeem',
    validate(schema.redeem),
    AuthGuard,
    ErrorHandler(RewardController.redeem)
)

// claim reward
router.post(
    '/reward/claim',
    validate(schema.claimReward),
    AuthGuard,
    ErrorHandler(RewardController.claimReward)
)

module.exports = router
