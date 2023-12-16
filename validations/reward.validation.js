const Joi = require('joi')

module.exports = {
    create: Joi.object()
        .keys({
            name: Joi.string().required(),
            description: Joi.string().allow(null).allow('').optional(),
            brandUrl: Joi.string().allow(null).allow('').optional(),
            currencyValue: Joi.string().required(),
            currencyCode: Joi.string().required(),
            diamondValue: Joi.number().required(),
            claimCode: Joi.string().allow(null).allow('').optional(),
            pin: Joi.string().allow(null).allow('').optional(),
            type: Joi.string().allow(null).allow('').optional(),
            imageURL: Joi.string().allow(null).allow('').optional(),
        })
        .options({ allowUnknown: true }),
    delete: Joi.object().keys({
        id: Joi.string().required(),
    }),
    giftReward: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            items: Joi.array().items({
                rewardId: Joi.string().required(),
                name: Joi.string().required(),
                currencyValue: Joi.string().required(),
                currencyCode: Joi.string().required(),
                diamondValue: Joi.number().required(),
                claimCode: Joi.string().allow(null).allow('').optional(),
                pin: Joi.string().allow(null).allow('').optional(),
                type: Joi.string().allow(null).allow('').optional(),
                imageURL: Joi.string().allow(null).allow('').optional(),
                notes: Joi.string().optional(),
            }),
        })
        .options({ allowUnknown: true }),
    redeem: Joi.object()
        .keys({
            itemId: Joi.string().required(),
            notes: Joi.string().allow(null).allow('').optional(),
        })
        .options({ allowUnknown: true }),
}
