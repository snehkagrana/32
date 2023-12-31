/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAuth, usePersistedGuest } from 'src/hooks'

import HeartIconSVG from 'src/assets/svg/heart.svg'
import UnlimitedHeartIcon from 'src/assets/images/unlimited-hearts.png'
import { useState } from 'react'
import { HeartCard } from '../hearts'
import { Popover } from 'src/components/core'
import 'src/styles/QuizPageHeader.styles.css'
import dayjs from 'dayjs'

const MENU_ITEMS = [
    {
        icon: HeartIconSVG,
        name: 'heart',
        color: '#ff4b4b',
        iconHeight: 18,
    },
    // ...another menu menu tab
]

const QuizPageHeader = () => {
    const today = new Date()
    const [show, setShow] = useState(false)
    const { isAuthenticated, user } = useAuth()
    const { guestState } = usePersistedGuest()

    const onClickItem = (e, name) => {
        setShow(!show)
        e.preventDefault()
    }

    const getTabLabel = name => {
        if (isAuthenticated) {
            switch (name) {
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

                default:
                    return undefined
            }
        } else {
            switch (name) {
                case 'heart':
                    return guestState?.heart !== undefined
                        ? String(guestState.heart) ?? '0'
                        : undefined

                default:
                    return undefined
            }
        }
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

    return (
        <div id='QuizPageHeaderRoot'>
            <div className='QuizPageHeader'>
                <div className='QuizPageHeaderInner'>
                    <ul>
                        {MENU_ITEMS.map((i, index) => (
                            <li key={String(index)}>
                                <Popover
                                    isOpen={show}
                                    positions={['bottom', 'right']}
                                    align='center'
                                    padding={0}
                                    reposition={true}
                                    onClickOutside={() => setShow(false)}
                                    renderContent={<HeartCard />}
                                >
                                    <a
                                        href='#'
                                        onClick={e => onClickItem(e, i.name)}
                                    >
                                        <img
                                            style={{ height: i.iconHeight }}
                                            src={getIcon(
                                                i.icon,
                                                i.disabledIcon,
                                                i.name
                                            )}
                                            alt='icon'
                                        />
                                        {getTabLabel(i.name) && (
                                            <span style={{ color: i.color }}>
                                                {getTabLabel(i.name)}
                                            </span>
                                        )}
                                    </a>
                                </Popover>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default QuizPageHeader
