const UserModel = require('../models/user')

exports.fillHeart = async (gemsAmount, userId) => {
    let user = await UserModel.findById(userId).exec()
    let result = null

    return result
}
