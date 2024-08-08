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
    register: Joi.object()
        .keys({
            firstName: Joi.string().required(),
            // lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(100).required(),
            role: Joi.string().optional(),
            referralCode: Joi.string().optional().allow(null),
            registerToken: Joi.string().optional().allow(null),
            syncId: Joi.string().optional().allow(null),
            clientType: Joi.string().optional().allow(null),
            userTimezone: Joi.string().optional().allow(null),
        })
        .options({ allowUnknown: true }),
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        userTimezone: Joi.string().optional().allow(null),
    }),
    sendLinkForgotPassword: Joi.object().keys({
        email: Joi.string().email().required(),
        baseUrl: Joi.string().required(),
    }),
    sendCodeForgotPassword: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
    verifyCodeForgotPassword: Joi.object().keys({
        code: Joi.string().required(),
        email: Joi.string().email().required(),
    }),
    sendRegisterCode: Joi.object()
        .keys({
            email: Joi.string().email().required(),
        })
        .options({ allowUnknown: true }),
    checkRegisterCode: Joi.object()
        .keys({
            email: Joi.string().email().required(),
        })
        .options({ allowUnknown: true }),
    verifyRegisterCode: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            code: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
    resetPassword: Joi.object()
        .keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            token: Joi.string().allow(null),
            code: Joi.string().allow(null),
        })
        .options({ allowUnknown: true }),
    googleSignInMobile: Joi.object()
        .keys({
            firstName: Joi.string().required(),
            // lastName: Joi.string().allow(null),
            email: Joi.string().email().required(),
            photo: Joi.string().allow(null),
            registerToken: Joi.string().optional().allow(null),
            syncId: Joi.string().optional().allow(null),
            userTimezone: Joi.string().optional().allow(null),
        })
        .options({ allowUnknown: true }),
    validateAppleToken: Joi.object()
        .keys({
            identityToken: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
    appleSignIn: Joi.object()
        .keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().allow(null),
            email: Joi.string().email().required(),
            registerToken: Joi.string().optional().allow(null),
            syncId: Joi.string().optional().allow(null),
            userTimezone: Joi.string().optional().allow(null),
        })
        .options({ allowUnknown: true }),
}
