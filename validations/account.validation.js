const Joi = require('joi')

module.exports = {
    markSeenReward: Joi.object()
        .keys({
            rewardId: Joi.string().required(),
            variantId: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
