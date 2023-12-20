import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { useAuth, useReward } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import Confetti from 'react-dom-confetti'
import { XP_LEVEL_COLORS_DEFAULT } from 'src/constants'
import GiftImg from 'src/assets/images/giftbox.png'
import 'src/styles/ModalClaimReward.styles.css'
import Assets from 'src/assets'
import LoadingBox from '../LoadingBox'
import { useAnimationControls, motion } from 'framer-motion'

const confettiConfig = {
    angle: 10,
    spread: 360,
    startVelocity: 30,
    elementCount: 150,
    dragFriction: 0.12,
    duration: 2000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '420px',
    colors: XP_LEVEL_COLORS_DEFAULT,
}

const ModalClaimReward = () => {
    const dispatch = useDispatch()
    const { auth_syncAndGetUser } = useAuth()
    const { openModalClaimReward, reward_setOpenModalClaimReward } = useReward()
    const [isLoading, setIsLoading] = useState(true)
    const [celebrate, setCelebrate] = useState(false)

    const handleCloseModal = () => {
        dispatch(reward_setOpenModalClaimReward({ open: false, data: null }))
    }

    const wrapperVariants = {
        hidden: {
            opacity: 0,
            scale: 0,
            y: '50px',
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', delay: 0.04 },
        },
        exit: {
            y: '-100px',
            scale: 0,
            transition: { ease: 'easeInOut' },
        },
    }

    useEffect(() => {
        if (openModalClaimReward.open) {
            auth_syncAndGetUser().then(result => {
                // do nothing
            })
            setTimeout(() => {
                setCelebrate(true)
                // setIsLoading(false)
            }, 200)
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        } else {
            setIsLoading(true)
            setCelebrate(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalClaimReward.open])

    const controls = useAnimationControls()

    useEffect(() => {
        if (openModalClaimReward.open) {
            setTimeout(() => {
                controls.start('visible')
            }, 500)
        }
    }, [openModalClaimReward.open])

    return (
        <FingoModal
            open={openModalClaimReward.open}
            onClose={handleCloseModal}
            centered
            className='ModalClaimReward'
        >
            {openModalClaimReward.open && (
                <>
                    <div
                        className='relative ModalClaimRewardContainer FingoShapeRadius'
                        style={{
                            backgroundImage: `url('${Assets.CelebrateBadge2}')`,
                        }}
                    >
                        {isLoading && (
                            <div className='LoadingWrapper'>
                                <LoadingBox height={240} />{' '}
                            </div>
                        )}
                        <motion.div
                            variants={wrapperVariants}
                            initial='hidden'
                            animate={controls}
                            exit='exit'
                        >
                            <div className='ModalClaimRewardContent'>
                                <img
                                    src={GiftImg}
                                    alt='Giftbox'
                                    className='Giftbox'
                                />
                                <h2 className='mb-1'>Congratulations!</h2>
                                <h6 className='mb-4'>
                                    You got{'  '}
                                    {openModalClaimReward?.data?.value
                                        ? openModalClaimReward.data.value
                                        : '0'}
                                    <DiamondSvg />
                                </h6>
                                <FingoButton
                                    color='primary'
                                    style={{ minWidth: 130 }}
                                    onClick={handleCloseModal}
                                >
                                    Continue
                                </FingoButton>

                                <div className='confetti-container'>
                                    <Confetti
                                        active={celebrate}
                                        config={confettiConfig}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </FingoModal>
    )
}

export default ModalClaimReward
