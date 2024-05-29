import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { NotificationsAPI } from 'src/api'
import NotificationItemTypeLabel from './notification-item-type-label'
import toast from 'react-hot-toast'
import Assets from 'src/assets'
import { useDispatch } from 'react-redux'

const NotificationHistoryItem = ({ data, onClickDetail }) => {
    const dispatch = useDispatch()
    const onClickItem = useCallback(() => {}, [])

    const onClickView = useCallback(() => {
        onClickDetail(data)
    }, [data])

    return (
        <CardTemplate onClick={onClickView}>
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
    top: 14px;
    right: 10px;
`

const TemplateInfo = styled.div`
    margin-left: 0.8rem;
`

const TitleText = styled.h4`
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
    margin-right: 1rem;
`

const BodyText = styled.p`
    font-size: 0.7rem;
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
    border: 1px solid #03a9f4;
    border-radius: 6px;
    padding: 0;
    svg {
        font-size: 18px;
        color: #03a9f4;
    }
    &:hover {
        background-color: #03a9f4;
        svg {
            color: #fff;
        }
    }
`

const NotificationImageWrapper = styled.div`
    position: relative;
    padding-top: 40px;
    width: 40px;
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

const ViewButton = styled.button`
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

export default memo(NotificationHistoryItem)
