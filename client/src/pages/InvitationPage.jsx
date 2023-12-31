/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const InvitationPage = () => {
    const navigate = useNavigate()
    const { referralCode } = useParams()

    useEffect(() => {
        ;(async () => {
            if (referralCode) {
                navigate(
                    `/home?modalRegister=true&referralCode=${referralCode}`
                )
            }
        })()
    }, [referralCode])

    return null
}

export default InvitationPage
