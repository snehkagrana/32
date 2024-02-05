/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp, useAuth } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import RockerImage from 'src/assets/images/rocket.png'
import 'src/styles/ModalUnlimitedHearts.styles.css'

const ModalUnlimitedHearts = () => {
    const dispatch = useDispatch()

    const { isAuthenticated, auth_setOpenModalRegister } = useAuth()

    const {
        openModalUnlimitedHearts,
        app_setOpenModalUnlimitedHearts,
        app_setOpenModalInviteFriends,
    } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalUnlimitedHearts(false))
    }

    const onClickGetUnlimitedHears = () => {
        handleCloseModal()
        dispatch(app_setOpenModalInviteFriends(true))
    }

    const onClickSignUp = () => {
        dispatch(auth_setOpenModalRegister(true))
    }

    return (
        <FingoModal
            open={openModalUnlimitedHearts}
            onClose={handleCloseModal}
            centered
            className='ModalUnlimitedHearts'
            showCloseButton={false}
        >
            <div className='ModalUnlimitedHeartsContainer FingoShapeRadius'>
                <div className='UnlimitedHearts'>
                    <div className='UnlimitedHeartsHeader flex align-items-center flex-column mb-3'>
                        <img src={RockerImage} alt='img' className='mb-3' />
                        <h2 className='mb-2 text-center'>Unlimited Hearts</h2>
                        <h4 className='text-center'>
                            Learn at your own pace and never run out of hearts.
                        </h4>
                    </div>
                    <div className='UnlimitedHeartsContent'>
                        {isAuthenticated ? (
                            <>
                                <button
                                    className='UnlimitedHeartsBtn mb-3'
                                    onClick={onClickGetUnlimitedHears}
                                    disabled={!isAuthenticated}
                                >
                                    <UnlimitedHeartIcon />
                                    <span>Get Unlimited Hearts</span>
                                </button>
                                <p className='mb-0 text-center text-sm'>
                                    Get 72 hours of unlimited hearts by inviting
                                    your friends.
                                </p>
                            </>
                        ) : (
                            <>
                                <FingoButton
                                    onClick={onClickSignUp}
                                    enableHoverEffect={false}
                                    className='w-100'
                                    color='white'
                                >
                                    Sign Up
                                </FingoButton>
                                <p className='mt-3 mb-0 text-center text-sm'>
                                    Sign up to get unlimited hearts.{' '}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalUnlimitedHearts
