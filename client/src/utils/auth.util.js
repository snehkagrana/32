import Cookies from 'js-cookie'

const KEY = 'FingoUserToken'

const saveUserAccessToken = token => {
    Cookies.set(KEY, token)
}
const getUserAccessToken = () => {
    return Cookies.get(KEY) ?? ''
}
const removeUserAccessToken = () => {
    Cookies.remove(KEY)
}

export const authUtils = {
    getUserAccessToken,
    removeUserAccessToken,
    saveUserAccessToken,
}
