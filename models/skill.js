const mongoose = require("mongoose");

const skill = new mongoose.Schema({
    skill: {
        type: String,
    },
    questions: [
        {
            category: {
                type: String,
            },
            sub_category: {
                type: String,
            },
            question_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "question",
            },
        },
    ],
    information: [
        {
            category: {
                type: String,
            },
            sub_category: {
                type: String,
            },
            information_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "information",
            },
        },
    ],
    categories: [
        {
            type: String,
        },
    ],
    sub_categories: [
        {
            category: {
                type: String,
            },
            sub_category: {
                type: String,
            },
        },
    ],
    order: {
        type: Number,
    },
});

module.exports = mongoose.model("Skill", skill);
