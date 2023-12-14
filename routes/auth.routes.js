const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/auth.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/auth.validation')
const validate = require('../utils/validator.util')

router.post(
    '/register',
    validate(schema.register),
    ErrorHandler(AuthController.register)
)
router.post(
    '/login',
    validate(schema.login),
    ErrorHandler(AuthController.login)
)
router.get('/user', AuthGuard, ErrorHandler(AuthController.getUser))
router.get('/sync', AuthGuard, ErrorHandler(AuthController.syncUserXp))
router.get('/logout', AuthGuard, ErrorHandler(AuthController.logout))

module.exports = router
