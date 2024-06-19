const generateOTP = limit => {
    // Declare a digits variable
    // which stores all digits
    var digits = '0123456789'
    let otp = ''
    for (let i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp
}

module.exports = {
    generateOTP,
}
