const SkillModel = require('../models/skill')

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
