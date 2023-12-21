import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from 'src/hooks'
import { authUtils } from 'src/utils'

const AuthCallback = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth_getUser, auth_setOpenModalLogin } = useAuth()
    const [searchParams] = useSearchParams()

    const handleCloseModal = () => {
        dispatch(auth_setOpenModalLogin(false))
    }

    useEffect(() => {
        ;(async () => {
            const token = searchParams.get('token')
            if (token) {
                authUtils.saveUserAccessToken(token)
                dispatch(auth_getUser(token)).then(result => {
                    if (result?.meta?.requestStatus === 'fulfilled') {
                        handleCloseModal()
                        setTimeout(() => {
                            navigate(`/home`)
                        }, 350)
                    }
                })
            } else {
                navigate(`/`)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    return null
}

export default AuthCallback
