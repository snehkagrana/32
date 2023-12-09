/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import 'src/styles/FingoSidebar.styles.css'
import { MDBNavbarBrand } from 'mdb-react-ui-kit'

import nonSignedUp from 'src/images/nonSignedUp'
import signedUp from 'src/images/pepe.jpg'

import { ReactComponent as LogoutIcon } from 'src/assets/svg/loudly-crying-face.svg'
import { ReactComponent as EnterIcon } from 'src/assets/svg/enter.svg'
import { ReactComponent as SignUpIcon } from 'src/assets/svg/user-cirlce-add.svg'
import FingoSwitchTheme from './FingoSwitchTheme'
import { batch, useDispatch } from 'react-redux'
import { useApp, useAuth } from 'src/hooks'

import FingoLogo from 'src/images/fingo-logo.png'
import IcHome from 'src/assets/images/ic_home.png'

const FingoSidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        auth_setOpenModalLogin,
        auth_setOpenModalRegister,
        user,
        newUser,
        auth_setNewUser,
    } = useAuth()
    const { app_setSkills, app_setDailyXP, app_setTotalXP } = useApp()
    const role = useRef('')
    const [userName, setUserName] = useState(null)

    const [profilePicture, setProfilePicture] = useState('')

    const handleLogOut = () => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: '/server/logout',
        })
            .then(res => {
                navigate(`/`)
            })
            .catch(e => {
                // whenever it's should redirect to home
                navigate(`/`)
            })

        batch(() => {
            dispatch(app_setSkills([]))
            dispatch(app_setDailyXP(0))
            dispatch(app_setTotalXP(0))
        })
    }

    const onClickSidebarItem = (e, name) => {
        e.preventDefault()
        switch (name) {
            case 'home':
                navigate('/home')
                break
            case 'login':
                dispatch(auth_setOpenModalLogin(true))
                break
            case 'register':
                dispatch(auth_setOpenModalRegister(true))
                break
            case 'logout':
                handleLogOut()
                break
            default:
                // do nothing
                break
        }
    }

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: '/server/login',
        }).then(function (response) {
            if (response.data.redirect == '/login') {
                // console.log("Please log in");
                dispatch(auth_setNewUser(true))
                // navigate(`/auth/login`);
            } else if (response.data.redirect == '/updateemail') {
                navigate('/updateemail')
            } else {
                // console.log("Already logged in");
                role.current = response.data.user.role
                // setUser(response.data.user)
                setUserName(
                    response.data.user.displayName
                        ? response.data.user.displayName?.split(' ')[0]
                        : response.data.user.email
                )
            }
        })
    }, [])

    const handleProfilePictureUpload = event => {
        const file = event.target.files[0]
        // Perform necessary actions with the uploaded file
        // For example, you can upload the file to a server or store it in the state
        const formData = new FormData()
        formData.append('photo', file)

        Axios({
            method: 'POST',
            data: formData,
            withCredentials: true,
            url: '/server/updateProfilePhoto',
        })
            .then(function (response) {
                setProfilePicture(response.data.imageUrl)
            })
            .catch(error => {
                console.error('Error uploading file:', error)
            })
    }

    return (
        <div className='FingoSidebar'>
            <div className='FingoSidebarInner'>
                <MDBNavbarBrand onClick={() => navigate(`/home`)}>
                    <img
                        className='FingoSidebarLogo'
                        src={FingoLogo}
                        alt='fingo logo'
                    />
                </MDBNavbarBrand>

                <div className='FingoSidebarUserInfo'>
                    <div className='d-flex align-items-center p-3'>
                        <div className='profile-picture'>
                            <label htmlFor='profile-picture-upload'>
                                {newUser ? (
                                    <img
                                        src={nonSignedUp}
                                        alt='Profile'
                                        className='rounded-circle'
                                    />
                                ) : user?.imgPath ? (
                                    <img
                                        src={user.imgPath}
                                        alt='Profile'
                                        className='rounded-circle'
                                    />
                                ) : (
                                    <img
                                        src={signedUp}
                                        alt='Profile'
                                        className='rounded-circle'
                                    />
                                )}
                            </label>
                            <input
                                id='profile-picture-upload'
                                type='file'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={handleProfilePictureUpload}
                                disabled={newUser}
                            />
                        </div>
                        <div className='user-info ml-3'>
                            <h4 className='user-name'>
                                Hey, {newUser ? 'Stranger' : userName}!
                                <span
                                    style={{
                                        display: 'inline-block',
                                        animation: 'wave-animation 3s infinite',
                                        transformOrigin: '70% 100%',
                                    }}
                                >
                                    👋
                                </span>
                            </h4>
                        </div>
                    </div>
                </div>

                <ul>
                    <li>
                        <a
                            href='#'
                            className='FingoShapeRadius active'
                            onClick={e => onClickSidebarItem(e, 'home')}
                        >
                            <div className='icon'>
                                <img src={IcHome} alt='home icon' />
                            </div>
                            <span>Learn</span>
                        </a>
                    </li>
                    {newUser && (
                        <>
                            <li>
                                <a
                                    href='#'
                                    className='FingoShapeRadius'
                                    onClick={e =>
                                        onClickSidebarItem(e, 'login')
                                    }
                                >
                                    <div className='icon'>
                                        <EnterIcon />
                                    </div>
                                    <span>Login</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='FingoShapeRadius'
                                    onClick={e =>
                                        onClickSidebarItem(e, 'register')
                                    }
                                >
                                    <div className='icon'>
                                        <SignUpIcon />
                                    </div>
                                    <span>Register</span>
                                </a>
                            </li>
                        </>
                    )}
                    <li>
                        <a
                            href='#'
                            className='FingoShapeRadius'
                            onClick={e => onClickSidebarItem(e, 'logout')}
                        >
                            <div className='icon'>
                                <LogoutIcon />
                            </div>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
                <div className='FingoSidebarSwitchContainer'>
                    <FingoSwitchTheme />
                </div>
            </div>
        </div>
    )
}

export default FingoSidebar
