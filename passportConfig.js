const User = require('./models/user')
const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwtUtil = require('./utils/jwt.util')
const jwtConfig = require('./configs/jwt.config')
const AuthService = require('./services/auth.service')
const { appConfig } = require('./configs/app.config')
const {
    generateReferralCode,
    generateUsername,
} = require('./utils/common.util')
require('dotenv').config()

module.exports = function (passport) {
    const refCode = generateReferralCode()
    passport.use(
        new localStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                User.findOne({ email: email }, (err, user) => {
                    if (err) throw err
                    if (!user)
                        return done(null, false, {
                            message: 'No user with that email',
                        })
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) throw err
                        if (result === true) {
                            console.log('user', user)
                            return done(null, user)
                        } else {
                            return done(null, false, {
                                message: 'Password Incorrect',
                            })
                        }
                    })
                })
            }
        )
    )

    passport.use(
        new GoogleStrategy(
            {
                // options for google strategy
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'https://tryfingo.com/auth/login-google/callback', //google callback url, same as the one added in Google API page
            },
            async function (accessToken, refreshToken, profile, done) {
                // passport callback function

                // console.log("profile", profile);
                const email = profile?.emails?.[0]?.value
                    ? profile.emails[0].value
                    : ''
                const displayName = profile?.displayName
                    ? profile.displayName
                    : ''
                const profileImageUrl = profile?.photos?.[0]?.value
                    ? profile.photos[0].value
                    : ''

                /**
                 * checking if another user with same email already exists
                 **/
                let user = await User.findOne({ email }).exec()
                if (user) {
                    const token = await jwtUtil.createToken({
                        _id: user._id,
                        email: user.email,
                    })
                    return done(false, {
                        access_token: token,
                        isNewUser: false,
                        token_type: 'Bearer',
                        expires_in: jwtConfig.ttl,
                    })
                } else {
                    const newUserData = {
                        username: generateUsername(displayName),
                        displayName: displayName,
                        email: email,
                        password: '',
                        role: 'basic',
                        streak: 0,
                        lastCompletedDay: null,
                        imgPath: profileImageUrl || null,
                        diamond: 0,
                        xp: {
                            current: 0,
                            daily: 0,
                            total: 0,
                            level: 1,
                            weekly: 0,
                        },
                        heart: appConfig.defaultHeart || 5,
                        lastHeartAccruedAt: new Date(),
                        unlimitedHeart: null,
                        referralCode: refCode,
                        registeredAt: new Date(),
                        emailVerifiedAt: new Date(),
                    }
                    const newUser = await AuthService.createUser(newUserData)
                    const token = await jwtUtil.createToken({
                        _id: newUser._id,
                        email: newUser.email,
                    })
                    return done(false, {
                        access_token: token,
                        isNewUser: true,
                        token_type: 'Bearer',
                        expires_in: jwtConfig.ttl,
                        message: 'Success.',
                    })
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(function (user, done) {
        done(null, user)
    })
}
