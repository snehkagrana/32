/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import { useNavigate } from 'react-router-dom'
import 'src/styles/FingoMobileMenu.styles.css'
import { MDBNavbarBrand } from 'mdb-react-ui-kit'

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
import { authUtils } from 'src/utils'

const FingoMobileMenu = ({ open }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        auth_setOpenModalLogin,
        auth_setOpenModalRegister,
        isAuthenticated,
        auth_logout,
    } = useAuth()

    const {
        app_setSkills,
        app_setDailyXP,
        app_setTotalXP,
        app_setOpenSidebar,
    } = useApp()

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
                dispatch(auth_logout()).then(result => {
                    authUtils.removeUserAccessToken()
                    if (result) {
                        batch(() => {
                            dispatch(app_setSkills([]))
                            dispatch(app_setDailyXP(0))
                            dispatch(app_setTotalXP(0))
                        })
                        setTimeout(() => {
                            navigate('/home')
                        }, 500)
                    }
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

    const onClickBackdrop = () => {
        dispatch(app_setOpenSidebar(false))
    }

    return (
        <>
            <div className={`FingoMobileMenu FingoShapeRadius`}>
                <div className='FingoMobileMenuInner'>
                    <MDBNavbarBrand onClick={() => navigate(`/home`)}>
                        <img
                            className='FingoMobileMenuLogo'
                            src={FingoLogo}
                            alt='fingo logo'
                        />
                    </MDBNavbarBrand>

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
                        {!isAuthenticated && (
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
                        {isAuthenticated && (
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
                    </ul>
                    <div className='FingoMobileMenuSwitchContainer'>
                        <FingoSwitchTheme />
                    </div>
                </div>
            </div>
            {open && <div className='backdrop' onClick={onClickBackdrop} />}
        </>
    )
}

export default FingoMobileMenu