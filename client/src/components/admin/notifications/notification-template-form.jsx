/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNotifications, useReward } from 'src/hooks'
import {
    FingoButton,
    FingoInput,
    FingoModal,
    FingoSelect,
} from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// import LoadingBox from '../LoadingBox'
import { ReactComponent as UploadIcon } from 'src/assets/svg/cloud-upload-sharp.svg'
import { ReactComponent as TrashcanIcon } from 'src/assets/svg/trash-bin-trash-linear.svg'
import { ReactComponent as RedeemIcon } from 'src/assets/svg/redeem.svg'
import Assets from 'src/assets'
import LoadingBox from 'src/components/LoadingBox'
import styled from 'styled-components'

import NotificationItemTypeLabel from './notification-item-type-label'
import { NOTIFICATION_TYPE_LIST } from 'src/constants/notification.constant'

const schema = Yup.object().shape({
    title: Yup.string().required('Field required'),
    body: Yup.string().required('Field required'),
    type: Yup.string().required('Field required'),
})

const initialValues = {
    title: '',
    body: '',
    imageUrl: '',
    type: '',
    users: [],
}

const NotificationTemplateForm = ({ onSubmit, defaultValue }) => {
    const dispatch = useDispatch()
    const { reward_setModalForm } = useReward()
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [defaultImageFile, setDefaultImageFile] = useState(null)

    const { selectedUserRecipients } = useNotifications()

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    })

    const onValidSubmit = async values => {
        console.log('values', values)
        // onSubmit({ ...values, imageUrl: null })
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    useEffect(() => {
        if (defaultValue?.title) {
            setValue('title', defaultValue?.title || '')
            setValue('body', defaultValue?.body || '')
            setValue('imageUrl', defaultValue?.imageUrl || '')
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [defaultValue])

    useEffect(() => {
        if (selectedUserRecipients?.length > 0) {
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [selectedUserRecipients])

    const onSelectType = type => {
        console.log('type->', type)
        setValue('type', type)
    }

    return (
        <Form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className='px-2 FingoShapeRadius'
        >
            <Row className='justify-content-center'>
                <Col xs={12}>
                    <NotificationTypeContainer className='FingoShapeRadius FingoBorders'>
                        {NOTIFICATION_TYPE_LIST.map(x => (
                            <NotificationItem key={x.value}>
                                <NotificationItemTypeLabel
                                    onClick={onSelectType}
                                    type={x.value}
                                    isSelected={watch('type') === x.value}
                                />
                            </NotificationItem>
                        ))}
                    </NotificationTypeContainer>
                </Col>
                <Col xs={12} className='px-2'>
                    <BoxHint>
                        <p style={{ marginBottom: 0, color: '#000' }}>
                            Use this template string to mention user{' '}
                            <strong>[[NAME]], [[EMAIL]]</strong>
                        </p>
                    </BoxHint>
                </Col>
                <Col xs={12} className='px-2'>
                    <Controller
                        name='title'
                        control={control}
                        render={({ field }) => (
                            <Form.Group
                                className='mb-3'
                                controlId='formGroupName'
                            >
                                <Form.Label>Notification Title</Form.Label>
                                <FingoInput
                                    {...field}
                                    as='textarea'
                                    rows={2}
                                    placeholder='Input title'
                                    isInvalid={Boolean(errors?.title?.message)}
                                />
                                {errors?.title?.message && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.title?.message ?? ''}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        )}
                    />
                </Col>
                <Col xs={12} className='px-2'>
                    <Controller
                        name='body'
                        control={control}
                        render={({ field }) => (
                            <Form.Group
                                className='mb-3'
                                controlId='formGroupName'
                            >
                                <Form.Label>Notification Body</Form.Label>
                                <FingoInput
                                    {...field}
                                    as='textarea'
                                    rows={3}
                                    placeholder='Notification Body'
                                    isInvalid={Boolean(errors?.body?.message)}
                                />
                                {errors?.body?.message && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors?.body?.message ?? ''}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        )}
                    />
                </Col>
                <Col xs={12} className='px-2'>
                    <FooterSection>
                        <FingoButton type='submit' onClick={handleSubmit}>
                            SAVE NOTIFICATION
                        </FingoButton>
                    </FooterSection>
                </Col>
            </Row>
        </Form>
    )
}

const FooterSection = styled.div`
    display: flex;
    align-self: center;
    justify-content: center;
    margin-top: 1rem;
`

const BoxHint = styled.div`
    border: 1px solid #00aeff;
    background-color: #c6deff;
    padding: 0.5rem;
    border-radius: 0.4rem;
    margin-bottom: 1rem;
`

const NotificationTypeContainer = styled.div`
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
`

const NotificationItem = styled.div`
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
`

export default NotificationTemplateForm
