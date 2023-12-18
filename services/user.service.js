const UserModel = require('../models/user')

exports.findAll = async params => {
    const users = await UserModel.find({ ...params })
    return users
}
