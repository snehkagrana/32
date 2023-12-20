/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom'
import 'src/styles/FingoFooter.styles.css'

import SidebarBtn from 'src/assets/images/sidebar-trigger-btn.png'
import IcHome from 'src/assets/images/ic_home.png'
import IcTreasure from 'src/assets/images/ic_treasure.png'
import IcUser from 'src/assets/images/ic_user.png'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useApp, useAuth, useMediaQuery } from 'src/hooks'
import { Overlay, Popover } from 'react-bootstrap'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoUserInfo from './FingoUserInfo'
import signedUp from 'src/images/pepe.jpg'
import { getLevelColor } from 'src/utils'
import FingoMobileMenu from './FingoMobileMenu'

const FOOTER_ITEMS = [
    {
        icon: SidebarBtn,
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
    const { user, isAuthenticated } = useAuth()
    const { openSidebar } = useApp()
    const matchMobile = useMediaQuery('(max-width: 570px)')
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const ref = useRef(null)
    const [activeTab, setActiveTab] = useState('')

    const onClickMenu = (e, name) => {
        e.preventDefault()
        if (name === 'home') {
            navigate('/home')
            setShow(false)
            setTarget(null)
        } else {
            setShow(name === activeTab ? false : true)
            setTarget(e.target)
            setActiveTab(name === activeTab ? '' : name)
        }
    }

    const renderBadge = useCallback(
        menuName => {
            if (menuName === 'daily-quest' && user?.xp?.daily >= 60) {
                return <div className='FingoFooterBadge'></div>
            }
            return null
        },
        [user]
    )

    const getAvatarUrl = useMemo(() => {
        return user?.imgPath ? user.imgPath : signedUp
    }, [user])

    return (
        <div id='FingoFooterRoot' ref={ref}>
            <div className='FingoFooter'>
                <div className='FingoFooterInner'>
                    <ul>
                        {FOOTER_ITEMS.map((i, index) => {
                            if (i.name === 'profile' && isAuthenticated) {
                                return (
                                    <li key={String(index)}>
                                        <div
                                            className='FooterProfileBtn'
                                            onClick={e =>
                                                onClickMenu(e, i.name)
                                            }
                                        >
                                            <div className='FooterProfileWrapper'>
                                                <img
                                                    src={getAvatarUrl}
                                                    alt='Avatar img'
                                                />
                                            </div>
                                            <div
                                                className='FooterUserLevel'
                                                style={{
                                                    backgroundColor:
                                                        getLevelColor(
                                                            'default',
                                                            user?.xp?.level
                                                        ),
                                                }}
                                            >
                                                Lvl {user?.xp?.level ?? 1}
                                            </div>
                                        </div>
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={String(index)}>
                                        <a
                                            href='#'
                                            className={`FingoShapeRadius relative`}
                                            onClick={e =>
                                                onClickMenu(e, i.name)
                                            }
                                        >
                                            {renderBadge(i.name)}
                                            <img
                                                src={i.icon}
                                                alt='footer icon'
                                            />
                                        </a>
                                    </li>
                                )
                            }
                        })}
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
                    <Popover>
                        {activeTab === 'menu' && <FingoMobileMenu />}
                        {activeTab === 'daily-quest' && <FingoCardDailyXP />}
                        {activeTab === 'profile' && <FingoUserInfo />}
                    </Popover>
                </Overlay>
            )}
        </div>
    )
}

export default FingoFooter
