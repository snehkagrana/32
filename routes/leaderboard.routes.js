const express = require('express')
const router = express.Router()

const LeaderBoardController = require('../controllers/leaderboard.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

/**
 * Get current leaderboard
 */
router.get(
    '/leaderboard',
    AuthGuard,
    ErrorHandler(LeaderBoardController.getCurrentLeaderBoard)
)

module.exports = router
