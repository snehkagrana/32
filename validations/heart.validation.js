const Joi = require('joi')

module.exports = {
    refillHearts: Joi.object()
        .keys({
            gemsAmount: Joi.number().required(),
        })
        .options({ allowUnknown: true }),
}
