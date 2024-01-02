const express = require('express')
const router = express.Router()

const BatchController = require('../controllers/batch.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/batch.validation')
const validate = require('../utils/validator.util')

// Batch routes
router.post(
    '/batch',
    validate(schema.batch),
    AuthGuard,
    ErrorHandler(BatchController.invoke)
)

module.exports = router
