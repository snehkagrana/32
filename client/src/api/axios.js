import _axios from 'axios'
import { appConfig } from 'src/configs/app.config'
import { PERSIST_ROOT_KEY } from 'src/constants/app.constant'
import { authUtils } from 'src/utils'

// On request rejected
const onRequestError = axiosError => {
    return axiosError
}

// On response fulfilled
const onResponseSuccess = axiosResponse => {
    return axiosResponse
}

// On response rejected
const onResponseError = axiosError => {
    if (axiosError?.response?.status === 401) {
        authUtils.removeUserAccessToken()
        localStorage.removeItem(`persist:${PERSIST_ROOT_KEY}`)
        setTimeout(() => {
            window.location.href = '/home'
        }, 250)
    }
    return Promise.reject(axiosError)
}

/**
 * Axios instance
 */
const Axios = _axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 20000,
})

// On request
Axios.interceptors.request.use(
    async config => {
        try {
            // prettier-ignore
            const accessToken = authUtils.getUserAccessToken() ?? authUtils.getGuestAccessToken()
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
        } catch (e) {
            console.log('EEE .>>', e)
            console.log(e)
        }
        return config
    },
    error => {
        return Promise.reject(onRequestError(error))
    }
)
// On response
Axios.interceptors.response.use(
    async response => {
        return onResponseSuccess(response)
    },
    async error => {
        return onResponseError(error)
    }
)

export default Axios
