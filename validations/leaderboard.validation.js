const Joi = require('joi')

module.exports = {
    updateAndSync: Joi.object().keys({
        xp: Joi.number().required(),
    }),
}
