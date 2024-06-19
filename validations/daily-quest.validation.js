const Joi = require('joi')

module.exports = {
    syncDailyQuest: Joi.object()
        .keys({
            // userId: Joi.string().required(),
            actionName: Joi.string().required(),
            value: Joi.number().required(),
        })
        .options({ allowUnknown: true }),

    claimDailyQuest: Joi.object()
        .keys({
            dailyQuestId: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}
