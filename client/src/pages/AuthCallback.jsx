import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthAPI } from 'src/api'
import { useAuth, usePersistedGuest } from 'src/hooks'
import { authUtils } from 'src/utils'

const AuthCallback = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth_getUser, auth_setOpenModalLogin } = useAuth()
    const [searchParams] = useSearchParams()
    const { guest } = usePersistedGuest()

    const handleCloseModal = () => {
        dispatch(auth_setOpenModalLogin(false))
    }

    useEffect(() => {
        ;(async () => {
            const token = searchParams.get('token')
            const isNewUser = searchParams.get('isNewUser')

            if (token) {
                authUtils.saveUserAccessToken(token)
                // prettier-ignore
                if(isNewUser && guest?.registerToken && guest?._id) {
                    try {
                        const response = await AuthAPI.guest_syncRegisterGoogle({
                            token,
                            body: {
                                registerToken: guest?.registerToken ? guest.registerToken : null,
                                syncId: guest?._id ? guest._id : null,
                            },
                        })
                        if(response) {
                            dispatch(auth_getUser(token)).then(result => {
                                if (result?.meta?.requestStatus === 'fulfilled') {
                                    handleCloseModal()
                                    setTimeout(() => {
                                        navigate(`/home`)
                                    }, 350)
                                }
                            })
                        }
                    } catch(e) {
                        console.log("e", e)
                    }
                } else {
                    dispatch(auth_getUser(token)).then(result => {
                        if (result?.meta?.requestStatus === 'fulfilled') {
                            handleCloseModal()
                            setTimeout(() => {
                                navigate(`/home`)
                            }, 350)
                        }
                    })
                }
            } else {
                navigate(`/`)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, guest])

    return null
}

export default AuthCallback
