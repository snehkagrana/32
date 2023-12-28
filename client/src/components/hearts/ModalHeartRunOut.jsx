/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from 'src/hooks'
import { FingoModal } from 'src/components/core'

const ModalHeartRunOut = () => {
    const dispatch = useDispatch()

    const { openModalHeartRunOut, app_setOpenModalHeartRunOut } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalHeartRunOut(false))
    }

    return (
        <FingoModal
            open={openModalHeartRunOut}
            onClose={handleCloseModal}
            centered
            className='ModalHeartRunOut'
        >
            <div className='ModalHeartRunOutContainer FingoShapeRadius'></div>
        </FingoModal>
    )
}

export default ModalHeartRunOut
