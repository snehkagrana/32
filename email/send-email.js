const fs = require('fs')
const mustache = require('mustache')
const { mailTransporter } = require('../utils/mail.util')

exports.sendEmailVerifyRegisterCode = async payload => {
    const template = fs.readFileSync('./email/templates/register.html', 'utf8')
    const options = {
        to: payload.to,
        from: payload.from || process.env.MAIL,
        subject: 'Verify Email',
        html: mustache.render(template, { ...payload }),
    }

    return await mailTransporter
        .sendMail(options)
        .then(() => {})
        .catch(err => {
            console.log('Failed to send register code')
            console.error(err)
        })
}

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

exports.sendOtpEmailForgotPassword = async payload => {
    const template = fs.readFileSync(
        './email/templates/otp-forgot-password.html',
        'utf8'
    )
    const options = {
        to: payload.to,
        from: payload.from || process.env.MAIL,
        subject: 'Forgot Password OTP',
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

exports.sendEmailUserRedeemGiftCard = async payload => {
    const template = fs.readFileSync(
        './email/templates/user-redeem-gift-card.html',
        'utf8'
    )
    const options = {
        to: payload.to,
        from: payload.from || process.env.MAIL,
        subject: 'User Redeem Gift Card',
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

exports.sendEmailGiftCardRunOut = async payload => {
    const template = fs.readFileSync(
        './email/templates/gift-card-run-out.html',
        'utf8'
    )
    const options = {
        to: payload.to,
        from: payload.from || process.env.MAIL,
        subject: 'Gift Card Run Out',
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
