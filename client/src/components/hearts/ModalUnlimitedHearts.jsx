/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from 'src/hooks'
import { FingoModal } from 'src/components/core'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import RockerImage from 'src/assets/images/rocket.png'
import 'src/styles/ModalUnlimitedHearts.styles.css'

const ModalUnlimitedHearts = () => {
    const dispatch = useDispatch()

    const {
        openModalUnlimitedHearts,
        app_setOpenModalUnlimitedHearts,
        app_setOpenModalInviteFriends,
    } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalUnlimitedHearts(false))
    }

    const onClickGetUnlimitedHears = () => {
        dispatch(app_setOpenModalInviteFriends(true))
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
                    <div className='UnlimitedHeartsHeader flex align-items-center flex-column mb-4'>
                        <img src={RockerImage} alt='img' className='mb-3' />
                        <h2 className='mb-2 text-center'>Unlimited Hearts</h2>
                        <h4 className='text-center'>
                            Learn at your own pace and never run out of hearts
                        </h4>
                    </div>
                    <div className='UnlimitedHeartsContent'>
                        <button
                            className='UnlimitedHeartsBtn mb-3'
                            onClick={onClickGetUnlimitedHears}
                        >
                            <UnlimitedHeartIcon />
                            <span>Get Unlimited Hearts</span>
                        </button>
                        <p className='mb-0 text-center text-sm'>
                            Get 72 hours of unlimited hearts by invite friends
                        </p>
                    </div>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalUnlimitedHearts
