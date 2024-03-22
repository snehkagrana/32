const express = require('express')
const router = express.Router()

const LeaderBoardController = require('../controllers/leaderboard.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')

/**
 * Get result leaderboard
 */
router.get(
    '/leaderboard/result',
    AuthGuard,
    ErrorHandler(LeaderBoardController.getResultLeaderBoard)
)

/**
 * Mark seen result leaderboard
 */
router.get(
    '/leaderboard/markseen/:leaderBoardId',
    AuthGuard,
    ErrorHandler(LeaderBoardController.markSeen)
)

/**
 * Get current leaderboard
 */
router.get(
    '/leaderboard/friends',
    AuthGuard,
    ErrorHandler(LeaderBoardController.getLeaderBoardFriends)
)

/**
 * Get current leaderboard
 */
router.get(
    '/leaderboard',
    AuthGuard,
    ErrorHandler(LeaderBoardController.getCurrentLeaderBoard)
)

module.exports = router
