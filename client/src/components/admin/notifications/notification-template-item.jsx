import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { NotificationsAPI } from 'src/api'
import NotificationItemTypeLabel from './notification-item-type-label'
import toast from 'react-hot-toast'
import Assets from 'src/assets'
import { useDispatch } from 'react-redux'
import { useNotifications } from 'src/hooks'

const NotificationTemplateItem = ({ data, fetchData, onEdit }) => {
    const dispatch = useDispatch()

    const { notifications_setModalSendTemplate, modalSendTemplate } =
        useNotifications()
    const onClickItem = useCallback(() => {}, [])

    const onClickDelete = useCallback(async () => {
        try {
            // prettier-ignore
            const response = await NotificationsAPI.admin_deleteNotificationTemplate(data._id)
            if (response && typeof fetchData === 'function') {
                fetchData()
                toast.success('Notification template has been deleted.')
            }
        } catch (e) {}
    }, [data._id, fetchData])

    const onClickEdit = useCallback(async () => {
        if (typeof onEdit === 'function') {
            onEdit(data)
        }
    }, [data, onEdit])

    const onClickSend = useCallback(() => {
        dispatch(
            notifications_setModalSendTemplate({
                open: true,
                template: data,
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, modalSendTemplate, notifications_setModalSendTemplate])

    const isReadyOny = useMemo(() => {
        return typeof fetchData != 'function' && typeof onEdit !== 'function'
    }, [fetchData, onEdit])

    return (
        <CardTemplate onClick={onClickItem}>
            <TypeContainer>
                {data.type && (
                    <TypeAbsolute>
                        <NotificationItemTypeLabel type={data.type} />
                    </TypeAbsolute>
                )}
            </TypeContainer>
            <CardContainer>
                <NotificationImageWrapper>
                    <NotificationImage>
                        <img
                            src={data?.imageUrl || Assets.NoImg}
                            alt='placeholder'
                        />
                    </NotificationImage>
                </NotificationImageWrapper>
                <TemplateInfo>
                    <TitleText>{data.title}</TitleText>
                    <BodyText>{data.body}</BodyText>
                </TemplateInfo>
                {!isReadyOny && (
                    <ButtonContainer className='ButtonContainer'>
                        <EditButton onClick={onClickEdit} className='edit-btn'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 16 16'
                            >
                                <path
                                    fill='currentColor'
                                    d='M10.529 1.764a2.621 2.621 0 1 1 3.707 3.707l-.779.779L9.75 2.543zM9.043 3.25L2.657 9.636a2.96 2.96 0 0 0-.772 1.354l-.87 3.386a.5.5 0 0 0 .61.608l3.385-.869a2.95 2.95 0 0 0 1.354-.772l6.386-6.386z'
                                ></path>
                            </svg>
                        </EditButton>
                        <SendButton
                            onClick={onClickSend}
                            className='delete-btn'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z'
                                ></path>
                            </svg>
                        </SendButton>
                        <DeleteButton
                            onClick={onClickDelete}
                            className='delete-btn'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4'
                                ></path>
                            </svg>
                        </DeleteButton>
                    </ButtonContainer>
                )}
            </CardContainer>
        </CardTemplate>
    )
}

const CardTemplate = styled.div`
    width: 100%;
    border: 1px solid rgb(109 109 109 / 10%);
    border-radius: 0.4rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.6rem;
    position: relative;
    cursor: pointer;
    overflow: hidden;
`

const CardContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`

const TypeAbsolute = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
`

const TemplateInfo = styled.div`
    margin-left: 0.8rem;
`

const TitleText = styled.h4`
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    margin-right: 1rem;
`

const BodyText = styled.p`
    font-size: 0.8rem;
    margin-bottom: 0;
`

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    position: absolute;
    bottom: 10px;
    right: 7px;
`

const EditButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 32px;
    width: 32px;
    background-color: transparent;
    border: 1px solid #315eff;
    border-radius: 6px;
    padding: 0;
    svg {
        font-size: 18px;
        color: #315eff;
    }
    &:hover {
        background-color: #315eff;
        svg {
            color: #fff;
        }
    }
`

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 32px;
    width: 32px;
    background-color: transparent;
    border: 1px solid #ff2c2c;
    border-radius: 6px;
    padding: 0;
    margin-left: 0.5rem;
    svg {
        font-size: 20px;
        color: #ff0000;
    }
    &:hover {
        background-color: #ff0000;
        svg {
            color: #fff;
        }
    }
`

const SendButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 32px;
    width: 32px;
    background-color: transparent;
    border: 1px solid #00e15a;
    border-radius: 6px;
    padding: 0;
    margin-left: 0.5rem;
    svg {
        font-size: 20px;
        color: #00e15a;
    }
    &:hover {
        background-color: #00e15a;
        svg {
            color: #fff;
        }
    }
`

const TypeContainer = styled.div`
    width: 100px;
`

const NotificationImageWrapper = styled.div`
    position: relative;
    padding-top: 80px;
    width: 80px;
`

const NotificationImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    border-radius: 0.2rem;
    width: 100%;
    & img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
`

export default NotificationTemplateItem
