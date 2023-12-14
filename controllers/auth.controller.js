const AuthService = require('../services/auth.service')
const jwtConfig = require('../configs/jwt.config')
const bcryptUtil = require('../utils/bcrypt.util')
const jwtUtil = require('../utils/jwt.util')

exports.register = async (req, res) => {
    const isExist = await AuthService.findUserByEmail(req.body.email)
    if (isExist) {
        return res.status(400).json({
            redirect: '/register',
            message: 'User Already Exists!',
        })
    }
    const hashedPassword = await bcryptUtil.createHash(req.body.password)

    const newUser = {
        displayName: req.body.displayName,
        email: req.body.email,
        password: hashedPassword,
        role: 'basic',
        streak: 0,
        lastCompletedDay: null,
        xp: {
            current: 0,
            daily: 0,
            total: 0,
            level: 1,
        },
    }

    const user = await AuthService.createUser(newUser)
    user.password = ''

    return res.json({
        redirect: '/login',
        message: 'User Created' /* user: user*/,
    })
}

exports.login = async (req, res) => {
    const user = await AuthService.findUserByEmail(req.body.email)
    await AuthService.syncUserXp(req.body.email)
    if (user) {
        const isMatched = await bcryptUtil.compareHash(
            req.body.password,
            user.password
        )
        if (isMatched) {
            const token = await jwtUtil.createToken({
                _id: user._id,
                email: user.email,
            })

            return res.json({
                data: {
                    access_token: token,
                    token_type: 'Bearer',
                    expires_in: jwtConfig.ttl,
                },
                message: 'Success.',
            })
        }

        if (user.email === undefined || user.email === '') {
            var redir = {
                redirect: '/updateemail',
                message: 'It is mandatory to update your email.',
            }
            return res.json(redir)
        }
    }

    return res
        .status(400)
        .json({ message: 'Incorrect Email or Wrong Password' })
}

exports.getUser = async (req, res) => {
    const user = await AuthService.findUserById(req.user._id)
    user.password = ''
    return res.json({
        data: user,
        message: 'Success.',
    })
}

exports.syncUserXp = async (req, res) => {
    await AuthService.syncUserXp(req.user.email)
    return res.json({ message: 'Sync successfully.' })
}

exports.logout = async (req, res) => {
    await AuthService.logoutUser(req.token, req.user.exp)
    return res.json({ message: 'Logged out successfully.' })
}
