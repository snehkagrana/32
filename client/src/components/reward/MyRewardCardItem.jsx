import { useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useDispatch } from 'react-redux'
import Assets from 'src/assets'
import { useReward } from 'src/hooks'
import { ReactComponent as Eye } from 'src/assets/svg/eye.svg'
import { ReactComponent as EyeOff } from 'src/assets/svg/eye-off.svg'
import { ReactComponent as CopySvg } from 'src/assets/svg/baseline-content-copy.svg'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import 'src/styles/MyRewardCardItem.styles.css'
import dayjs from 'dayjs'

const MyRewardCardItem = props => {
    const dispatch = useDispatch()
    const [showPin, setShowPin] = useState(false)
    const {} = useReward()
    const {
        name,
        redeemedAt,
        description,
        imageURL,
        brandUrl,
        type,
        currencyCode,
        diamondValue,
        currencyValue,
        claimCode,
        pin,
        givenBy,
    } = props?.data

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

    const onClickCopy = () => {
        toast.success('Copied to clipboard.')
    }

    const isRedeemByMe = useMemo(() => {
        return Boolean(!givenBy)
    }, [givenBy])

    const getLogo = type => {
        switch (type) {
            case 'amazon':
                return Assets.AmazonLogo
            case 'paytm':
                return Assets.PaytmLogo
            case 'flipkart':
                return Assets.FlipkartLogo
            case 'google play':
                return Assets.GooglePlayLogo
            default:
                return Assets.GiftBoxIcon
        }
    }

    if (props.data) {
        return (
            <Card className='MyRewardCardItem FingoShapeRadius overflow-hidden'>
                <div className='MyRewardCardItemImg'>
                    <Card.Img variant='top' src={getGiftCardImage} />
                </div>
                <Card.Body>
                    <div>
                        <Row className='align-items-center justify-space-between'>
                            <Col xs={12}>
                                <Row className='align-items-center justify-space-between'>
                                    <Col
                                        xs={12}
                                        md={8}
                                        className='mb-2 mb-md-0'
                                    >
                                        <div className='RewardDetailLogo'>
                                            <img
                                                src={getLogo(type)}
                                                alt='logo'
                                            />
                                            <p className='mb-0'>
                                                {type.toUpperCase()}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col
                                        xs={12}
                                        md={4}
                                        className='mb-4 mb-md-0'
                                    >
                                        <div className='RewardDetailCurrency'>
                                            <p>
                                                {currencyValue} {currencyCode}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xs={12} className='mb-1'>
                                        <hr />
                                    </Col>
                                    <Col
                                        xs={12}
                                        className='MyRewardCardItemSection'
                                    >
                                        <h6 className='mb-1'>Description</h6>
                                        <p className='mb-0'>
                                            {description ?? '-'}
                                        </p>
                                        <hr />
                                    </Col>
                                    {redeemedAt && (
                                        <Col
                                            xs={12}
                                            className='MyRewardCardItemSection mb-3'
                                        >
                                            <h6 className='mb-1'>Claimed at</h6>
                                            <p className='mb-0'>
                                                {dayjs(redeemedAt).format(
                                                    'DD MMM, YYYY, HH:mm'
                                                ) ?? '-'}
                                            </p>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <div className='RedeemSuccess'>
                                    <div className='RedeemCode'>
                                        <p className='RedeemCodeLabel'>Code</p>
                                        <CopyToClipboard text={claimCode}>
                                            <code onClick={onClickCopy}>
                                                {claimCode}
                                            </code>
                                        </CopyToClipboard>
                                        <CopyToClipboard text={claimCode}>
                                            <CopySvg
                                                onClick={onClickCopy}
                                                className='cp'
                                            />
                                        </CopyToClipboard>
                                    </div>

                                    {/* pin */}
                                    {pin && (
                                        <div className='mt-2'>
                                            <p className='mb-1 text-bold'>
                                                PIN
                                            </p>
                                            <div className='RedeemPin'>
                                                {/* {redeemedItem?.pin && <></>} */}
                                                <input
                                                    value={pin}
                                                    type={
                                                        showPin
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                />
                                                <button
                                                    className='ToggleShowPin'
                                                    onClick={() =>
                                                        setShowPin(!showPin)
                                                    }
                                                >
                                                    {showPin ? (
                                                        <Eye />
                                                    ) : (
                                                        <EyeOff />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className='mt-2 mb-0'>
                                        <p className='mb-0'>
                                            Redeem for <DiamondSvg />{' '}
                                            {diamondValue}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    return null
}

export default MyRewardCardItem
