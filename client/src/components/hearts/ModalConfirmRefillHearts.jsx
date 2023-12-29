/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { batch, useDispatch } from 'react-redux'
import { useApp, useAuth } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as RefillIcon } from 'src/assets/svg/refill-heart.svg'
import { ReactComponent as HeartIcon } from 'src/assets/svg/heart.svg'
import { ReactComponent as DiamondIcon } from 'src/assets/svg/diamond.svg'
import 'src/styles/ModalConfirmRefill.styles.css'
import {
    AMOUNT_OF_GEMS_REDEEM_TO_HEARTS,
    MAX_HEARTS,
} from 'src/constants/app.constant'
import { HeartsAPI } from 'src/api'
import toast from 'react-hot-toast'

const ModalConfirmRefill = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth_syncAndGetUser } = useAuth()
    const {
        app_setOpenModalKeepLearning,
        app_setOpenModalHeartRunOut,
        app_setOpenModalConfirmRefill,
        openModalConfirmRefill,
    } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalConfirmRefill(false))
    }

    const onClickConfirm = async () => {
        // handleCloseModal()
        // dispatch(app_setOpenModalHeartRunOut(true))
        try {
            const response = await HeartsAPI.refill({
                gemsAmount: AMOUNT_OF_GEMS_REDEEM_TO_HEARTS,
            })
            if (response) {
                auth_syncAndGetUser().then(res => {
                    handleCloseModal()
                    batch(() => {
                        dispatch(app_setOpenModalHeartRunOut(false))
                        dispatch(app_setOpenModalKeepLearning(false))
                        dispatch(app_setOpenModalConfirmRefill(false))
                    })
                })
            } else {
                toast.error('Failed to refill hearts')
            }
        } catch (e) {
            toast.error('Failed to refill hearts')
        }
    }

    const onClickCancel = e => {
        e.preventDefault()
        handleCloseModal()
        dispatch(app_setOpenModalHeartRunOut(false))
        navigate('/home')
    }

    return (
        <FingoModal
            open={openModalConfirmRefill}
            onClose={handleCloseModal}
            className='ModalConfirmRefill'
            showCloseButton={false}
        >
            <div className='ModalConfirmRefillContainer FingoShapeRadius'>
                <div className='RefillHearts'>
                    <RefillIcon className='RefillHeartsIcon' />
                    <h2 className='mb-3 text-center'>Confirm</h2>
                    <h4 className='TextWithIcon mb-4'>
                        You will fill {MAX_HEARTS}{' '}
                        <HeartIcon className='HeartSvg' /> with{' '}
                        {AMOUNT_OF_GEMS_REDEEM_TO_HEARTS} <DiamondIcon />
                    </h4>
                    <FingoButton
                        className='w-100 mb-4'
                        color='success'
                        size='xl'
                        onClick={onClickConfirm}
                    >
                        CONFIRM
                    </FingoButton>
                    <a
                        href='#'
                        className='ModalRefillCancelBtn'
                        onClick={onClickCancel}
                    >
                        CANCEL
                    </a>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalConfirmRefill
