const mongoose = require('mongoose')

const LeaderBoardSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    isActive: Boolean,
    users: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            position: Number,
            displayName: String,
            xp: Number,
            email: String,
            imgPath: {
                type: String,
                default: null,
            },
        },
    ],
})

module.exports = mongoose.model('LeaderBoard', LeaderBoardSchema)
