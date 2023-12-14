const jwt = require('jsonwebtoken')
const jwtConfig = require('../configs/jwt.config')

exports.verifyToken = async token => jwt.verify(token, jwtConfig.secret)

exports.createToken = async data =>
    jwt.sign(data, jwtConfig.secret, { expiresIn: jwtConfig.ttl })
