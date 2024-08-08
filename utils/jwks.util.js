const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const APPLE_BASE_URL = 'https://appleid.apple.com'
const JWKS_APPLE_URI = '/auth/keys'

const validateToken = async identityToken => {
    const decodedToken = jwt.decode(identityToken, { complete: true })
    const { kid, alg } = decodedToken.header

    // fetch JSON web token key set
    const client = jwksClient({
        jwksUri: `${APPLE_BASE_URL}/${JWKS_APPLE_URI}`,
    })
    const signingKey = await client.getSigningKey(kid)

    const publicKey = signingKey.getPublicKey()
    const publicKid = signingKey.kid
    const publicAlg = signingKey.alg

    if (publicAlg !== alg) {
        throw new Error('the alg does not match with jwk config.')
    }
    if (publicKid !== kid) {
        throw new Error('the kid does not match with Apple auth keys')
    }

    const token = jwt.verify(identityToken, publicKey, {
        algorithms: publicAlg,
    })

    if (token?.iss !== APPLE_BASE_URL) {
        throw new Error('the iss does not match with Apple.')
    }
    return token
}

module.exports = { validateToken }
