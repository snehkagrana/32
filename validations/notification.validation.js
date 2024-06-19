const Joi = require('joi')

module.exports = {
    sendGeneralNotification: Joi.object()
        .keys({
            title: Joi.string().allow(''),
            body: Joi.string().allow(''),
            imageUrl: Joi.string().allow(null).allow(''),
            // userIds: Joi.array(Joi.string()).required(),
            users: Joi.array()
                .items({
                    userId: Joi.string().required(),
                    email: Joi.string().required().allow('').allow(null),
                    displayName: Joi.string().allow('').allow(null),
                    imgPath: Joi.string().allow(null).allow(''),
                })
                .required()
                .min(1),
        })
        .options({ allowUnknown: true }),

    sendNotification: Joi.object()
        .keys({
            token: Joi.string().required(),
            title: Joi.string().required(),
            body: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    create: Joi.object()
        .keys({
            title: Joi.string(),
            body: Joi.string(),
            imageUrl: Joi.string().allow(null),
        })
        .options({ allowUnknown: true }),
    delete: Joi.object().keys({
        id: Joi.string().required(),
    }),
}
