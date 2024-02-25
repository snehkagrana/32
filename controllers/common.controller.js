const SkillModel = require('../models/skill')
const InformationModel = require('../models/information')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const QuestionModel = require('../models/question')

exports.getInitialSkills = async (req, res) => {
    SkillModel.find((err, values) => {
        if (err) {
            return res
                .status(400)
                .json({ message: 'Failed to get initial skills' })
        } else {
            values.sort((a, b) => {
                return a.order - b.order
            })
            return res.json({
                data: values,
            })
        }
    })
}

exports.getInitialInformations = async (req, res) => {
    InformationModel.find((err, values) => {
        if (err) {
            return res
                .status(400)
                .json({ message: 'Failed to get initial information' })
        } else {
            return res.json({
                data: values,
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
    let skills = await SkillModel.find().exec()
    let questions = await QuestionModel.find().exec()

    // check user last played
    if (user && skills.length) {
        // prettier-ignore
        const currentSkill = skills.find(x => x.skill === user?.last_played?.skill)
        // prettier-ignore
        const currentSkillIndex = skills.findIndex(x => x.skill === user?.last_played?.skill)
        // skill found
        // prettier-ignore
        if(currentSkill && currentSkillIndex > -1) {
            const lastPlayedSubCategory = currentSkill.sub_categories.find((x) => x.category === user?.last_played?.category && x.sub_category === user?.last_played?.sub_category);
            const lastPlayedSubCategoryIndex = currentSkill.sub_categories.findIndex((x) => x.category === user?.last_played?.category && x.sub_category === user?.last_played?.sub_category);
            if(lastPlayedSubCategory && lastPlayedSubCategoryIndex > -1) {
                // it's last sub categories
                if(currentSkill.sub_categories.length - 1 === lastPlayedSubCategoryIndex) {
                    // it's last skill
                    if(skills.length - 1 === currentSkillIndex) {
                        skill = questions[0].skill
                        category = questions[0].category
                        subCategory = questions[0].sub_category
                    } else {
                        const nextSkill = skills[currentSkillIndex + 1];
                        skill = nextSkill?.skill || questions[0].skill
                        category = nextSkill?.sub_categories[currentSkillIndex + 1]?.category || questions[0].category
                        subCategory = nextSkill?.sub_categories[currentSkillIndex + 1]?.sub_category || questions[0].sub_category
                    }
                } else {
                    skill = currentSkill.skill
                    category = currentSkill.sub_categories[lastPlayedSubCategoryIndex + 1].category
                    subCategory = currentSkill.sub_categories[lastPlayedSubCategoryIndex + 1].sub_category
                }                
            }
        }

        // skill not found
        else {
            const findFirstLesson = skills[0].sub_categories.find((x) => x.category === 'Start_Here' && x.sub_category === 'Stocks')
            if(findFirstLesson) {
                skill = skills[0].skill
                category = findFirstLesson.category
                subCategory = findFirstLesson.sub_category
            } else {
                skill = skills[0].skill
                category = skills[0].sub_categories[0].category
                subCategory = skills[0].sub_categories[0].sub_category
            }
        }
    }
    // guest
    else if (guest && skills.length) {
        // prettier-ignore
        const currentSkill = skills.find(x => x.skill === guest?.last_played?.skill)
        // prettier-ignore
        const currentSkillIndex = skills.findIndex(x => x.skill === guest?.last_played?.skill)
        // skill found
        // prettier-ignore
        if(currentSkill && currentSkillIndex > -1) {
            const lastPlayedSubCategory = currentSkill.sub_categories.find((x) => x.category === guest?.last_played?.category && x.sub_category === guest?.last_played?.sub_category);
            const lastPlayedSubCategoryIndex = currentSkill.sub_categories.findIndex((x) => x.category === guest?.last_played?.category && x.sub_category === guest?.last_played?.sub_category);
            if(lastPlayedSubCategory && lastPlayedSubCategoryIndex > -1) {
                // it's last sub categories
                if(currentSkill.sub_categories.length - 1 === lastPlayedSubCategoryIndex) {
                    // it's last skill
                    if(skills.length - 1 === currentSkillIndex) {
                        skill = questions[0].skill
                        category = questions[0].category
                        subCategory = questions[0].sub_category
                    } else {
                        const nextSkill = skills[currentSkillIndex + 1];
                        skill = nextSkill?.skill || questions[0].skill
                        category = nextSkill?.sub_categories[currentSkillIndex + 1]?.category || questions[0].category
                        subCategory = nextSkill?.sub_categories[currentSkillIndex + 1]?.sub_category || questions[0].sub_category
                    }
                } else {
                    skill = currentSkill.skill
                    category = currentSkill.sub_categories[lastPlayedSubCategoryIndex + 1].category
                    subCategory = currentSkill.sub_categories[lastPlayedSubCategoryIndex + 1].sub_category
                }                
            }
        }

        // skill not found
        else {
            const findFirstLesson = skills[0].sub_categories.find((x) => x.category === 'Start_Here' && x.sub_category === 'Stocks')
            if(findFirstLesson) {
                skill = skills[0].skill
                category = findFirstLesson.category
                subCategory = findFirstLesson.sub_category
            } else {
                skill = skills[0].skill
                category = skills[0].sub_categories[0].category
                subCategory = skills[0].sub_categories[0].sub_category
            }
        }
    }
    return res.json({
        skill,
        category,
        subCategory,
    })
}
