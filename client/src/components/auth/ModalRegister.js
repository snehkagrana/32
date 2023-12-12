import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Modal } from 'react-bootstrap'
import CustomGoogleSignInButton from '../CustomGoogleSignInButton'
import '../../styles/auth.styles.css'
import { batch, useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks'

export default function ModalRegister() {
    const dispatch = useDispatch()
    const {
        auth_openModalRegister,
        auth_setOpenModalLogin,
        auth_setOpenModalRegister,
    } = useAuth()

    const [registerFirstName, setRegisterFirstName] = useState('')
    const [registerLastName, setRegisterLastName] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [emailTooltipMessage, setEmailTooltipMessage] = useState('')
    const [lastNameTooltipMessage, setLastNameTooltipMessage] = useState('')
    const [firstNameTooltipMessage, setFirstNameTooltipMessage] = useState('')
    const [hasInteractedWithFirstName, setHasInteractedWithFirstName] =
        useState(false)
    const [hasInteractedWithLastName, setHasInteractedWithLastName] =
        useState(false)
    const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false)
    const [hasInteractedWithPassword, setHasInteractedWithPassword] =
        useState(false)
    const [authMsg, setAuthMsg] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [validFirstName, setValidFirstName] = useState(false)
    const [validLastName, setValidLastName] = useState(false)
    const [showAuthMsg, setShowAuthMsg] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [passwordTooltipMessage, setPasswordTooltipMessage] = useState('')

    const navigate = useNavigate()

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    const handleClick = () => {
        navigate('/home')
    }

    // clean up form validation
    useEffect(() => {
        if (!auth_openModalRegister) {
            setPasswordTooltipMessage('')
            setEmailTooltipMessage('')
            setLastNameTooltipMessage('')
            setFirstNameTooltipMessage('')
        }
    }, [auth_openModalRegister])

    ////function to register user from the server after he has entered the information
    //// if all the information is valid redirect him to login page else display the flash message
    const handleRegister = () => {
        Axios({
            method: 'POST',
            data: {
                displayName: `${registerFirstName} ${registerLastName}`,
                email: registerEmail,
                password: registerPassword,
                role: 'basic',
            },
            withCredentials: true,
            url: '/server/register',
        }).then(function (response) {
            setAuthMsg(response.data.message)
            setShowAuthMsg(true)

            batch(() => {
                dispatch(auth_setOpenModalRegister(false))
                dispatch(auth_setOpenModalLogin(true))
            })

            if (response.data.redirect == '/') {
                navigate(`/`)
            } else if (response.data.redirect == '/login') {
                dispatch(auth_setOpenModalLogin(true))
                // navigate(`/auth/login`);
            }
        })
    }

    const registerWithGoogle = e => {
        e.stopPropagation()
        // Axios does not work with Google Auth2.0 , need to navigate to the url directly
        window.open('https://tryfingo.com/auth/login-google', '_self')
    }

    ////when a user requests for the register , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the register page to let him register
    useEffect(() => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: '/server/register',
        }).then(function (response) {
            setAuthMsg(response.data.message)
            setShowAuthMsg(true)
            // if (response.data.redirect == "/home") {
            //   navigate(`/home`);
            // }
        })
    }, [])

    const handleFirstNameChange = e => {
        setRegisterFirstName(e.target.value)
        var firstNameRegex = /\s/
        if (e.target.value === '' && hasInteractedWithFirstName) {
            setFirstNameTooltipMessage("First Name can't be empty")
            setValidFirstName(false)
        } else if (!firstNameRegex.test(e.target.value)) {
            setFirstNameTooltipMessage('')
            setValidFirstName(true)
        }
    }

    const handleFirstNameBlur = () => {
        setHasInteractedWithFirstName(true)
        if (registerFirstName === '') {
            setFirstNameTooltipMessage("First Name can't be empty")
        }
    }

    const handleLastNameChange = e => {
        setRegisterLastName(e.target.value)
        var lastNameRegex = /\s/
        if (e.target.value === '' && hasInteractedWithLastName) {
            setLastNameTooltipMessage("Last Name can't be empty")
            setValidLastName(false)
        } else if (!lastNameRegex.test(e.target.value)) {
            setLastNameTooltipMessage('')
            setValidLastName(true)
        }
    }

    const handleLastNameBlur = () => {
        setHasInteractedWithLastName(true)
        if (registerLastName === '') {
            setLastNameTooltipMessage("Last Name can't be empty")
        }
    }

    const handleEmailChange = e => {
        setRegisterEmail(e.target.value)
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        if (e.target.value === '' && hasInteractedWithEmail) {
            setEmailTooltipMessage("Email can't be empty")
            setValidEmail(false)
        } else if (emailRegex.test(e.target.value)) {
            setEmailTooltipMessage('')
            setValidEmail(true)
        } else {
            setEmailTooltipMessage('Email invalid')
            setValidEmail(false)
        }
    }

    const handleEmailBlur = () => {
        setHasInteractedWithEmail(true)
        if (registerEmail === '') {
            setEmailTooltipMessage("Email can't be empty")
        }
    }

    const handlePasswordChange = e => {
        const password = e.target.value
        setRegisterPassword(password)

        if (password === '') {
            setPasswordTooltipMessage("Password can't be empty")
            setValidPassword(false)
        } else if (/\s/.test(password)) {
            // Check if password contains spaces
            setPasswordTooltipMessage('Spaces not allowed')
            setValidPassword(false)
        } else {
            setPasswordTooltipMessage('')
            setValidPassword(true)
        }
    }

    const handlePasswordBlur = () => {
        setHasInteractedWithPassword(true)
        if (registerPassword === '') {
            setPasswordTooltipMessage("Password can't be empty")
        }
    }

    const handleCloseModal = () => {
        dispatch(auth_setOpenModalRegister(false))
    }

    const onClickLogin = e => {
        e.stopPropagation()
        batch(() => {
            dispatch(auth_setOpenModalRegister(false))
            dispatch(auth_setOpenModalLogin(true))
        })
    }

    return (
        <Modal
            className='auth_modal'
            show={auth_openModalRegister}
            onHide={handleCloseModal}
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <button className='auth_modal_close' onClick={handleCloseModal}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1024'
                    height='1024'
                    viewBox='0 0 1024 1024'
                >
                    <path
                        fill='currentColor'
                        d='M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z'
                    />
                </svg>
            </button>
            <Form
                className='FingoShapeRadius'
                style={{
                    width: '100%',
                    borderRadius: '10px',
                    padding: '40px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    minWidth: '300px',
                    background: '#f7fcf7',
                }}
            >
                {/* <button className="back-home" onClick={handleClick} alt="backButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"></path>
          </svg>
        </button> */}
                <h1
                    style={{
                        color: '#333',
                        textAlign: 'center',
                        marginBottom: '30px',
                        marginTop: '10px',
                    }}
                >
                    Create Account!
                </h1>

                {/* <Toast onClose={() => setShowAuthMsg(false)} show={showAuthMsg} delay={1500} autohide>
                            <Toast.Body>{authMsg}</Toast.Body>
                        </Toast> */}
                {/* First Name Form Group */}
                <div className='form-row'>
                    <div className='col'>
                        <Form.Group>
                            <Form.Text
                                className='form-text-name'
                                style={{ color: 'red' }}
                            >
                                {firstNameTooltipMessage}
                            </Form.Text>
                            <Form.Control
                                type='text'
                                placeholder='First Name'
                                onChange={handleFirstNameChange}
                                onBlur={handleFirstNameBlur}
                                style={{
                                    borderRadius: '10px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                }}
                            />
                        </Form.Group>
                    </div>

                    <div className='col'>
                        <Form.Group>
                            <Form.Text
                                className='form-text-name'
                                style={{ color: 'red' }}
                            >
                                {lastNameTooltipMessage}
                            </Form.Text>
                            <Form.Control
                                type='text'
                                placeholder='Last Name'
                                onChange={handleLastNameChange}
                                onBlur={handleLastNameBlur}
                                style={{
                                    borderRadius: '10px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                }}
                            />
                        </Form.Group>
                    </div>
                </div>
                {/* Email Form Group */}
                <Form.Group>
                    <Form.Text style={{ color: 'red' }}>
                        {emailTooltipMessage}
                    </Form.Text>
                    <Form.Control
                        type='email'
                        placeholder='Enter your Email'
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        style={{
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '10px',
                        }}
                    />
                </Form.Group>
                {/* Password Form Group */}
                <Form.Group>
                    <Form.Text style={{ color: 'red' }}>
                        {passwordTooltipMessage}
                    </Form.Text>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your Password'
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        style={{
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '10px',
                        }}
                    />
                    <Form.Group controlId='formBasicCheckbox'>
                        <Form.Check
                            type='checkbox'
                            label='Show Password'
                            onClick={handleShowPassword}
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                            className='custom-label-color'
                        />
                    </Form.Group>
                </Form.Group>
                {/* Submit Button */}
                <Button
                    style={{
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        boxShadow: `0px 7px ${
                            validEmail &&
                            validFirstName &&
                            validLastName &&
                            validPassword
                                ? '#1a5928'
                                : '#ab2a2a'
                        }`,
                    }}
                    variant={
                        validEmail &&
                        validFirstName &&
                        validLastName &&
                        validPassword
                            ? 'success'
                            : 'danger'
                    }
                    disabled={
                        !(
                            validEmail &&
                            validFirstName &&
                            validLastName &&
                            validPassword
                        )
                    }
                    onClick={handleRegister}
                >
                    Create New Fingo ID
                </Button>
                <br />
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '16px',
                        margin: '10px 0',
                    }}
                >
                    <hr className='hr-text' data-content='OR' />
                </div>

                <CustomGoogleSignInButton onClick={registerWithGoogle} />

                <br />
                <div
                    style={{
                        color: '#333',
                        textAlign: 'center',
                        marginBottom: '5px',
                        marginTop: '5px', // Added space above this line
                    }}
                >
                    Already have an account?
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            onClick={onClickLogin}
                            variant='success' // Added success variant to match the green color
                            style={{
                                marginTop: '5px',
                                borderRadius: '7px',
                                width: '50%',
                                boxShadow: '0px 5px #1a5928',
                                transition: '0.2s ease',
                            }}
                            className='regHover'
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}
