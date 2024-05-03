import { useCallback } from 'react'
import styled from 'styled-components'
import DEFAULT_IMG from 'src/images/pepe.jpg'

const NotificationRecipientItem = ({ data, checked, onCheck, canChecked }) => {
    const handleCheck = useCallback(() => {
        if (canChecked) {
            onCheck(data)
        }
    }, [data, onCheck, canChecked])

    return (
        <UserItem onClick={handleCheck}>
            <UserAvatar src={data?.imgPath || DEFAULT_IMG} />
            <UserInfo>
                <UserDisplayName>{data.displayName}</UserDisplayName>
                <UserEmail>{data.email}</UserEmail>
            </UserInfo>
            {canChecked && (
                <CheckButton onClick={handleCheck}>
                    {!checked ? (
                        <div />
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1em'
                            height='1em'
                            viewBox='0 0 24 24'
                        >
                            <path
                                fill='currentColor'
                                d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-.997-6l7.07-7.071l-1.413-1.414l-5.657 5.657l-2.829-2.829l-1.414 1.414z'
                            />
                        </svg>
                    )}
                </CheckButton>
            )}
        </UserItem>
    )
}

const UserItem = styled.div`
    display: flex;
    align-items: center;
    height: 72px;
    width: 100%;
    border: 1px solid rgb(109 109 109 / 10%);
    border-radius: 0.4rem;
    margin-bottom: 0.5rem;
    padding: 0.2rem 0.6rem;
    cursor: pointer;
`

const UserInfo = styled.div`
    margin-left: 0.8rem;
`
const UserDisplayName = styled.h4`
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    margin-right: 1rem;
`

const UserEmail = styled.p`
    font-size: 0.8rem;
    margin-bottom: 0;
`

const UserAvatar = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 45px;
`

const CheckButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    height: 26px;
    width: 26px;
    background-color: transparent;
    border: 1px solid #ececec;
    border-radius: 26px;
    padding: 0;
    svg {
        font-size: 26px;
        color: #03a9f4;
    }
`

export default NotificationRecipientItem
