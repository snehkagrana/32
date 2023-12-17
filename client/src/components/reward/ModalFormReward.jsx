/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useReward } from 'src/hooks'
import {
    FingoButton,
    FingoInput,
    FingoModal,
    FingoSelect,
} from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { DROPDOWN_CURRENCY_CODES, DROPDOWN_REWARD_TYPES } from 'src/libs'
import { RewardApi } from 'src/api'
import Swal from 'sweetalert2'
import AmazonImg from 'src/assets/images/giftcard/amazon.jpg'
import GooglePlayImg from 'src/assets/images/giftcard/google-play.jpg'
import OtherImg from 'src/assets/images/giftcard/other.jpg'
import PlaceholderImg from 'src/assets/images/placeholder.png'
import LoadingBox from '../LoadingBox'
import { ReactComponent as UploadIcon } from 'src/assets/svg/cloud-upload-sharp.svg'

const schema = Yup.object().shape({
    name: Yup.string().required('Field required'),
    description: Yup.string().nullable(),
    brandUrl: Yup.string().nullable(),
    currencyValue: Yup.string().required('Field required'),
    currencyCode: Yup.object().shape({
        value: Yup.string().required('Field required'),
        label: Yup.string().required('Field required'),
    }),
    diamondValue: Yup.string().required('Field required'),
    imageURL: Yup.string().nullable(),
    claimCode: Yup.string().required('Field required'),
    pin: Yup.string().nullable(),
    type: Yup.object().shape({
        value: Yup.string().required('Field required'),
        label: Yup.string().required('Field required'),
    }),
})

const initialValues = {
    name: '',
    description: '',
    brandUrl: '',
    currencyValue: null,
    currencyCode: DROPDOWN_CURRENCY_CODES.find(x => x.value == 'INR'),
    diamondValue: null,
    imageURL: null,
    claimCode: null,
    pin: null,
    type: null,
}

const ModalFormReward = () => {
    const dispatch = useDispatch()
    const { modalForm, reward_setModalForm, reward_adminGetList } = useReward()
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [defaultImageFile, setDefaultImageFile] = useState(null)

    const isEdit = useMemo(() => {
        return Boolean(modalForm.data?._id)
    }, [modalForm.data])

    const disabledButton = useMemo(() => {
        return isLoadingUpload
    }, [isLoadingUpload])

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    })

    const onValidSubmit = async values => {
        try {
            const response = await RewardApi.admin_createReward({
                ...values,
                currencyCode: values?.currencyCode?.value || null,
                type: values?.type?.value || null,
                imageURL: imageFile || null,
            })
            if (response?.data?._id) {
                Swal.fire({
                    title: 'Success',
                    text: 'Reward saved successfully!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#009c4e',
                    confirmButtonText: 'Ok',
                }).then(result => {
                    if (result.isConfirmed) {
                        handleCloseModal()
                        dispatch(reward_adminGetList())
                        reset(initialValues)
                    }
                })
            }
        } catch (e) {
            console.log('e', e)
        }
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    const handleCloseModal = () => {
        dispatch(reward_setModalForm({ open: false, data: null }))
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
            // setImageFile(URL.createObjectURL(file))
            handleUploadImage(formData)
        }
    }

    const onChangeType = useCallback(
        value => {
            if (!imageFile) {
                console.log('value', value)
                switch (value) {
                    case 'amazon':
                        setDefaultImageFile(AmazonImg)
                        break
                    case 'google play':
                        setDefaultImageFile(GooglePlayImg)
                        break
                    default:
                        setDefaultImageFile(OtherImg)
                        break
                }
            }
        },
        [imageFile, watch('type')]
    )

    useEffect(() => {
        if (modalForm.open && modalForm.data) {
            setValue('name', modalForm.data.name)
            setValue('description', modalForm.data.description)
            setValue('brandUrl', modalForm.data.brandUrl)
            setValue('currencyValue', modalForm.data.currencyValue)
            setValue(
                'currencyCode',
                DROPDOWN_CURRENCY_CODES.find(
                    x => x.value === modalForm.data.currencyCode
                )
            )
            setValue('diamondValue', modalForm.data.diamondValue)
            setValue('imageURL', modalForm.data.imageURL)
            setValue('claimCode', modalForm.data.claimCode)
            setValue('pin', modalForm.data.pin)
            setValue(
                'type',
                DROPDOWN_REWARD_TYPES.find(x => x.value === modalForm.data.type)
            )
        } else {
            reset(initialValues)
        }
    }, [modalForm])

    return (
        <FingoModal
            open={modalForm.open}
            onClose={handleCloseModal}
            centered
            className='ModalFormReward'
        >
            <Form
                onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                className='FormReward FingoShapeRadius'
            >
                <div className='mb-4'>
                    <h2>{isEdit ? 'Edit Gift Card' : 'Add Gift Card'}</h2>
                </div>

                <Row className='justify-content-center'>
                    <Col xs={7} className='px-2 mb-2'>
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
                                        src={PlaceholderImg}
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
                        </div>
                    </Col>
                    <Col xs={12} className='px-2'>
                        <Controller
                            name='type'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupType'
                                >
                                    <Form.Label>Select Type</Form.Label>
                                    <FingoSelect
                                        {...field}
                                        onChange={value => {
                                            onChangeType(value?.value ?? '')
                                            field.onChange(value)
                                        }}
                                        options={DROPDOWN_REWARD_TYPES}
                                        placeholder='Select Type'
                                    />
                                    {errors?.type?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.type?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} className='px-2'>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupName'
                                >
                                    <Form.Label>Name</Form.Label>
                                    <FingoInput
                                        {...field}
                                        placeholder='Input name'
                                    />
                                    {errors?.name?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.name?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} className='px-2'>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupName'
                                >
                                    <Form.Label>Desc</Form.Label>
                                    <FingoInput
                                        {...field}
                                        as='textarea'
                                        rows={3}
                                        placeholder='Input description'
                                    />
                                    {errors?.description?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.description?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} className='px-2'>
                        <Controller
                            name='brandUrl'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupName'
                                >
                                    <Form.Label>Brand URL</Form.Label>
                                    <FingoInput
                                        {...field}
                                        placeholder='Input brand url'
                                    />
                                    {errors?.brandUrl?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.brandUrl?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                    <Form.Control.Feedback type='valid'>
                                        eg: www.amazon.com
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} md={4} className='px-2'>
                        <Controller
                            name='diamondValue'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupDiamondValue'
                                >
                                    <Form.Label>Diamond Value</Form.Label>
                                    <FingoInput
                                        {...field}
                                        placeholder='Diamond Value'
                                    />
                                    {errors?.diamondValue?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.diamondValue?.message ??
                                                ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <Controller
                            name='currencyValue'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupCurrencyValue'
                                >
                                    <Form.Label>Currency Value</Form.Label>
                                    <FingoInput
                                        {...field}
                                        placeholder='Currency Value'
                                    />
                                    {errors?.currencyValue?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.currencyValue?.message ??
                                                ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} md={4} className='px-2'>
                        <Controller
                            name='currencyCode'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupType'
                                >
                                    <Form.Label>Select Type</Form.Label>
                                    <FingoSelect
                                        {...field}
                                        options={DROPDOWN_CURRENCY_CODES}
                                        placeholder='Select Type'
                                    />
                                    {errors?.currencyCode?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.currencyCode?.message ??
                                                ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} md={6} className='px-2'>
                        <Controller
                            name='claimCode'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupclaimCode'
                                >
                                    <Form.Label>Claim Code</Form.Label>
                                    <FingoInput
                                        {...field}
                                        placeholder='Claim Code'
                                    />
                                    {errors?.claimCode?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.claimCode?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} md={6} className='px-2'>
                        <Controller
                            name='pin'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGrouppin'
                                >
                                    <Form.Label>PIN</Form.Label>
                                    <FingoInput {...field} placeholder='PIN' />
                                    {errors?.pin?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.pin?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            )}
                        />
                    </Col>
                    <Col xs={12} className='mt-4'>
                        <Row>
                            <Col xs={12} md={6}>
                                <FingoButton
                                    style={{ width: '100%' }}
                                    size='large'
                                    variant='link'
                                    type='button'
                                    onClick={onClickCancel}
                                    disabled={disabledButton}
                                >
                                    Cancel
                                </FingoButton>
                            </Col>
                            <Col xs={12} md={6}>
                                <FingoButton
                                    style={{ width: '100%' }}
                                    size='large'
                                    type='submit'
                                    color='success'
                                    disabled={disabledButton}
                                >
                                    Save
                                </FingoButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </FingoModal>
    )
}

export default ModalFormReward
