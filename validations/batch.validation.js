const Joi = require('joi')

module.exports = {
    batch: Joi.object()
        .keys({
            eventType: Joi.string().required(),
            eventTimestamp: Joi.number(),
            itemId: Joi.string().allow(null).optional(),
            isCorrect: Joi.boolean().optional(),
            userId: Joi.string().allow(null).optional(),
            guestId: Joi.string().allow(null).optional(),
        })
        .options({ allowUnknown: true }),
}
