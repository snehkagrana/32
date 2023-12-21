// import Cookies from 'js-cookie'

const KEY = 'FingoUserToken'

const saveUserAccessToken = token => {
    // var expires = new Date()
    // expires.setTime(expires.getTime() + 604800000)
    // document.cookie = KEY + '=' + token + ';expires=' + expires.toUTCString() + ';path=/'
    localStorage.setItem(KEY, token)
}
const getUserAccessToken = () => {
    return localStorage.getItem(KEY)
}
const removeUserAccessToken = () => {
    localStorage.removeItem(KEY)
}

export const authUtils = {
    getUserAccessToken,
    removeUserAccessToken,
    saveUserAccessToken,
}
