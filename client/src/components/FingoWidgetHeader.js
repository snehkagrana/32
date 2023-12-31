/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useState } from 'react'
import { useAuth, useMediaQuery, usePersistedGuest } from 'src/hooks'
import BananaIconSVG from 'src/assets/svg/banana-icon.svg'
import DiamondIconSVG from 'src/assets/svg/diamond.svg'
import StreakIcon from 'src/assets/images/fire-on.png'
import HeartIconSVG from 'src/assets/svg/heart.svg'
import UnlimitedHeartIcon from 'src/assets/images/unlimited-hearts.png'
import HeartFadedIconSVG from 'src/assets/svg/heart-faded.svg'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import FingoCardGiftbox from './FingoCardGiftbox'
import 'src/styles/FingoWidgetHeader.styles.css'
import { HeartCard } from './hearts'
import { Popover } from './core'
import dayjs from 'dayjs'

const MENU_ITEMS = [
    {
        icon: StreakIcon,
        disabledIcon: StreakIcon,
        name: 'streak',
        color: '#ff9600',
        iconHeight: 24,
    },
    {
        icon: BananaIconSVG,
        disabledIcon: BananaIconSVG,
        name: 'total_xp',
        color: '#c89600',
        iconHeight: 22,
    },
    {
        icon: DiamondIconSVG,
        disabledIcon: DiamondIconSVG,
        name: 'diamond',
        color: '#1cb0f6',
        iconHeight: 26,
    },
    {
        icon: HeartIconSVG,
        disabledIcon: HeartFadedIconSVG,
        name: 'heart',
        color: '#ff4b4b',
        iconHeight: 18,
    },
    // ...another menu menu tab
]

const initialShowState = {
    streak: false,
    total_xp: false,
    diamond: false,
    heart: false,
}

const FingoWidgetHeader = () => {
    const today = new Date()
    const { user, isAuthenticated } = useAuth()
    const { guestState } = usePersistedGuest()
    const [show, setShow] = useState(initialShowState)
    const matchMobile = useMediaQuery('(max-width: 570px)')

    const onClickItem = (e, name) => {
        setShow({
            ...initialShowState,
            [name]: !show[name],
        })
        if (e) {
            e.preventDefault()
        }
    }

    const onMouseLeave = () => {
        setShow(initialShowState)
    }

    const getTabLabel = name => {
        switch (name) {
            case 'streak':
                return user?.streak ? String(user.streak) ?? '0' : undefined

            case 'total_xp':
                return user?.xp?.total
                    ? String(user.xp.total) ?? '0'
                    : undefined

            case 'diamond':
                return user?.diamond !== undefined
                    ? String(user.diamond) ?? '0'
                    : undefined

            // prettier-ignore
            case 'heart':
                if (isAuthenticated && user?.unlimitedHeart && dayjs(user.unlimitedHeart).isAfter(dayjs(today).toISOString(), 'minute')) {
                    return undefined 
                }
                else if (isAuthenticated && user) {
                    return user?.heart || 0
                } else {
                    return guestState?.heart || 0
                }
            // return user?.heart !== undefined
            //     ? String(user.heart) ?? '0'
            //     : undefined

            default:
                return undefined
        }
    }

    const getContent = paramsName => {
        if (paramsName === 'streak') return <FingoCardDayStreak />
        else if (paramsName === 'total_xp') return <FingoCardTotalXP />
        else if (paramsName === 'diamond') return <FingoCardGiftbox />
        else if (paramsName === 'heart') return <HeartCard />
    }

    const getIcon = (icon, disabledIcon, name) => {
        if (name === 'heart') {
            // prettier-ignore
            if (isAuthenticated && user?.unlimitedHeart && dayjs(user.unlimitedHeart).isAfter(dayjs(today).toISOString(), 'minute')) {
                return UnlimitedHeartIcon 
            }
            else if ((isAuthenticated && user?.heart === 0) || guestState?.heart === 0) {
                return disabledIcon
            } else {
                return icon
            }
        } else {
            return icon
        }
    }

    const getLabelColor = (name, color) => {
        if (name === 'heart') {
            if (
                (isAuthenticated && user?.heart === 0) ||
                guestState?.heart === 0
            ) {
                return undefined
            } else {
                return color
            }
        } else {
            return color
        }
    }

    // prettier-ignore
    const renderBadge = useCallback(menuName => {
        if (isAuthenticated && user?.unlimitedHeart && dayjs(user.unlimitedHeart).isAfter(dayjs(today).toISOString(), 'minute')) {
            return undefined 
        }
        if ((menuName === 'heart' && isAuthenticated && user?.heart === 0) || guestState?.heart === 0) {
            return <div className='FingoWidgetHeaderBadge'></div>
        }
        return null
    }, [guestState?.heart, isAuthenticated, user?.heart])

    return (
        <div id='FingoWidgetHeaderRoot'>
            <div className='FingoWidgetHeader'>
                <div className='FingoWidgetHeaderInner'>
                    <ul>
                        {MENU_ITEMS.map((i, index) => {
                            if (matchMobile || i.name === 'heart') {
                                return (
                                    <li key={String(index) + i.name}>
                                        <Popover
                                            isOpen={show[i.name]}
                                            positions={['bottom', 'right']}
                                            align='center'
                                            padding={matchMobile ? 5 : 0}
                                            reposition={true}
                                            onClickOutside={() =>
                                                setShow(initialShowState)
                                            }
                                            renderContent={getContent(i.name)}
                                        >
                                            <a
                                                href='#'
                                                onMouseEnter={() =>
                                                    onClickItem(
                                                        undefined,
                                                        i.name
                                                    )
                                                }
                                                // onMouseLeave={() =>
                                                //     onMouseLeave(i.name)
                                                // }
                                                onClick={e =>
                                                    onClickItem(e, i.name)
                                                }
                                            >
                                                <img
                                                    style={{
                                                        height: i.iconHeight,
                                                    }}
                                                    src={getIcon(
                                                        i.icon,
                                                        i.disabledIcon,
                                                        i.name
                                                    )}
                                                    alt='icon'
                                                />
                                                {getTabLabel(i.name) !==
                                                    undefined && (
                                                    <span
                                                        style={{
                                                            color: getLabelColor(
                                                                i.name,
                                                                i.color
                                                            ),
                                                        }}
                                                    >
                                                        {getTabLabel(i.name)}
                                                    </span>
                                                )}
                                                {renderBadge(i.name)}
                                            </a>
                                        </Popover>
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={String(index) + i.name}>
                                        <a
                                            href='#'
                                            onClick={e =>
                                                onClickItem(e, i.name)
                                            }
                                        >
                                            <img
                                                style={{
                                                    height: i.iconHeight,
                                                }}
                                                src={getIcon(
                                                    i.icon,
                                                    i.disabledIcon,
                                                    i.name
                                                )}
                                                alt='icon'
                                            />
                                            {getTabLabel(i.name) !==
                                                undefined && (
                                                <span
                                                    style={{
                                                        color: getLabelColor(
                                                            i.name,
                                                            i.color
                                                        ),
                                                    }}
                                                >
                                                    {getTabLabel(i.name)}
                                                </span>
                                            )}
                                            {renderBadge(i.name)}
                                        </a>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FingoWidgetHeader
