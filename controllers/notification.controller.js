const { sendNotification } = require('../utils/notification.util')

exports.sendNotifications = async (req, res, next) => {
    const result = await sendNotification({
        token: req.body.token,
        title: req.body.title,
        body: req.body.body,
        data: req.body.data,
    })

    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to send notification' })
}
