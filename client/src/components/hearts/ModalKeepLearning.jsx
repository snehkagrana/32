/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import SadImg from 'src/assets/images/sad.png'
import 'src/styles/ModalKeepLearning.styles.css'
import { useNavigate } from 'react-router-dom'

const ModalKeepLearning = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        openModalKeepLearning,
        app_setOpenModalKeepLearning,
        app_setOpenModalHeartRunOut,
    } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalKeepLearning(false))
    }

    const onClickKeepLearning = () => {
        handleCloseModal()
        dispatch(app_setOpenModalHeartRunOut(true))
    }

    const onClickEndSession = e => {
        e.preventDefault()
        handleCloseModal()
        dispatch(app_setOpenModalHeartRunOut(false))
        navigate('/home')
    }

    return (
        <FingoModal
            open={openModalKeepLearning}
            onClose={handleCloseModal}
            centeredxe
            className='ModalKeepLearning'
            showCloseButton={false}
        >
            <div className='ModalKeepLearningContainer FingoShapeRadius'>
                <div className='KeepLearning'>
                    <img
                        className='KeepLearningImg mb-4'
                        src={SadImg}
                        alt='icon'
                    />
                    <h2 className='mb-3 text-center'>Wait, don't go!</h2>
                    <h4 className='text-center mb-4'>
                        You're right on track! if you quit now, you will lose
                        your progress
                    </h4>
                    <FingoButton
                        className='w-100 mb-4'
                        color='success'
                        size='xl'
                        onClick={onClickKeepLearning}
                    >
                        KEEP LEARNING
                    </FingoButton>
                    <a
                        href='#'
                        className='KeepLearningImgEnd'
                        onClick={onClickEndSession}
                    >
                        End session
                    </a>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalKeepLearning
