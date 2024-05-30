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
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { DROPDOWN_CURRENCY_CODES, DROPDOWN_REWARD_TYPES } from 'src/libs'
import { RewardApi } from 'src/api'
import Swal from 'sweetalert2'
// import LoadingBox from '../LoadingBox'
import { ReactComponent as UploadIcon } from 'src/assets/svg/cloud-upload-sharp.svg'
import { ReactComponent as TrashcanIcon } from 'src/assets/svg/trash-bin-trash-linear.svg'
import { ReactComponent as RedeemIcon } from 'src/assets/svg/redeem.svg'
import Assets from 'src/assets'
import toast from 'react-hot-toast'
import LoadingBox from 'src/components/LoadingBox'
import styled from 'styled-components'
import ModalNotificationUserRecipient from './modal-notification-user'
import NotificationRecipientItem from './notification-recipient-item'

const schema = Yup.object().shape({
    title: Yup.string().required('Field required'),
    body: Yup.string().required('Field required'),
    users: Yup.array(
        Yup.object().shape({
            userId: Yup.string().required('Field required'),
            displayName: Yup.string().required('Field required'),
            email: Yup.string().required('Field required'),
            imgPath: Yup.string().nullable(true),
        })
    ).min(1),
})

const initialValues = {
    title: '',
    body: '',
    imageUrl: '',
    users: [],
}

const NotificationForm = ({ onSubmit }) => {
    const dispatch = useDispatch()
    const { modalForm, reward_setModalForm, reward_adminGetList } = useReward()
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [defaultImageFile, setDefaultImageFile] = useState(null)

    const {
        selectedUserRecipients,
        openModalUserRecipients,
        notifications_setOpenModalUserRecipients,
    } = useNotifications()

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

    const { fields, insert, update, remove } = useFieldArray({
        control,
        name: 'users',
    })

    const onValidSubmit = async values => {
        onSubmit(values)
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    const onConfirmClose = () => {
        dispatch(reward_setModalForm({ open: false, data: null }))
    }

    const handleCloseModal = () => {
        Swal.fire({
            title: 'Confirm!',
            html: `Are you sure want to close ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async result => {
            if (result.isConfirmed) {
                onConfirmClose()
            }
        })
    }

    const onClickCancel = () => {
        reset(initialValues)
        handleCloseModal()
    }

    const handleUploadImage = useCallback(
        async body => {
            setIsLoadingUpload(true)
            try {
                const response = await RewardApi.upload(body)
                if (response?.data) {
                    setImageFile(response.data)
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
            formData.append('photo', file)
            handleUploadImage(formData)
        }
    }

    useEffect(() => {
        if (selectedUserRecipients?.length > 0) {
            setTimeout(() => {
                setValue(
                    'users',
                    selectedUserRecipients.map(x => ({
                        userId: x.userId,
                        displayName: x.displayName,
                        email: x.email,
                    }))
                )
            }, 350)
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [selectedUserRecipients])

    useEffect(() => {
        if (selectedUserRecipients?.length > 0) {
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [selectedUserRecipients])

    const onClickAddRecipients = useCallback(() => {
        dispatch(notifications_setOpenModalUserRecipients(true))
    }, [openModalUserRecipients])

    // prettier-ignore
    const onSubmitRecipients = useCallback(values => {
        setValue('users', values.map(x => ({
            userId: x._id,
            displayName: x.displayName || '-',
            email: x.email,
            imgPath: x.imgPath || null 
        }))) 
    }, [openModalUserRecipients])

    return (
        <Fragment>
            <Form
                onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                className='px-2 FingoShapeRadius'
            >
                <Row className='justify-content-center'>
                    <Col
                        xs={9}
                        className='px-2 mb-2'
                        style={{ display: 'none' }}
                    >
                        <div className='ModalRewardUploadContainer'>
                            <label htmlFor='uploadImage'>
                                <div className='UploadImageMarker'>
                                    <UploadIcon />
                                    <p className='mb-0'>Browse to upload</p>
                                </div>
                            </label>
                            <input
                                id='uploadImage'
                                type='file'
                                onChange={onChangeImage}
                            />
                            <div className='ModalRewardUploadImg'>
                                {!imageFile && !defaultImageFile && (
                                    <img
                                        src={Assets.PlaceholderImg}
                                        alt='placeholder'
                                    />
                                )}
                                {imageFile ? (
                                    <img src={imageFile} alt='img' />
                                ) : (
                                    <>
                                        {defaultImageFile && (
                                            <img
                                                src={defaultImageFile}
                                                alt='img'
                                            />
                                        )}
                                    </>
                                )}
                                {isLoadingUpload && (
                                    <div className='ModalRewardUploadLoading'>
                                        <LoadingBox height={220} />
                                    </div>
                                )}
                            </div>
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

                    <Col xs={12} className='px-2'>
                        {/* prettier-ignore */}
                        <UserRecipientBox>
                            { fields.length > 0 && (
                                <div className='text-center'>
                                    <p>Notification Recipients</p>
                                </div>
                            )}
                            {fields.length > 0 ? fields.map((variant, index) => (
                                <UserRecipientItem key={String(index)}>
                                    <NotificationRecipientItem
                                        data={variant}
                                        checked={true}
                                        canChecked={false}
                                    />
                                    <Button variant='danger' className='TrashBtn' onClick={() => remove(index)}>
                                        <TrashcanIcon />
                                    </Button>
                                </UserRecipientItem>
                            )) : (
                                <div className='text-center'>
                                    <p>No Notification Recipients</p>
                                </div>
                            )}
                            
                            <Row>
                                { errors?.users?.message && (
                                    <Col xs={12} className='px-2 text-center'>
                                        <BoxErrorRecipients>
                                                <p style={{ marginBottom: 0, color: '#fff' }}>
                                                    {String(errors?.users?.message)}
                                                </p> 
                                        </BoxErrorRecipients>
                                    </Col>
                                )}

                                <Col xs={12} className='px-2 text-center'>
                                    <FingoButton
                                        type='button'
                                        onClick={onClickAddRecipients}
                                        style={{ width: 220 }}
                                    >
                                        Add Recipients
                                    </FingoButton>
                                </Col>
                            </Row>
                        </UserRecipientBox>
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
                                        isInvalid={Boolean(
                                            errors?.title?.message
                                        )}
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
                                        isInvalid={Boolean(
                                            errors?.body?.message
                                        )}
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
                                SEND NOTIFICATION
                            </FingoButton>
                        </FooterSection>
                    </Col>
                </Row>
            </Form>
            <ModalNotificationUserRecipient
                defaultValues={getValues('users')}
                onSubmit={onSubmitRecipients}
            />
        </Fragment>
    )
}

const UserRecipientBox = styled.div`
    border-radius: 0.3rem;
    border: 1px solid #ececec;
    padding: 1.5rem 1rem;
    margin-bottom: 1.2rem;
`

const UserRecipientItem = styled.div`
    position: relative;
    .TrashBtn {
        position: absolute;
        top: 10px;
        right: 10px;
        height: 26px;
        width: 26px;
        border-radius: 26px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

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

const BoxErrorRecipients = styled.div`
    border: 1px solid #da0000;
    background-color: #ff5050;
    padding: 0.5rem;
    border-radius: 0.4rem;
    margin-bottom: 1rem;
`

export default NotificationForm
