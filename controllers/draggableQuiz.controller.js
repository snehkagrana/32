const DraggableQuizService = require('../services/draggableQuiz.service')

exports.admin_create = async (req, res) => {
    const result = await DraggableQuizService.admin_create(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}
