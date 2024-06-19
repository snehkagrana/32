const mongoose = require('mongoose')

const DraggableQuizSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    template: String,
    list: [
        {
            id: String,
            label: String,
            correctPlaceId: String,
        },
    ],
    places: [
        {
            id: String,
            label: String,
        },
    ],
    explanation: {
        type: String,
    },
})

module.exports = mongoose.model('DraggableQuiz', DraggableQuizSchema)
