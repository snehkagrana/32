// import Cookies from 'js-cookie'

const USER_TOKEN_KEY = 'FingoUserToken'
const GUEST_TOKEN_KEY = 'FingoGuestToken'

const saveUserAccessToken = token => {
    // var expires = new Date()
    // expires.setTime(expires.getTime() + 604800000)
    // document.cookie = USER_TOKEN_KEY + '=' + token + ';expires=' + expires.toUTCString() + ';path=/'
    localStorage.setItem(USER_TOKEN_KEY, token)
}
const getUserAccessToken = () => {
    return localStorage.getItem(USER_TOKEN_KEY)
}
const removeUserAccessToken = () => {
    localStorage.removeItem(USER_TOKEN_KEY)
}

/**
 * Guest token
 */
const saveGuestAccessToken = token => {
    localStorage.setItem(GUEST_TOKEN_KEY, token)
}
const getGuestAccessToken = () => {
    return localStorage.getItem(GUEST_TOKEN_KEY)
}
const removeGuestAccessToken = () => {
    localStorage.removeItem(GUEST_TOKEN_KEY)
}

export const authUtils = {
    getUserAccessToken,
    removeUserAccessToken,
    saveUserAccessToken,
    saveGuestAccessToken,
    getGuestAccessToken,
    removeGuestAccessToken,
}
