const { default: ShortUniqueId } = require('short-unique-id')

const getToday = () => {
    return new Date()
}

const daysDifference = lastDate => {
    const today = new Date()

    const day = lastDate ? lastDate.toISOString().split('T')[0] : 0

    const lastCompletedDay = new Date(day)

    return Math.floor((today - lastCompletedDay) / (1000 * 60 * 60 * 24))
}

const generateReferralCode = () => {
    // do logic there
    const uid = new ShortUniqueId({ length: 12 })
    return uid.rnd()
}

const generateUsername = fullName => {
    var digits = '0123456789'
    const userName = fullName
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/[^\w-]+/g, '')
    let _number = ''
    for (let i = 0; i < 5; i++) {
        _number += digits[Math.floor(Math.random() * 10)]
    }
    return userName + _number
}

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60 * 1000
    )

    var offset = date.getTimezoneOffset() / 60
    var hours = date.getHours()

    newDate.setHours(hours - offset)

    return newDate
}

module.exports = {
    getToday,
    daysDifference,
    generateReferralCode,
    generateUsername,
    convertUTCDateToLocalDate,
}
