/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { useAuth, useMediaQuery } from 'src/hooks'
import BananaIconSVG from 'src/assets/svg/banana-icon.svg'
import DiamondIconSVG from 'src/assets/svg/diamond.svg'
import StreakIcon from 'src/assets/images/fire-on.png'
import HeartIconSVG from 'src/assets/svg/heart.svg'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import FingoCardGiftbox from './FingoCardGiftbox'
import 'src/styles/FingoWidgetHeader.styles.css'
import { HeartCard } from './hearts'
import { Popover } from './core'

const MENU_ITEMS = [
    {
        icon: StreakIcon,
        name: 'streak',
        color: '#ff9600',
        iconHeight: 24,
    },
    {
        icon: BananaIconSVG,
        name: 'total_xp',
        color: '#c89600',
        iconHeight: 22,
    },
    {
        icon: DiamondIconSVG,
        name: 'diamond',
        color: '#1cb0f6',
        iconHeight: 26,
    },
    {
        icon: HeartIconSVG,
        name: 'heart',
        color: '#ff4b4b',
        iconHeight: 18,
    },
    // ...another menu menu tab
]

console.log('MENU_ITEMS', Object.keys(MENU_ITEMS))

const initialShowState = {
    streak: false,
    total_xp: false,
    diamond: false,
    heart: false,
}

const FingoWidgetHeader = () => {
    const { user } = useAuth()
    const [show, setShow] = useState(initialShowState)
    const matchMobile = useMediaQuery('(max-width: 570px)')

    const onClickItem = (e, name) => {
        setShow({
            ...initialShowState,
            [name]: !show[name],
        })
        e.preventDefault()
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

            case 'heart':
                return user?.heart !== undefined
                    ? String(user.heart) ?? '0'
                    : undefined

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

    return (
        <div id='FingoWidgetHeaderRoot'>
            <div className='FingoWidgetHeader'>
                <div className='FingoWidgetHeaderInner'>
                    <ul>
                        {MENU_ITEMS.map((i, index) => {
                            if (matchMobile) {
                                return (
                                    <li key={String(index)}>
                                        <Popover
                                            isOpen={show[i.name]}
                                            positions={['bottom', 'right']}
                                            align='center'
                                            padding={5}
                                            reposition={true}
                                            onClickOutside={() =>
                                                setShow(initialShowState)
                                            }
                                            renderContent={getContent(i.name)}
                                        >
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
                                                    src={i.icon}
                                                    alt='icon'
                                                />
                                                {getTabLabel(i.name) && (
                                                    <span
                                                        style={{
                                                            color: i.color,
                                                        }}
                                                    >
                                                        {getTabLabel(i.name)}
                                                    </span>
                                                )}
                                            </a>
                                        </Popover>
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={String(index)}>
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
                                                src={i.icon}
                                                alt='icon'
                                            />
                                            {getTabLabel(i.name) && (
                                                <span
                                                    style={{
                                                        color: i.color,
                                                    }}
                                                >
                                                    {getTabLabel(i.name)}
                                                </span>
                                            )}
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
