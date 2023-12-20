const UserModel = require('../models/user')

module.exports = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            message: 'Opss.. forbidden',
        })
    } else {
        const user = await UserModel.findOne({ email: req.user.email })
        if (user.role === 'admin') {
            next()
        } else {
            return res.status(403).json({
                message: 'Opss.. forbidden',
            })
        }
    }
}
