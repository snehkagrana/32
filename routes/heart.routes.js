const express = require('express')
const router = express.Router()

const HeartController = require('../controllers/heart.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const schema = require('../validations/heart.validation')
const validate = require('../utils/validator.util')
const AuthGuard = require('../middlewares/auth.middleware')

// Fill heart routes
router.post(
    '/heart/refill',
    validate(schema.refillHearts),
    AuthGuard,
    ErrorHandler(HeartController.refillHearts)
)

module.exports = router
