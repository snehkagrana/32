const { appConfig } = require('../configs/app.config')
const UserService = require('../services/user.service')
const UserModel = require('../models/user')
const QRCode = require('qrcode')

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

exports.getUserQr = async (req, res) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
        const userLink = `${appConfig.appBaseUrl}/profile/${user.username}`
        QRCode.toDataURL(userLink, function (err, url) {
            return res.json({
                qr: url,
            })
        })
    } else {
        return res.status(400).json({ message: 'Failed to get QR code user' })
    }
}
