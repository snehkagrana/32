/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAuth, useMediaQuery, usePersistedGuest } from 'src/hooks'

import HeartIconSVG from 'src/assets/svg/heart.svg'
import { useState } from 'react'
import { ArrowContainer, Popover } from 'react-tiny-popover'
import 'src/styles/QuizPageHeader.styles.css'

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
    const [show, setShow] = useState(false)
    const { isAuthenticated, user } = useAuth()
    const { guestState } = usePersistedGuest()

    const onClickItem = (e, name) => {
        setShow(!show)
        e.preventDefault()
        // setShow(name === activeTab ? false : true)
    }

    const getTabLabel = name => {
        if (isAuthenticated) {
            switch (name) {
                case 'heart':
                    return user?.heart !== undefined
                        ? String(user.heart) ?? '0'
                        : undefined

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

    return (
        <div id='QuizPageHeaderRoot'>
            <div className='QuizPageHeader'>
                <div className='QuizPageHeaderInner'>
                    <ul>
                        {MENU_ITEMS.map((i, index) => (
                            <li key={String(index)}>
                                <Popover
                                    isOpen={show}
                                    positions={['bottom', 'left']}
                                    // align='center'
                                    padding={10}
                                    reposition={false}
                                    onClickOutside={() => setShow(false)}
                                    content={({
                                        position,
                                        childRect,
                                        popoverRect,
                                    }) => (
                                        <ArrowContainer
                                            position={position}
                                            childRect={childRect}
                                            popoverRect={popoverRect}
                                            arrowColor={'blue'}
                                            arrowSize={10}
                                            arrowStyle={{ opacity: 0.7 }}
                                            className='popover-arrow-container'
                                            arrowClassName='popover-arrow'
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: 'blue',
                                                    opacity: 0.7,
                                                }}
                                                onClick={() => setShow(!show)}
                                            >
                                                Hi! I'm popover content. Here's
                                                my position: {position}.
                                            </div>
                                        </ArrowContainer>
                                    )}
                                >
                                    <a
                                        href='#'
                                        onClick={e => onClickItem(e, i.name)}
                                    >
                                        <img
                                            style={{ height: i.iconHeight }}
                                            src={i.icon}
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
