const InformationModel = require('../models/information')

exports.getDropdown = async (req, res) => {
    var skillName = req.query.skillName
    var category = req.query.category
    var subcategory = req.query.subcategory

    if (skillName && category && subcategory) {
        const result = await InformationModel.find({
            skill: skillName,
            category: category,
            sub_category: subcategory,
        }).exec()

        if (result) {
            return res.json({
                message: 'Success',
                data: result,
            })
        }
    }

    return res
        .status(400)
        .json({ message: 'Failed to get dropdown information' })
}
