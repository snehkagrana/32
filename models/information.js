const mongoose = require("mongoose");

const information = new mongoose.Schema({
    heading: {
        type: String,
    },
    information: {
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

module.exports = mongoose.model("Information", information);
