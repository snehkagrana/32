const mongoose = require("mongoose");

const question = new mongoose.Schema({
    question: {
        type: String,
    },
    options: [
        {
            type: String,
        },
    ],
    correct_answers: [
        {
            type: String,
        },
    ],
    explaination: {
        type: String,
    },
    skill: {
        type: String,
    },
    category: {
        type: String,
    },
    sub_category: {
        type: String,
    },
    imgpath: {
        type: String,
    },
});

module.exports = mongoose.model("Question", question);
