/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from 'src/hooks'
import { FingoModal } from 'src/components/core'
import 'src/styles/ModalConfirmCloseHeartRunOut.styles.css'

const ModalConfirmCloseHeartRunOut = () => {
    const dispatch = useDispatch()
    const {
        openModalConfirmCloseHeartRunOut,
        app_setOpenModalConfirmCloseHeartRunOut,
    } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalConfirmCloseHeartRunOut(false))
    }

    return (
        <FingoModal
            open={openModalConfirmCloseHeartRunOut}
            onClose={handleCloseModal}
            centered
            className='ModalConfirmCloseHeartRunOut'
        >
            <div className='ModalConfirmCloseHeartRunOutContainer FingoShapeRadius'></div>
        </FingoModal>
    )
}

export default ModalConfirmCloseHeartRunOut
