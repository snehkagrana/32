/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { Row, Form, Col } from 'react-bootstrap'
import { useAuth } from 'src/hooks'
import { useDispatch } from 'react-redux'
import { FingoButton, FingoInput, FingoModal } from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AuthAPI } from 'src/api'
import { ReactComponent as UnreadEmailSvg } from 'src/assets/svg/outline-mark-email-unread.svg'
import 'src/styles/ForgotPasswordForm.styles.css'

const schema = Yup.object().shape({
    email: Yup.string().required('Please enter email address'),
})

export default function ModalForgotPassword() {
    const dispatch = useDispatch()
    const {
        auth_openModalForgotPassword,
        auth_setOpenModalForgotPassword,
        auth_setOpenModalLogin,
        auth_openModalLogin,
    } = useAuth()

    const [email, setEmail] = useState(false)
    const [forgotSuccess, setForgotSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: { email: '' },
        resolver: yupResolver(schema),
    })

    const onValidSubmit = async values => {
        try {
            const baseUrl = `${window.location.protocol}//${window.location.hostname}`
            const response = await AuthAPI.sendLinkResetPassword({
                email: values.email,
                baseUrl,
            })
            if (response?.message) {
                setIsError(false)
                setForgotSuccess(true)
                setEmail(values.email)
            }
        } catch (e) {
            console.log('e', e)
            setIsError(true)
            setForgotSuccess(false)
            setEmail('')
        }
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    const handleCloseModal = () => {
        dispatch(auth_setOpenModalForgotPassword(false))
    }

    const onClickBackToLogin = useCallback(
        e => {
            e.preventDefault()
            handleCloseModal()
            dispatch(auth_setOpenModalLogin(true))
        },
        [auth_openModalLogin, auth_openModalForgotPassword]
    )

    useEffect(() => {
        if (!auth_openModalForgotPassword) {
            setForgotSuccess(false)
            setIsError(false)
            setEmail('')
            reset({ email: '' })
        }
    }, [auth_openModalForgotPassword])

    return (
        <FingoModal
            className='auth_modal'
            open={auth_openModalForgotPassword}
            onClose={handleCloseModal}
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Form
                onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                className='ForgotPasswordForm FingoShapeRadius'
            >
                {isError && (
                    <div className='text-center mb-1'>
                        <p className='font-bold text-danger'>Account not found</p>
                    </div>
                )}

                {forgotSuccess ? (
                    <div className='ForgotPasswordFormSuccess'>
                        <UnreadEmailSvg className='ForgotIcon' />
                        <h2 className='text-center mb-2'>Check your email</h2>
                        <p className='text-center'>
                            We've send instructions on how to reset your
                            password to <strong>{email}</strong>
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='ForgotPasswordFormHeader mb-4 text-center'>
                            <h2>Forgot password</h2>
                            <p className='text-center'>
                                No worries, we'll send you instructions on how
                                to reset your password by email.
                            </p>
                        </div>

                        <Row className='justify-content-center'>
                            <Col xs={12} className='px-2'>
                                <Controller
                                    name='email'
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Group
                                            className='mb-3'
                                            controlId='formGroupEmail'
                                        >
                                            <Form.Label>Email</Form.Label>
                                            <FingoInput
                                                {...field}
                                                placeholder='Email'
                                                size='lg'
                                                isInvalid={Boolean(
                                                    errors?.email?.message
                                                )}
                                            />
                                            {errors?.email?.message && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors?.email?.message ??
                                                        ''}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    )}
                                />
                                <FingoButton
                                    className='w-100 mb-3'
                                    size='large'
                                    type='submit'
                                    color='success'
                                >
                                    Submit
                                </FingoButton>
                                <a
                                    className='text-center w-100 mt-2 block'
                                    href='#'
                                    onClick={onClickBackToLogin}
                                >
                                    Back to login
                                </a>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </FingoModal>
    )
}
