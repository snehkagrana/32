const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

// get qr user
router.get('/user/qr/:id', ErrorHandler(UserController.getUserQr))

// Get user by username
// prettier-ignore
router.get('/user/username/:username', AuthGuard, ErrorHandler(UserController.getUserByUsername))

// Get by id
router.get('/user/:id', AuthGuard, ErrorHandler(UserController.getUserById))

// Get users
router.get('/user', AuthGuard, ErrorHandler(UserController.findAll))

module.exports = router
