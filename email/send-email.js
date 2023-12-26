const fs = require('fs')
const mustache = require('mustache')
const { mailTransporter } = require('../utils/mail.util')

exports.sendEmailForgotPassword = async payload => {
    const template = fs.readFileSync(
        './email/templates/forgot-password.html',
        'utf8'
    )
    const options = {
        to: payload.to,
        from: payload.from || process.env.MAIL,
        subject: 'Forgot Password Link',
        html: mustache.render(template, { ...payload }),
    }

    return await mailTransporter
        .sendMail(options)
        .then(() => {})
        .catch(err => {
            console.log('Failed to send email')
            console.error(err)
        })
}
