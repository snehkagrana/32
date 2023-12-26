/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { FingoButton, FingoInput } from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { AuthAPI } from 'src/api'
import { useNavigate, useParams } from 'react-router-dom'

const schema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
})

const initialValues = {
    password: '',
    passwordConfirmation: '',
}

const ResetPasswordForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { email, token } = useParams()

    const [isLoading, setIsLoading] = useState(false)

    const disabledButton = useMemo(() => {
        return isLoading
    }, [isLoading])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    })

    const onValidSubmit = async values => {
        try {
            console.log('onValidSubmit => values =>', values)
            const response = await AuthAPI.resetPassword({
                ...values,
                token,
                email,
            })
            if (response?.message) {
                navigate('/home?success=reset-password')
            }
            console.log('response', response)
        } catch (e) {
            console.log('e', e)
        }
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    return (
        <Form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className='ResetPasswordForm FingoShapeRadius'
        >
            <div className='ResetPasswordFormHeader mb-4 text-center '>
                <h2>Set new password</h2>
                <p>Must be at least 8 characters</p>
            </div>

            <Row className='justify-content-center'>
                <Col xs={12} className='mb-2'>
                    <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                            <Form.Group
                                className='mb-3'
                                controlId='formGroupName'
                            >
                                <Form.Label>New Password</Form.Label>
                                <FingoInput
                                    {...field}
                                    type='password'
                                    size='lg'
                                    placeholder='Password'
                                    isInvalid={Boolean(
                                        errors?.password?.message
                                    )}
                                />
                                {errors?.password?.message && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.password?.message ?? ''}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        )}
                    />
                </Col>
                <Col xs={12} className='mb-2'>
                    <Controller
                        name='passwordConfirmation'
                        control={control}
                        render={({ field }) => (
                            <Form.Group
                                className='mb-3'
                                controlId='formGroupName'
                            >
                                <Form.Label>Confirm Password</Form.Label>
                                <FingoInput
                                    {...field}
                                    size='lg'
                                    type='password'
                                    placeholder='Confirm Password'
                                    isInvalid={Boolean(
                                        errors?.passwordConfirmation?.message
                                    )}
                                />
                                {errors?.passwordConfirmation?.message && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.passwordConfirmation
                                            ?.message ?? ''}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        )}
                    />
                </Col>
                <Col xs={12}>
                    <FingoButton
                        style={{ width: '100%' }}
                        size='large'
                        type='submit'
                        color='success'
                        disabled={disabledButton}
                    >
                        Reset Password
                    </FingoButton>
                </Col>
            </Row>
        </Form>
    )
}

export default ResetPasswordForm
