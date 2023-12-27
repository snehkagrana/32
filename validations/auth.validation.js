const Joi = require('joi')
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)

const validatePassword = value => {
    if (!passwordRegex.test(String(value))) {
        throw new Error(
            'Password should contains a lowercase, a uppercase character and a digit.'
        )
    }
}

module.exports = {
    register: Joi.object().keys({
        displayName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        role: Joi.string().optional(),
    }),
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    sendLinkForgotPassword: Joi.object().keys({
        email: Joi.string().email().required(),
        baseUrl: Joi.string().required(),
    }),
    resetPassword: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            token: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
