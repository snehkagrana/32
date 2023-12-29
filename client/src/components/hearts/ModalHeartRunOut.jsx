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
import 'src/styles/ModalHeartRunOut.styles.css'

const ModalHeartRunOut = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const { guestState } = usePersistedGuest()

    const {
        openModalHeartRunOut,
        app_setOpenModalHeartRunOut,
        app_setOpenModalKeepLearning,
    } = useApp()

    const handleCloseModal = () => {
        if ((isAuthenticated && user?.heart > 0) || guestState?.heart > 0) {
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
        return Boolean(
            user?.heart === 0 &&
                user?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS
        )
    }, [user])

    const getGemsAmount = useMemo(() => {
        if (!isAuthenticated) {
            return guestState?.diamond || 0
        }
        return user?.diamond || 0
    }, [isAuthenticated, user, guestState])

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
                        <h2 className='mb-3 text-center'>
                            You run out of hearts!
                        </h2>
                        <h4 className='text-center'>
                            Get Super for unlimited Hearts, or use gems to buy
                            hearts.
                        </h4>
                    </div>
                    <div className='HeartRunOutContent'>
                        <button className='HeartRunOutBtn mb-4'>
                            <UnlimitedHeartIcon />
                            <span> Unlimited Hearts</span>
                            <div className='EndContent'></div>
                        </button>
                        <button
                            className='HeartRunOutBtn'
                            disabled={!isAbleToRefill}
                        >
                            <RefillHeartIcon />
                            <span> Refill Hearts</span>
                            <div className='EndContent'>
                                <DiamondIcon />
                                <span>{AMOUNT_OF_GEMS_REDEEM_TO_HEARTS}</span>
                            </div>
                        </button>
                        {user?.diamond < AMOUNT_OF_GEMS_REDEEM_TO_HEARTS && (
                            <p className='text-center text-sm'>
                                Your gems are not enough
                            </p>
                        )}
                        <a
                            href='#'
                            onClick={onClickNoThanks}
                            className='HeartRunOutTextBtn mt-4'
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
