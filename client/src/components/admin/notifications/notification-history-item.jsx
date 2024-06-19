import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import NotificationItemTypeLabel from './notification-item-type-label'
import toast from 'react-hot-toast'
import Assets from 'src/assets'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'

const NotificationHistoryItem = ({ data, onClickDetail, isLastItem }) => {
    const dispatch = useDispatch()

    const onClickView = useCallback(() => {
        onClickDetail(data)
    }, [data, onClickDetail])

    return (
        <ItemWrapper>
            <ItemHour>
                <p>{dayjs(data.createdAt).format('hh:mm A')}</p>
            </ItemHour>
            <BorderLine style={{ height: isLastItem ? 35 : 80 }}>
                <BorderDot />
            </BorderLine>
            <CardTemplate onClick={onClickView}>
                <TypeContainer>
                    {data.type && (
                        <TypeAbsolute>
                            <NotificationItemTypeLabel type={data.type} />
                        </TypeAbsolute>
                    )}
                    <MetaInfo>
                        <AvatarContainer>
                            {data?.users?.map((x, index) => (
                                <UserAvatar key={String(index)}>
                                    <img
                                        src={
                                            x?.imgPath || Assets.AvatarDefaultXs
                                        }
                                        alt='avatar'
                                    />
                                </UserAvatar>
                            ))}
                        </AvatarContainer>
                    </MetaInfo>
                    {/* {data.isFromDashboard && (
                        <AbsoluteLabelSystem>
                            <LabelRoot>
                                <LabelText>System Schedule</LabelText>
                            </LabelRoot>
                        </AbsoluteLabelSystem>
                    )} */}
                </TypeContainer>
                <CardContainer>
                    <NotificationImageWrapper>
                        <NotificationImage>
                            <img
                                src={data?.imageUrl || Assets.NoImg}
                                alt='placeholder'
                            />
                            x{' '}
                        </NotificationImage>
                    </NotificationImageWrapper>
                    <TemplateInfo>
                        <TitleText>{data.title}</TitleText>
                        <BodyText>{data.body}</BodyText>
                    </TemplateInfo>
                </CardContainer>
            </CardTemplate>
        </ItemWrapper>
    )
}

const ItemWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
`

const ItemHour = styled.div`
    width: 96px;
    text-align: center;
    margin-top: 32px;
    p {
        margin-bottom: 0;
        font-size: 0.8rem;
        font-weight: bold;
    }
`

const BorderLine = styled.div`
    height: 80px;
    width: 3px;
    background-color: #aabbee;
    position: relative;
`

const BorderDot = styled.div`
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background-color: #3366ff;
    position: absolute;
    top: 32px;
    left: -6px;
`

const CardTemplate = styled.div`
    width: 100%;
    border: 1px solid rgb(109 109 109 / 10%);
    border-radius: 0.4rem;
    padding: 0.5rem 0.6rem;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    margin-left: 20px;
    margin-top: 8px;
`

const CardContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`

const TypeAbsolute = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
`

const AbsoluteLabelSystem = styled.div`
    position: absolute;
    top: 30px;
    right: 10px;
`

const TemplateInfo = styled.div`
    margin-left: 0.8rem;
`

const MetaInfo = styled.div`
    position: absolute;
    bottom: 5px;
    right: 10px;
`

const TitleText = styled.h4`
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
    margin-right: 1rem;
`

const BodyText = styled.p`
    font-size: 0.85rem;
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

const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 32px;
    margin-right: -8px;
    border: 2px solid #fff;
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
    }
`

const NotificationImageWrapper = styled.div`
    position: relative;
    padding-top: 50px;
    width: 50px;
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
    background-color: #444;
`

const LabelText = styled.p`
    color: #fff;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 0.75rem;
`

const TypeContainer = styled.div`
    width: 100px;
`

export default memo(NotificationHistoryItem)
