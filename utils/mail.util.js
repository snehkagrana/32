const nodemailer = require('nodemailer')

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtpout.secureserver.net',
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers: 'SSLv3',
    },
    requireTLS: true,
    port: process.env.MAIL_PORT || 465,
    debug: true,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD_MAIL,
    },
})

module.exports = {
    mailTransporter,
}
