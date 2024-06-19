const mongoose = require('mongoose')

const VerifyRegisterCodeSchema = new mongoose.Schema({
    email: String,
    code: String,
})

module.exports = mongoose.model('VerifyRegisterCode', VerifyRegisterCodeSchema)
