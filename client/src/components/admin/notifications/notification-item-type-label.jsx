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
                        borderColor: '#49a900',
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
            }}
        >
            <LabelText>{getNotificationTypeName}</LabelText>
            {isClickAble && (
                <svg width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                        fill='currentColor'
                        d='M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z'
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
    border-radius: 1rem;
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    position: relative;
    border-width: 1.4px;
    border-color: transparent;
`

const LabelText = styled.p`
    margin-left: 0.8rem;
    color: '#fff';
    margin-bottom: 0;
`

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 30px;
    width: 30px;
    background-color: transparent;
    border: 1px solid #ff2c2c;
    border-radius: 30px;
    padding: 0;
    margin-left: 0.5rem;
    position: absolute;
    top: 0;
    right: 0;
    svg {
        font-size: 22px;
        color: #ff0000;
    }
`

export default NotificationItemTypeLabel
