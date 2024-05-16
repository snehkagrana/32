const dayjs = require('dayjs')
const { default: ShortUniqueId } = require('short-unique-id')
const { SERVER_TIMEZONE } = require('../constants/app.constant')

const getToday = () => {
    return new Date()
}

const daysDifference = lastDate => {
    // const day = lastDate ? lastDate.toISOString().split('T')[0] : 0
    // const lastCompletedDay = new Date(day)
    // return Math.floor((today - lastCompletedDay) / (1000 * 60 * 60 * 24))
    if (!lastDate) return
    const dateString = new Date().toLocaleString('en-US', {
        timeZone: SERVER_TIMEZONE,
    })
    const now = dayjs(dateString).format()
    return dayjs(now).diff(lastDate, 'day')
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

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

module.exports = {
    getToday,
    daysDifference,
    generateReferralCode,
    generateUsername,
    convertUTCDateToLocalDate,
    validateEmail,
    getRandomInt,
}
