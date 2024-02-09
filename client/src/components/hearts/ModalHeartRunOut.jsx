/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'
import { batch, useDispatch } from 'react-redux'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import { FingoModal } from 'src/components/core'
import { ReactComponent as DiamondIcon } from 'src/assets/svg/diamond.svg'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import { ReactComponent as RefillHeartIcon } from 'src/assets/svg/refill-heart.svg'
import { AMOUNT_OF_GEMS_REDEEM_TO_HEARTS } from 'src/constants/app.constant'
import SadImg from 'src/assets/images/sad.png'
import 'src/styles/ModalHeartRunOut.styles.css'

const ModalHeartRunOut = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const { guest } = usePersistedGuest()

    const {
        openModalHeartRunOut,
        app_setOpenModalHeartRunOut,
        app_setOpenModalKeepLearning,
        app_setOpenModalConfirmRefill,
        app_setOpenModalUnlimitedHearts,
    } = useApp()

    const handleCloseModal = () => {
        if (
            (!isAuthenticated && guest?.heart > 0) ||
            (isAuthenticated && user?.heart > 0)
        ) {
            dispatch(app_setOpenModalHeartRunOut(false))
        }
    }

    const onClickNoThanks = () => {
        batch(() => {
            dispatch(app_setOpenModalHeartRunOut(false))
            dispatch(app_setOpenModalKeepLearning(true))
        })
    }

    const isAbleToRefill = useMemo(() => {
        // prettier-ignore
        return Boolean(user?.heart === 0 && user?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS) || Boolean(guest?.heart === 0 && guest?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS)
    }, [isAuthenticated, user, guest])

    const getGemsAmount = useMemo(() => {
        if (!isAuthenticated) {
            return guest?.diamond || 0
        }
        return user?.diamond || 0
    }, [isAuthenticated, user, guest])

    const onClickRefillHearts = () => {
        dispatch(app_setOpenModalHeartRunOut(false))
        dispatch(app_setOpenModalConfirmRefill(true))
    }

    const onClickUnlimitedHearts = () => {
        batch(() => {
            dispatch(app_setOpenModalUnlimitedHearts(true))
            dispatch(app_setOpenModalHeartRunOut(false))
            dispatch(app_setOpenModalKeepLearning(false))
            dispatch(app_setOpenModalConfirmRefill(false))
            dispatch(app_setOpenModalConfirmRefill(false))
        })
    }

    return (
        <FingoModal
            open={openModalHeartRunOut}
            onClose={handleCloseModal}
            centered
            className='ModalHeartRunOut'
            showCloseButton={false}
        >
            <div className='ModalHeartRunOutContainer FingoShapeRadius'>
                <div className='HeartRunOut'>
                    <div className='HeartRunOutHeader flex align-items-center flex-column mb-4'>
                        <div className='flex justify-content-end w-100 mb-4'>
                            <div className='UserGems'>
                                <DiamondIcon />
                                <span>{getGemsAmount}</span>
                            </div>
                        </div>
                        <img src={SadImg} alt='img' className='mb-3' />
                        <h2 className='mb-2 text-center'>
                            You ran out of hearts.
                        </h2>
                        <h4 className='text-center'>
                            Refer your friends to get unlimited hearts or use gems
                            to get more hearts.
                        </h4>
                    </div>
                    <div className='HeartRunOutContent'>
                        <button
                            onClick={onClickUnlimitedHearts}
                            className='HeartRunOutBtn mb-3'
                        >
                            <UnlimitedHeartIcon />
                            <span> Unlimited Hearts</span>
                            <div className='EndContent'></div>
                        </button>
                        <button
                            className='HeartRunOutBtn mb-3'
                            disabled={!isAbleToRefill}
                            onClick={onClickRefillHearts}
                        >
                            <RefillHeartIcon />
                            <span> Refill Hearts</span>
                            <div className='EndContent'>
                                <DiamondIcon />
                                <span>{AMOUNT_OF_GEMS_REDEEM_TO_HEARTS}</span>
                            </div>
                        </button>
                        {user?.diamond < AMOUNT_OF_GEMS_REDEEM_TO_HEARTS && (
                            <p className='text-center text-sm mb-0'>
                                You do not have enough gems.
                            </p>
                        )}
                        <a
                            href='#'
                            onClick={onClickNoThanks}
                            className='HeartRunOutTextBtn mt-2'
                        >
                            No Thanks
                        </a>
                    </div>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalHeartRunOut
