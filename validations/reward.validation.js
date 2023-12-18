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
            type: Joi.string().allow(null).allow('').optional(),
            imageURL: Joi.string().allow(null).allow('').optional(),
            variants: Joi.array()
                .items({
                    claimCode: Joi.string().required(),
                    pin: Joi.string().allow(null).allow('').optional(),
                    isAvailable: Joi.boolean(),
                    notes: Joi.string().allow(null).allow('').optional(),
                })
                .required()
                .min(1),
        })
        .options({ allowUnknown: true }),
    delete: Joi.object().keys({
        id: Joi.string().required(),
    }),
    giftReward: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            itemId: Joi.string().required(),
            variantId: Joi.string().required(),
            notes: Joi.string().allow(null).allow('').optional(),
        })
        .options({ allowUnknown: true }),

    redeem: Joi.object()
        .keys({
            itemId: Joi.string().required(),
            variantId: Joi.string().required(),
            notes: Joi.string().allow(null).allow('').optional(),
        })
        .options({ allowUnknown: true }),
}
