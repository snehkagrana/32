const mongoose = require('mongoose')

const FriendshipSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date,
})

module.exports = mongoose.model('Friendship', FriendshipSchema)
