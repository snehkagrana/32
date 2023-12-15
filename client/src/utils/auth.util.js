import Cookies from 'js-cookie'

const KEY = 'FingoUserToken'

const saveUserAccessToken = token => {
    var expires = new Date()
    expires.setTime(expires.getTime() + 604800000)
    document.cookie = KEY + '=' + token + ';expires=' + expires.toUTCString()
}
const getUserAccessToken = () => {
    return Cookies.get(KEY)
}
const removeUserAccessToken = () => {
    Cookies.remove(KEY)
}

export const authUtils = {
    getUserAccessToken,
    removeUserAccessToken,
    saveUserAccessToken,
}
