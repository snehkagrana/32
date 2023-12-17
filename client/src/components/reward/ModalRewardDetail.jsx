import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useAuth, useReward } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import AmazonImg from 'src/assets/images/giftcard/amazon.jpg'
import GooglePlayImg from 'src/assets/images/giftcard/google-play.jpg'
import OtherImg from 'src/assets/images/giftcard/other.jpg'
import 'src/styles/ModalRewardDetail.styles.css'
import { RewardApi } from 'src/api'
import LoadingBox from '../LoadingBox'

const ModalRewardDetail = () => {
    const dispatch = useDispatch()
    const { auth_syncAndGetUser } = useAuth()
    const { modalDetail, reward_setModalDetail } = useReward()
    const [redeemSuccess, setRedeemSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [redeemedItem, setRedeemedItem] = useState(null)

    const handleCloseModal = () => {
        dispatch(reward_setModalDetail(false))
    }

    const onClickRedeem = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await RewardApi.redeem({
                itemId: modalDetail.data._id,
                notes: '',
            })
            if (response) {
                setRedeemSuccess(true)
                auth_syncAndGetUser().then(result => {
                    setIsLoading(true)
                    if (result?._id) {
                        if (result?.rewards?.length > 0) {
                            setIsLoading(false)

                            setRedeemedItem(
                                result?.rewards.find(
                                    x => x._id === modalDetail.data._id
                                )
                            )
                        }
                    } else {
                        setIsLoading(true)
                    }
                })
            }
        } catch (e) {
            setIsLoading(true)
        }
    }, [modalDetail.data])

    const getGiftCardImage = useMemo(() => {
        if (modalDetail.data) {
            console.log('modalDetail.data', modalDetail.data)
            if (modalDetail.data?.imageURL) {
                return modalDetail.data.imageURL
            } else {
                switch (modalDetail.data.type) {
                    case 'amazon':
                        return AmazonImg
                    case 'google play':
                        return GooglePlayImg
                    default:
                        return GooglePlayImg
                }
            }
        } else {
            return OtherImg
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail.data])

    useEffect(() => {
        if (!modalDetail.open) {
            setIsLoading(false)
            setRedeemSuccess(false)
            setRedeemedItem(null)
        }
    }, [modalDetail.open])

    return (
        <FingoModal
            open={modalDetail.open}
            onClose={handleCloseModal}
            centered
            className='ModalRewardDetail'
        >
            <div className='RewardDetail FingoShapeRadius'>
                {isLoading ? (
                    <LoadingBox height={300} />
                ) : (
                    <>
                        {modalDetail.data && (
                            <>
                                <div className='FingoWaves'>
                                    <div />
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 1440 320'
                                    >
                                        <path
                                            fill='currentColor'
                                            fillOpacity='1'
                                            d='M0,128L60,122.7C120,117,240,107,360,112C480,117,600,139,720,160C840,181,960,203,1080,192C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
                                        ></path>
                                    </svg>
                                </div>
                                <div className='HeaderTitle'>
                                    <h2 className='mb-3'>
                                        {redeemSuccess && redeemedItem
                                            ? 'Congratulations!'
                                            : modalDetail.data.name}
                                    </h2>
                                </div>
                                <div className='RewardDetailContent'>
                                    <div className='RewardDetailImg FingoShapeRadius'>
                                        <img
                                            src={getGiftCardImage}
                                            alt={modalDetail.data?.name}
                                        />
                                    </div>

                                    {redeemSuccess && redeemedItem ? (
                                        <div className='RedeemSuccess'>
                                            <h2>
                                                Here's is the code for your{' '}
                                                {redeemedItem?.currencyValue}{' '}
                                                {redeemedItem?.currencyCode}{' '}
                                            </h2>
                                            <h6 className='mb-4'>
                                                {redeemedItem?.name}
                                            </h6>

                                            <div className='RedeemCode'>
                                                <code>
                                                    {redeemedItem?.claimCode}
                                                </code>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Row className='align-items-center justify-space-between'>
                                                <Col xs={12} className='mb-3'>
                                                    <h6 className='mb-1'></h6>
                                                    <p className='mb-0'>
                                                        Redeem for 💎{' '}
                                                        {
                                                            modalDetail.data
                                                                .diamondValue
                                                        }
                                                    </p>
                                                    <hr />
                                                </Col>
                                                <Col xs={12} className='mb-3'>
                                                    <h6 className='mb-1'>
                                                        Description
                                                    </h6>
                                                    <p className='mb-0'>
                                                        {modalDetail.data
                                                            .description ?? '-'}
                                                    </p>
                                                    <hr />
                                                </Col>
                                                <Col xs={12} className='mb-3'>
                                                    <h6 className='mb-1'>
                                                        URL
                                                    </h6>
                                                    <p className='mb-0'>
                                                        {modalDetail.data
                                                            .brandUrl ?? '-'}
                                                    </p>
                                                    <hr />
                                                </Col>
                                                <Col xs={12}>
                                                    <FingoButton
                                                        size='lg'
                                                        color='success'
                                                        onClick={onClickRedeem}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        Redeem
                                                    </FingoButton>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </FingoModal>
    )
}

export default ModalRewardDetail
