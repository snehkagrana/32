import { useCallback, useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useDispatch } from 'react-redux'
import Assets from 'src/assets'

import AmazonImg from 'src/assets/images/giftcard/amazon.jpg'
import GooglePlayImg from 'src/assets/images/giftcard/google-play.jpg'
import OtherImg from 'src/assets/images/giftcard/other.jpg'
import { useReward } from 'src/hooks'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'

import 'src/styles/RewardCardItem.styles.css'

const RewardCardItem = props => {
    const dispatch = useDispatch()
    const {
        modalDetail,
        reward_setModalDetail,
        openModalListReward,
        reward_setOpenModalListReward,
    } = useReward()
    const { name, imageURL, type, diamondValue } = props?.data

    const getGiftCardImage = useMemo(() => {
        if (imageURL) {
            return imageURL
        } else {
            switch (type) {
                case 'amazon':
                    return Assets.GiftCardDefaultAmazon
                case 'paytm':
                    return Assets.GiftCardDefaultPaytm
                case 'flipkart':
                    return Assets.GiftCardDefaultFlipkart
                case 'google play':
                    return Assets.GiftCardDefaultGooglePlay
                default:
                    return Assets.GiftCardDefaultOther
            }
        }
    }, [imageURL, type])

    const onClickRedeem = useCallback(() => {
        dispatch(reward_setOpenModalListReward(false))
        dispatch(reward_setModalDetail({ open: true, data: props.data }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail, openModalListReward])

    if (props.data) {
        return (
            <Card
                className='RewardCardItem FingoShapeRadius overflow-hidden'
                onClick={onClickRedeem}
            >
                <Card.Img variant='top' src={getGiftCardImage} />
                <Card.Body>
                    <div>
                        <Row className='align-items-center justify-space-between'>
                            <Col xs={8}>
                                <h4 className='mb-1'>{name}</h4>
                                <p className='mb-0'>
                                    Redeem for <DiamondSvg /> {diamondValue}
                                </p>
                            </Col>
                            <Col xs={4}>
                                <button
                                    onClick={onClickRedeem}
                                    className='btn RedeemBtn'
                                >
                                    Redeem
                                </button>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    return null
}

export default RewardCardItem
