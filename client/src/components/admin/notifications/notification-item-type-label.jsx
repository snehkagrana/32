import { useCallback, useMemo } from 'react'
import { NOTIFICATION_TYPE_LIST } from 'src/constants/notification.constant'
import styled from 'styled-components'

const NotificationItemTypeLabel = ({ type, isSelected, onClick }) => {
    const onClickItem = useCallback(() => {
        if (typeof onClick === 'function') {
            onClick(type)
        }
    }, [onClick, type])

    const onClickRemove = useCallback(() => {}, [])

    const isClickAble = useMemo(() => {
        return typeof onClick === 'function'
    }, [onClick])

    const getNotificationTypeName = useMemo(() => {
        return (
            NOTIFICATION_TYPE_LIST.find(x => x.value === type)?.name ||
            NOTIFICATION_TYPE_LIST[0].name
        )
    }, [type])

    return (
        <LabelRoot
            onClick={onClickItem}
            style={{
                ...(type === 'heart_refill' && {
                    backgroundColor: '#ff0b38',
                }),
                ...(type === 'friends_follow' && {
                    backgroundColor: '#eb12ff',
                }),
                ...(type === 'common' && {
                    backgroundColor: '#58cc02',
                }),
                ...(type === 'streak' && {
                    backgroundColor: '#ff6200',
                }),
                ...(type === 'reminder' && {
                    backgroundColor: '#ff1717',
                }),
                ...(type === 'leaderboard' && {
                    backgroundColor: '#3492fc',
                }),

                ...(type === 'heart_refill' &&
                    isSelected && {
                        borderColor: '#d40027',
                    }),
                ...(type === 'friends_follow' &&
                    isSelected && {
                        borderColor: '#cb00dd',
                    }),
                ...(type === 'common' &&
                    isSelected && {
                        borderColor: '#0b1404',
                    }),
                ...(type === 'streak' &&
                    isSelected && {
                        borderColor: '#c34b00',
                    }),
                ...(type === 'reminder' &&
                    isSelected && {
                        borderColor: '#cb0000',
                    }),
                ...(type === 'leaderboard' &&
                    isSelected && {
                        borderColor: '#0063d4',
                    }),

                ...(isClickAble &&
                    !isSelected && {
                        opacity: 0.4,
                    }),
            }}
        >
            <LabelText>{getNotificationTypeName}</LabelText>
            {isSelected && (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                >
                    <path
                        fill='currentColor'
                        d='m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z'
                    ></path>
                </svg>
            )}
        </LabelRoot>
    )
}

const LabelRoot = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 0.4rem;
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    position: relative;
    border-color: transparent;
    svg {
        font-size: 22px;
        color: #ffffff;
        margin-left: 0.5rem;
    }
`

const LabelText = styled.p`
    margin-left: 0.8rem;
    color: #fff;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 0.9rem;
`

export default NotificationItemTypeLabel
