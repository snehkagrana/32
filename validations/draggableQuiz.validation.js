const Joi = require('joi')

module.exports = {
    save: Joi.object()
        .keys({
            // gemsAmount: Joi.number().required(),
        })
        .options({ allowUnknown: true }),
}
