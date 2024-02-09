const SkillModel = require('../models/skill')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')

exports.getInitialData = async (req, res) => {
    SkillModel.find((err, values) => {
        if (err) {
            return res
                .status(400)
                .json({ message: 'Failed to get initial data' })
        } else {
            values.sort((a, b) => {
                return a.order - b.order
            })
            return res.json({
                skills: values,
            })
        }
    })
}

exports.getNextLesson = async (req, res) => {
    let skill = null
    let category = null
    let subCategory = null

    let user = await UserModel.findById(req.user._id).exec()
    let guest = await GuestModel.findById(req.user._id).exec()

    // check user last played
    if (user && user?.last_played?.skill) {
        let lastPlayedSkill = await SkillModel.findOne({
            skill: user.last_played.skill,
        }).exec()
        if (lastPlayedSkill) {
            skill = lastPlayedSkill.skill
            // prettier-ignore
            lastPlayedIndex = lastPlayedSkill.sub_categories.findIndex((x) => x.category === user?.last_played?.category && x.sub_category === user?.last_played?.sub_category )
            if (lastPlayedIndex > 0) {
                // prettier-ignore
                category = lastPlayedSkill?.sub_categories?.[lastPlayedIndex + 1]?.category ?? ""
                // prettier-ignore
                subCategory = lastPlayedSkill?.sub_categories?.[lastPlayedIndex + 1]?.sub_category ?? ""
            }
        }
    } else if (guest && guest?.last_played?.skill) {
        let lastPlayedSkill = await SkillModel.findOne({
            skill: guest.last_played.skill,
        }).exec()
        if (lastPlayedSkill) {
            skill = lastPlayedSkill.skill
            // prettier-ignore
            lastPlayedIndex = lastPlayedSkill.sub_categories.findIndex((x) => x.category === guest?.last_played?.category && x.sub_category === guest?.last_played?.sub_category )
            if (lastPlayedIndex > 0) {
                // prettier-ignore
                category = lastPlayedSkill?.sub_categories?.[lastPlayedIndex + 1]?.category ?? ""
                // prettier-ignore
                subCategory = lastPlayedSkill?.sub_categories?.[lastPlayedIndex + 1]?.sub_category ?? ""
            }
        }
    }
    return res.json({
        skill: skill,
        category,
        subCategory,
    })
}
