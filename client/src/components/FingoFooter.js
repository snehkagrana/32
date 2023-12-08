/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import 'src/styles/FingoFooter.styles.css'

import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks'

import IcHome from 'src/assets/images/ic_home.png'
import IcTraining from 'src/assets/images/ic_training.png'
import IcGuard from 'src/assets/images/ic_guard.png'
import IcTreasure from 'src/assets/images/ic_treasure.png'
import IcStore from 'src/assets/images/ic_store.png'
import IcUser from 'src/assets/images/ic_user.png'

const FOOTER_ITEMS = [
    {
        icon: IcHome,
        path: 'home',
    },
    {
        icon: IcTraining,
        path: '',
    },
    {
        icon: IcGuard,
        path: '',
    },
    {
        icon: IcTreasure,
        path: '',
    },
    {
        icon: IcStore,
        path: '',
    },
    {
        icon: IcUser,
        path: '',
    },
]

const FingoFooter = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth_setOpenModalLogin, auth_setOpenModalRegister } = useAuth()
    const role = useRef('')

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
                // do nothing
                break
            default:
                // do nothing
                break
        }
    }

    return (
        <div className='FingoFooter'>
            <div className='FingoFooterInner'>
                <ul>
                    {FOOTER_ITEMS.map((i, index) => (
                        <li key={String(index)}>
                            <a
                                href='#'
                                className='FingoShapeRadius'
                                onClick={e => onClickSidebarItem(e, i.path)}
                            >
                                <img src={i.icon} alt='footer icon' />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FingoFooter
