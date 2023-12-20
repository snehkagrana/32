const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const AdminMiddleware = require('../middlewares/admin.middleware')
const schema = require('../validations/admin.validation')
const validate = require('../utils/validator.util')

// Admin verify
router.post(
    '/action/verify',
    validate(schema.verifyAction),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(AdminController.verifyAction)
)

module.exports = router
