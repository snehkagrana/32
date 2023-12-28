const Joi = require('joi')

module.exports = {
    fillHeart: Joi.object()
        .keys({
            gemsAmount: Joi.number().required(),
        })
        .options({ allowUnknown: true }),
}
