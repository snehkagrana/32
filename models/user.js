//Model for user account

const mongoose = require("mongoose");
const user = new mongoose.Schema({
    displayName: String,
    email: String,
    password: String,
    role: String,
    imgPath: {
        type: String,
    },
    score: [
        {
            skill: {
                type: String,
            },
            category: {
                type: String,
            },
            sub_category: {
                type: String,
            },
            points: {
                type: Number,
            },
        },
    ],
    xp: {
        current: Number,
        daily: Number,
        total: Number,
    },
    last_played: {
        skill: {
            type: String,
        },
        category: {
            type: String,
        },
        sub_category: {
            type: String,
        },
    },
    streak: Number,
    lastCompletedDay: Date,
    password_reset_token: String,
});

module.exports = mongoose.model("User", user);
