import { useCallback, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useDispatch } from 'react-redux'
import Assets from 'src/assets'
import { useReward } from 'src/hooks'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import { ReactComponent as Eye } from 'src/assets/svg/eye.svg'
import { ReactComponent as EyeOff } from 'src/assets/svg/eye-off.svg'
import { ReactComponent as CopySvg } from 'src/assets/svg/baseline-content-copy.svg'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import 'src/styles/MyRewardCardItem.styles.css'

const MyRewardCardItem = props => {
    const dispatch = useDispatch()
    const [showPin, setShowPin] = useState(false)
    const {
        modalDetail,
        reward_setModalDetail,
        openModalListReward,
        reward_setOpenModalListReward,
    } = useReward()
    const {
        name,
        description,
        imageURL,
        brandUrl,
        type,
        currencyCode,
        diamondValue,
        currencyValue,
        claimCode,
        pin,
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

    const onClickRedeem = useCallback(() => {
        dispatch(reward_setOpenModalListReward(false))
        dispatch(reward_setModalDetail({ open: true, data: props.data }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail, openModalListReward])

    if (props.data) {
        return (
            <Card
                className='MyRewardCardItem FingoShapeRadius overflow-hidden'
                onClick={onClickRedeem}
            >
                <Card.Img variant='top' src={getGiftCardImage} />
                <Card.Body>
                    <div>
                        <Row className='align-items-center justify-space-between'>
                            <Col xs={12}>
                                <Row className='align-items-center justify-space-between'>
                                    <Col xs={8}>
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
                                    <Col xs={4}>
                                        <div className='RewardDetailCurrency'>
                                            <p>
                                                {currencyValue} {currencyCode}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xs={12} className='mb-1'>
                                        <hr />
                                    </Col>
                                    <Col xs={12} className='mb-3'>
                                        <h6 className='mb-1'>Description</h6>
                                        <p className='mb-0'>
                                            {description ?? '-'}
                                        </p>
                                        <hr />
                                    </Col>
                                    <Col xs={12} className='mb-3'>
                                        <h6 className='mb-1'>URL</h6>
                                        <p className='mb-0'>
                                            {brandUrl ?? '-'}
                                        </p>
                                        <hr />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <div className='RedeemSuccess mb-2'>
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
