const express = require('express')
const router = express.Router()

const FriendshipController = require('../controllers/friendship.controller')
// const FriendshipController = require('../controllers/friendship.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const FriendshipValidation = require('../validations/friendship.validation')
const validate = require('../utils/validator.util')

//  Get follower
router.post(
    '/friendship/follower',
    validate(FriendshipValidation.getFollowers),
    AuthGuard,
    ErrorHandler(FriendshipController.getFollowers)
)

router.post(
    '/friendship/following',
    validate(FriendshipValidation.getFollowers),
    AuthGuard,
    ErrorHandler(FriendshipController.getFollowing)
)

module.exports = router
