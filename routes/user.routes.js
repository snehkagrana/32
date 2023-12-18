const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

// Get users
router.get('/user', AuthGuard, ErrorHandler(UserController.findAll))

module.exports = router
