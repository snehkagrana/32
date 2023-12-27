import React from 'react'
import { Helmet } from 'react-helmet'
import ResetPasswordForm from 'src/components/auth/ResetPasswordForm'
import 'src/styles/ResetPasswordPage.styles.css'
import logo from 'src/images/fingo-logo.png'
import { useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    return (
        <>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>
            <div className='ResetPasswordPage dottedBackground'>
                <img
                    onClick={() => navigate('/home')}
                    src={logo}
                    alt='Fingo Logo'
                    className='FingoLogo'
                />
                <ResetPasswordForm />
            </div>
        </>
    )
}

export default ResetPasswordPage
