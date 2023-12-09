/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAuth, useMediaQuery } from 'src/hooks'

import JewelsIcon from 'src/assets/images/jewels.png'
// import HeartIcon from 'src/assets/images/heart.png'
import StreakIcon from 'src/assets/images/fire-on.png'
import { Overlay, Popover } from 'react-bootstrap'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import { useRef, useState } from 'react'
import 'src/styles/FingoWidgetHeader.styles.css'

const MENU_ITEMS = [
    {
        icon: StreakIcon,
        name: 'streak',
        color: '#ff9600',
    },
    {
        icon: JewelsIcon,
        name: 'total_xp',
        color: '#1cb0f6',
    },
    // {
    //     icon: HeartIcon,
    //     name: 'heart',
    //     color: '#ef5350',
    // },
]

const FingoWidgetHeader = ({ activeTab, setActiveTab }) => {
    const { user } = useAuth()
    const [show, setShow] = useState(false)
    const matchMobile = useMediaQuery('(max-width: 570px)')
    const [target, setTarget] = useState(null)
    const ref = useRef(null)

    const onClickItem = (e, name) => {
        e.preventDefault()
        setShow(name === activeTab ? false : true)
        setTarget(e.target)
        setActiveTab(name === activeTab ? '' : name)
    }

    const getTabLabel = name => {
        switch (name) {
            case 'streak':
                return user?.streak ? String(user.streak) ?? '0' : undefined

            case 'total_xp':
                return user?.xp?.total
                    ? String(user.xp.total) ?? '0'
                    : undefined

            default:
                return undefined
        }
    }

    return (
        <div id='FingoWidgetHeaderRoot' ref={ref}>
            <div className='FingoWidgetHeader' ref={ref}>
                <div className='FingoWidgetHeaderInner'>
                    <ul>
                        {MENU_ITEMS.map((i, index) => (
                            <li key={String(index)}>
                                <a
                                    href='#'
                                    onClick={e => onClickItem(e, i.name)}
                                    className={
                                        activeTab === i.name ? 'active' : ''
                                    }
                                >
                                    <img src={i.icon} alt='footer icon' />
                                    {getTabLabel(i.name) && (
                                        <span style={{ color: i.color }}>
                                            {getTabLabel(i.name)}
                                        </span>
                                    )}
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
                    placement='bottom'
                    container={ref}
                    containerPadding={0}
                    className='FingoPopover'
                >
                    <Popover id='popover-contained'>
                        {activeTab === 'streak' && <FingoCardDayStreak />}
                        {activeTab === 'total_xp' && <FingoCardTotalXP />}
                    </Popover>
                </Overlay>
            )}
        </div>
    )
}

export default FingoWidgetHeader
