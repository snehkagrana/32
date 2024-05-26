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
import { NotificationsAPI } from 'src/api'

const schema = Yup.object().shape({
    title: Yup.string().required('Field required').max(120),
    body: Yup.string().required('Field required').max(200),
    type: Yup.string().required('Field required'),
    imageUrl: Yup.string().nullable(),
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
        onSubmit({ ...values })
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    useEffect(() => {
        if (defaultValue?.title) {
            setValue('title', defaultValue?.title || '')
            setValue('body', defaultValue?.body || '')
            setValue('imageUrl', defaultValue?.imageUrl || '')

            if (defaultValue.imageUrl) {
                setImageFile(defaultValue.imageUrl)
            }
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
        setValue('type', type)
    }

    const handleUploadImage = useCallback(
        async body => {
            setIsLoadingUpload(true)
            try {
                const response = await NotificationsAPI.admin_uploadImage(body)
                if (response?.data) {
                    setImageFile(response.data)
                    setValue('imageUrl', response.data)
                }
                setIsLoadingUpload(false)
            } catch (e) {
                setImageFile(null)
                console.log('e', e)
                setIsLoadingUpload(false)
            }
        },
        [imageFile, defaultImageFile]
    )

    const onChangeImage = e => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('image', file)
            handleUploadImage(formData)
        }
    }

    return (
        <Form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className='px-2 FingoShapeRadius'
        >
            <Row className='justify-content-center'>
                <Col xs={9} className='px-2 mb-3'>
                    <UploadContainer>
                        <label htmlFor='uploadImage'>
                            <UploadImageMarker>
                                <UploadIcon />
                                <p className='mb-0'>Browse to upload</p>
                            </UploadImageMarker>
                        </label>
                        <input
                            id='uploadImage'
                            type='file'
                            onChange={onChangeImage}
                            accept='.png,.jpg,.jpeg'
                        />
                        <UploadImage>
                            {!imageFile && !defaultImageFile && (
                                <img src={Assets.NoImg} alt='placeholder' />
                            )}
                            {imageFile ? (
                                <img src={imageFile} alt='img' />
                            ) : (
                                <>
                                    {defaultImageFile && (
                                        <img src={defaultImageFile} alt='img' />
                                    )}
                                </>
                            )}
                            {isLoadingUpload && (
                                <UploadLoading>
                                    <LoadingBox height={220} />
                                </UploadLoading>
                            )}
                        </UploadImage>
                    </UploadContainer>
                    {!imageFile && (
                        <UploadHint>
                            <p>Recommended square image</p>
                        </UploadHint>
                    )}
                    <div>
                        {imageFile && (
                            <div className='mt-2 mb-3 text-center'>
                                <FingoButton
                                    onClick={() => {
                                        setImageFile(null)
                                    }}
                                    size='sm'
                                    color='danger'
                                >
                                    Remove Image
                                </FingoButton>
                            </div>
                        )}
                    </div>
                </Col>

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
                    {errors?.type?.message && (
                        <InvalidType>{errors?.type?.message ?? ''}</InvalidType>
                    )}
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

const UploadContainer = styled.div`
    position: relative;
    width: 240px;
    max-height: 240px;
    overflow: hidden;
    margin: auto;
    label {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        flex-direction: column;
        background: rgb(255 255 255 / 0%);
        align-items: center;
        justify-content: center;
        font-size: 15px;
        color: #fff;
        font-weight: 700;
    }
    &:hover label {
        display: flex;
    }
    label svg {
        width: 32px;
        height: auto;
    }
    input {
        display: none;
    }
`

const UploadImage = styled.div`
    border-radius: 12px;
    overflow: hidden;
    line-height: 0;
    border: 2px solid rgb(109 109 109 / 10%);
    img {
        width: 100%;
        height: auto;
    }
`
const UploadLoading = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(103 103 103 / 30%);
    border-radius: 12px;
`
const UploadImageMarker = styled.div`
    display: flex;
    flex-direction: column;
    background: #0063ff;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px 16px;
    cursor: pointer;
`
const UploadHint = styled.div`
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    margin-top: 0.5rem;
`

const InvalidType = styled.div`
    font-size: 13px;
    font-weight: bold;
    color: #dc3545;
    text-align: center;
    margin-top: -10px;
    margin-bottom: 1rem;
`

export default NotificationTemplateForm
