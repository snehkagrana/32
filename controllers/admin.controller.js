const UserModel = require('../models/user')
const bcryptUtil = require('../utils/bcrypt.util')

exports.verifyAction = async (req, res) => {
    const user = await UserModel.findOne({ email: req.user.email })
    if (user && user.role === 'admin') {
        console.log('Hey, i am admin let me in')
        const isMatched = await bcryptUtil.compareHash(
            req.body.password,
            user.password
        )
        if (isMatched) {
            return res.json({
                data: 'Verified',
                message: 'Success.',
            })
        }
    }

    return res
        .status(403)
        .json({ message: 'You are not allowed to access this endpoint' })
}
