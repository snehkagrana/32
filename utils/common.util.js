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

module.exports = {
    getToday,
    daysDifference,
    generateReferralCode,
}
