import { useCallback, useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'

import AmazonImg from 'src/assets/images/giftcard/amazon.jpg'
import GooglePlayImg from 'src/assets/images/giftcard/google-play.jpg'
import OtherImg from 'src/assets/images/giftcard/other.jpg'

import 'src/styles/RewardCardItem.styles.css'

const RewardCardItem = props => {
    const { name, imageURL, type, diamondValue } = props?.data

    const getGiftCardImage = useMemo(() => {
        if (imageURL) {
            return imageURL
        } else {
            switch (type) {
                case 'amazon':
                    return AmazonImg
                case 'google play':
                    return GooglePlayImg
                default:
                    return OtherImg
            }
        }
    }, [imageURL, type])

    const onClickRedeem = useCallback(() => {
        alert('do something')
    }, [])

    if (props.data) {
        return (
            <Card className='RewardCardItem FingoShapeRadius overflow-hidden'>
                <Card.Img variant='top' src={getGiftCardImage} />
                <Card.Body>
                    <div>
                        <Row className='align-items-center justify-space-between'>
                            <Col xs={8}>
                                <h4 className='mb-1'>{name}</h4>
                                <p className='mb-0'>
                                    Redeem for 💎 {diamondValue}
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
