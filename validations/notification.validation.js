const Joi = require('joi')

module.exports = {
    sendNotification: Joi.object()
        .keys({
            token: Joi.string().required(),
            title: Joi.string().required(),
            body: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
