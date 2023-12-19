/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAdmin } from 'src/hooks'
import { FingoButton, FingoInput, FingoModal } from 'src/components/core'
import { ReactComponent as DangerIcon } from 'src/assets/svg/triangle-danger.svg'
import 'src/styles/ModalVerifyAction.styles.css'

export const ModalVerifyAction = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [password, setPassword] = useState('')

    const {
        openModalVerifyAction,
        admin_setOpenModalVerifyAction,
        admin_verifyAction,
        admin_setIsVerified,
        isVerified,
    } = useAdmin()

    const handleCloseModal = () => {
        dispatch(admin_setOpenModalVerifyAction(false))
    }

    const onClickCancel = () => {
        handleCloseModal()
    }

    useEffect(() => {
        if (!openModalVerifyAction) {
            dispatch(admin_setIsVerified(false))
            setIsLoading(false)
            setPassword('')
        }
    }, [openModalVerifyAction, isVerified])

    const handleSubmit = useCallback(
        async e => {
            setIsError(false)
            e.preventDefault()
            setIsLoading(true)
            // result is boolean
            await admin_verifyAction(password).then(result => {
                setIsLoading(false)
                if (result) {
                    setIsError(false)
                } else {
                    setIsError(true)
                }
            })
        },
        [password, openModalVerifyAction]
    )

    return (
        <FingoModal
            open={openModalVerifyAction}
            onClose={handleCloseModal}
            centered
            className='ModalVerifyAction'
        >
            <div className='VerifyActionContainer FingoShapeRadius'>
                <div className='VerifyActionHeader'>
                    <DangerIcon />
                    <div>
                        <h2 className='mb-0'>Verify</h2>
                        {/* <p className='mb-0'>
                            For security reasons we need to verify your account
                        </p> */}
                    </div>
                </div>
                <div className='mb-3'>
                    <form className='VerifyActionForm' onSubmit={handleSubmit}>
                        <p className='mb-2'>Enter your password</p>
                        <FingoInput
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='mb-3'
                            placeholder='Password'
                            size='lg'
                            type='password'
                        />
                        <FingoButton
                            color='primary'
                            size='lg'
                            className='w-100 mb-3'
                            type='submit'
                            isLoading={isLoading}
                        >
                            Verify
                        </FingoButton>
                        {isError && (
                            <div className='text-center'>
                                <p
                                    className='mb-0'
                                    style={{ color: 'red', fontWeight: '500' }}
                                >
                                    Forbidden
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </FingoModal>
    )
}
