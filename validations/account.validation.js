const Joi = require('joi')

module.exports = {
    markSeenReward: Joi.object()
        .keys({
            rewardId: Joi.string().required(),
            variantId: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    checkAvailabilityUsername: Joi.object()
        .keys({
            // username: Joi.string().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
        })
        .options({ allowUnknown: true }),

    sendCodeVerifyEmail: Joi.object()
        .keys({
            email: Joi.string().email().required(),
        })
        .options({ allowUnknown: true }),

    verifyEmail: Joi.object()
        .keys({
            code: Joi.string().required(),
            email: Joi.string().email().required(),
        })
        .options({ allowUnknown: true }),

    updateProfile: Joi.object()
        .keys({
            displayName: Joi.string().required(),
            username: Joi.string().required(),
            // email: Joi.string().email().required(),
            phoneNumber: Joi.string().allow(null),
        })
        .options({ allowUnknown: true }),

    changeAvatar: Joi.object()
        .keys({
            avatarId: Joi.number().required(),
            clientType: Joi.string().allow(null),
        })
        .options({ allowUnknown: true }),

    toggleFollow: Joi.object()
        .keys({
            action: Joi.string().required(),
            userId: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    searchFriends: Joi.object()
        .keys({
            searchTerm: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    saveFCMToken: Joi.object()
        .keys({
            token: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    saveNextLesson: Joi.object()
        .keys({
            skill: Joi.string().required(),
            category: Joi.string().required(),
            subCategory: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
