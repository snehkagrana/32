const UserModel = require('../models/user')

exports.findAll = async params => {
    const users = await UserModel.find({ ...params })
    return users
}

exports.findOne = async id => {
    return await UserModel.findOne({ _id: id })
}

exports.findOneByUsername = async username => {
    return await UserModel.findOne({ username })
}
