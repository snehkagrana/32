const Joi = require('joi')

module.exports = {
    saveScore: Joi.object()
        .keys({
            skill: Joi.string().required(),
            category: Joi.string().required(),
            sub_category: Joi.string().required(),
            points: Joi.number().required(),
            score: Joi.array().items(Joi.number()).required(),
        })
        .options({ allowUnknown: true }),

    saveXp: Joi.object()
        .keys({
            xp: Joi.number().required(),
        })
        .options({ allowUnknown: true }),
}
