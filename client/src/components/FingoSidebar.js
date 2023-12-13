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

import Swal from 'sweetalert2'
import FingoUserInfo from './FingoUserInfo'

const FingoSidebar = ({ open }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        auth_setOpenModalLogin,
        auth_setOpenModalRegister,
        user,
        newUser,
        auth_setNewUser,
        auth_setUser,
    } = useAuth()

    const {
        app_setSkills,
        app_setDailyXP,
        app_setTotalXP,
        app_setOpenSidebar,
    } = useApp()
    const role = useRef('')
    const [userName, setUserName] = useState(null)

    const handleLogOut = () => {
        Swal.fire({
            title: 'Are you sure want to logout ?',
            text: undefined,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then(result => {
            if (result.isConfirmed) {
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
                    dispatch(auth_setUser(null))
                    dispatch(auth_setNewUser(null))
                })
            }
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

    const onClickBackdrop = () => {
        dispatch(app_setOpenSidebar(false))
    }

    return (
        <>
            <div className={`FingoSidebar ${open ? 'visible' : ''}`}>
                <div className='FingoSidebarInner'>
                    <MDBNavbarBrand onClick={() => navigate(`/home`)}>
                        <img
                            className='FingoSidebarLogo'
                            src={FingoLogo}
                            alt='fingo logo'
                        />
                    </MDBNavbarBrand>

                    <FingoUserInfo />

                    <ul>
                        <li>
                            <a
                                href='#'
                                className='FingoShapeRadius'
                                onClick={e => onClickSidebarItem(e, 'home')}
                            >
                                <div className='icon'>
                                    <img src={IcHome} alt='home icon' />
                                </div>
                                <span>Home</span>
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
                        {!newUser && (
                            <li>
                                <a
                                    href='#'
                                    className='FingoShapeRadius'
                                    onClick={e =>
                                        onClickSidebarItem(e, 'logout')
                                    }
                                >
                                    <div className='icon'>
                                        <LogoutIcon />
                                    </div>
                                    <span>Logout</span>
                                </a>
                            </li>
                        )}
                        {user && user?.role === 'admin' && (
                            <>
                                <li>
                                    <a
                                        href='#'
                                        className='FingoShapeRadius'
                                        onClick={() => navigate(`/addchapters`)}
                                    >
                                        <div className='icon'></div>
                                        <span> Add Chapters</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='FingoShapeRadius'
                                        onClick={() =>
                                            navigate(`/addinformation`)
                                        }
                                    >
                                        <div className='icon'></div>
                                        <span> Add Information</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='FingoShapeRadius'
                                        onClick={() =>
                                            navigate(`/addquestions`)
                                        }
                                    >
                                        <div className='icon'></div>
                                        <span> Add Questions</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='FingoShapeRadius'
                                        onClick={() => navigate(`/allskills`)}
                                    >
                                        <div className='icon'></div>
                                        <span> Edit/Delete</span>
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className='FingoSidebarSwitchContainer'>
                        <FingoSwitchTheme />
                    </div>
                </div>
            </div>
            {open && <div className='backdrop' onClick={onClickBackdrop} />}
        </>
    )
}

export default FingoSidebar
