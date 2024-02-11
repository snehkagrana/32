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
}
