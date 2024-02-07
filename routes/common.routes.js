const express = require('express')
const router = express.Router()

const CommonController = require('../controllers/common.controller')
const ErrorHandler = require('../middlewares/error.middleware')

// Get information dropdown
router.get('/initialize', ErrorHandler(CommonController.getInitialData))

module.exports = router
