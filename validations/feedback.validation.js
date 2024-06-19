const Joi = require('joi')

module.exports = {
    getQuizFeedback: Joi.object()
        .keys({
            skill: Joi.string().required(),
            category: Joi.string().required(),
            subCategory: Joi.string().required(),
        })
        .options({ allowUnknown: true }),

    submitQuizFeedback: Joi.object()
        .keys({
            email: Joi.string().allow(null), // get email from JWT
            skill: Joi.string().required(),
            category: Joi.string().required(),
            subCategory: Joi.string().required(),
            feedback: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
