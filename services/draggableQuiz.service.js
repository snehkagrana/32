const DraggableQuizModel = require('../models/draggableQuiz')

exports.admin_create = body => {
    return DraggableQuizModel.create(body)
}
