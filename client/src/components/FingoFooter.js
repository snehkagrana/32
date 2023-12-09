/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom'
import 'src/styles/FingoFooter.styles.css'

import { useDispatch } from 'react-redux'

import IcHome from 'src/assets/images/ic_home.png'
// import IcTraining from 'src/assets/images/ic_training.png'
// import IcGuard from 'src/assets/images/ic_guard.png'
import IcTreasure from 'src/assets/images/ic_treasure.png'
// import IcStore from 'src/assets/images/ic_store.png'
import IcUser from 'src/assets/images/ic_user.png'

const FOOTER_ITEMS = [
    {
        icon: IcHome,
        name: 'home',
    },
    // {
    //     icon: IcTraining,
    //     name: '',
    // },
    // {
    //     icon: IcGuard,
    //     name: '',
    // },
    {
        icon: IcTreasure,
        name: 'daily quest',
    },
    // {
    //     icon: IcStore,
    //     name: '',
    // },
    {
        icon: IcUser,
        name: 'profile',
    },
]

const FingoFooter = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClickMenu = (e, name) => {
        e.preventDefault()
        switch (name) {
            case 'home':
                navigate('/home')
                break
            case 'profile':
                navigate('/profile')
                break
            case 'daily quest':
                navigate('/daily-quest')
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
                                onClick={e => onClickMenu(e, i.name)}
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
