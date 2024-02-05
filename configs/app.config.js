const { DEFAULT_HEART } = require('../constants/app.constant')

exports.appConfig = {
    defaultHeart: DEFAULT_HEART,
    appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:5000',
}
