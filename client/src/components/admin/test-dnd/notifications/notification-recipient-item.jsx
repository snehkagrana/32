import { useCallback, useState } from 'react'
import styled from 'styled-components'

const NotificationRecipientItem = ({ data, checked, onCheck }) => {
    // const [checked, setChecked] = useState(false)

    const handleCheck = useCallback(() => {
        onCheck(data)
    }, [data, onCheck])

    return (
        <UserItem>
            <CheckButton onClick={handleCheck}>
                {!checked ? (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='1em'
                        height='1em'
                        viewBox='0 0 24 24'
                    >
                        <path
                            fill='currentColor'
                            d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2'
                        />
                    </svg>
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
            <radio name='checked' value={checked} onChange={handleCheck} />
            <UserDisplayName>{data.displayName}</UserDisplayName>
        </UserItem>
    )
}

const UserItem = styled.div`
    display: flex;
    align-items: center;
`

const UserDisplayName = styled.h4`
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0;
    margin-right: 1rem;
`

const CheckButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
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
