import { useCallback } from 'react'
import styled from 'styled-components'
import DEFAULT_IMG from 'src/images/pepe.jpg'
import { NotificationsAPI } from 'src/api'

const NotificationTemplateItem = ({ data, fetchData, onEdit }) => {
    const onClickItem = useCallback(() => {}, [])

    const onClickDelete = useCallback(async () => {
        try {
            const response =
                await NotificationsAPI.admin_deleteNotificationTemplate(
                    data._id
                )
            if (response && typeof fetchData === 'function') {
                fetchData()
            }
        } catch (e) {}
    }, [data._id, fetchData])

    const onClickEdit = useCallback(async () => {
        if (typeof onEdit === 'function') {
            onEdit(data)
        }
    }, [data, onEdit])

    return (
        <CardTemplate onClick={onClickItem}>
            <TemplateInfo>
                <UserAvatar src={data?.imgPath || DEFAULT_IMG} />
                <TitleText>{data.title}</TitleText>
                <BodyText>{data.body}</BodyText>
            </TemplateInfo>
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
                <DeleteButton onClick={onClickDelete} className='delete-btn'>
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
        </CardTemplate>
    )
}

const CardTemplate = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 1px solid rgb(109 109 109 / 10%);
    border-radius: 0.4rem;
    margin-bottom: 0.5rem;
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    overflow: hidden;

    .ButtonContainer {
        transform: translateX(120px);
    }

    &:hover {
        .ButtonContainer {
            transform: translateX(0px);
        }
    }
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

const UserAvatar = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 45px;
`

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
`

const EditButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 36px;
    width: 36px;
    background-color: transparent;
    border: 1px solid #03a9f4;
    border-radius: 36px;
    padding: 0;
    svg {
        font-size: 22px;
        color: #03a9f4;
    }
`

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 36px;
    width: 36px;
    background-color: transparent;
    border: 1px solid #ff2c2c;
    border-radius: 36px;
    padding: 0;
    margin-left: 0.5rem;
    svg {
        font-size: 22px;
        color: #ff0000;
    }
`

export default NotificationTemplateItem
