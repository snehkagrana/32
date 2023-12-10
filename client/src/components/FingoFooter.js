/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom'
import 'src/styles/FingoFooter.styles.css'

import MenuIcon from 'src/assets/images/10110130.png'
import IcHome from 'src/assets/images/ic_home.png'
import IcTreasure from 'src/assets/images/ic_treasure.png'
import IcUser from 'src/assets/images/ic_user.png'
import { useRef, useState } from 'react'
import { useApp, useMediaQuery } from 'src/hooks'
import { Overlay, Popover } from 'react-bootstrap'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoUserInfo from './FingoUserInfo'
import { useDispatch } from 'react-redux'
import FingoSidebar from './FingoSidebar'

const FOOTER_ITEMS = [
    {
        icon: MenuIcon,
        name: 'menu',
    },
    {
        icon: IcHome,
        name: 'home',
    },
    {
        icon: IcTreasure,
        name: 'daily-quest',
    },
    {
        icon: IcUser,
        name: 'profile',
    },
]

const FingoFooter = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { openSidebar, app_setOpenSidebar } = useApp()
    const matchMobile = useMediaQuery('(max-width: 570px)')
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const ref = useRef(null)
    const [activeTab, setActiveTab] = useState('')

    // const [openSidebar, setOpenSidebar] = useState(false)

    const onClickMenu = (e, name) => {
        e.preventDefault()
        if (name === 'home') {
            navigate('/home')
            setShow(false)
            setTarget(null)
        } else if (name === 'menu') {
            setShow(false)
            setTarget(null)
            dispatch(app_setOpenSidebar(!openSidebar))
        } else {
            setShow(name === activeTab ? false : true)
            setTarget(e.target)
            setActiveTab(name === activeTab ? '' : name)
        }
    }

    return (
        <div id='FingoFooterRoot' ref={ref}>
            <div className='FingoFooter'>
                <div className='FingoFooterInner'>
                    <ul>
                        {FOOTER_ITEMS.map((i, index) => (
                            <li key={String(index)}>
                                <a
                                    href='#'
                                    className={`FingoShapeRadius`}
                                    onClick={e => onClickMenu(e, i.name)}
                                >
                                    <img src={i.icon} alt='footer icon' />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {matchMobile && (
                <Overlay
                    show={show}
                    target={target}
                    placement='top'
                    container={ref}
                    containerPadding={0}
                    className='FingoPopover'
                >
                    <Popover id='popover-contained'>
                        {activeTab === 'daily-quest' && <FingoCardDailyXP />}
                        {activeTab === 'profile' && <FingoUserInfo />}
                    </Popover>
                </Overlay>
            )}

            {matchMobile && <FingoSidebar open={openSidebar} />}
        </div>
    )
}

export default FingoFooter
