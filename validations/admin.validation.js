const Joi = require('joi')

module.exports = {
    verifyAction: Joi.object().keys({
        password: Joi.string().required(),
    }),
}
