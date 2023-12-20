const UserService = require('../services/user.service')

exports.findAll = async (req, res) => {
    const result = await UserService.findAll(req.params)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get users' })
}
