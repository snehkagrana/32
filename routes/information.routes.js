const express = require('express')
const router = express.Router()

const InformationController = require('../controllers/information.controller')
const ErrorHandler = require('../middlewares/error.middleware')

// Get information dropdown
router.get(
    '/information/dropdown',
    ErrorHandler(InformationController.getDropdown)
)

module.exports = router
