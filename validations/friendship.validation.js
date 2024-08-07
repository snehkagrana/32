const Joi = require('joi')

module.exports = {
    getFollowers: Joi.object()
        .keys({
            id: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
