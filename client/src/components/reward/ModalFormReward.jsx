/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useReward } from 'src/hooks'
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
import LoadingBox from '../LoadingBox'
import { ReactComponent as UploadIcon } from 'src/assets/svg/cloud-upload-sharp.svg'
import { ReactComponent as TrashcanIcon } from 'src/assets/svg/trash-bin-trash-linear.svg'
import { ReactComponent as RedeemIcon } from 'src/assets/svg/redeem.svg'
import Assets from 'src/assets'
import toast from 'react-hot-toast'

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
    type: Yup.string().required('Field required'),
    variants: Yup.array(
        Yup.object()
            .shape({
                claimCode: Yup.string().required('Field required'),
                pin: Yup.string().nullable(),
            })
            .required()
    ),
})

const initialValues = {
    name: '',
    description: '',
    brandUrl: '',
    currencyValue: null,
    currencyCode: DROPDOWN_CURRENCY_CODES.find(x => x.value === 'INR'),
    diamondValue: null,
    imageURL: null,
    type: null,
    variants: [
        {
            claimCode: null,
            pin: null,
            isAvailable: true,
        },
        {
            claimCode: null,
            pin: null,
            isAvailable: true,
        },
    ],
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
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    })

    const { fields, insert, update, remove } = useFieldArray({
        control,
        name: 'variants',
    })

    const onValidSubmit = async values => {
        try {
            console.log('onValidSubmit => values =>', values)
            // const response = await RewardApi.admin_createOrUpdateReward(
            //     {
            //         ...values,
            //         _id: isEdit ? modalForm.data?._id : null,
            //         currencyCode: values?.currencyCode?.value || null,
            //         imageURL: imageFile || null,
            //     },
            //     isEdit
            // )
            // if (response?.data) {
            //     Swal.fire({
            //         title: 'Success',
            //         text: 'Reward saved successfully!',
            //         icon: 'success',
            //         showCancelButton: false,
            //         confirmButtonColor: '#009c4e',
            //         confirmButtonText: 'Ok',
            //     }).then(result => {
            //         if (result.isConfirmed) {
            //             onConfirmClose()
            //             dispatch(reward_adminGetList())
            //             reset(initialValues)
            //         }
            //     })
            // }
        } catch (e) {
            console.log('e', e)
        }
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

    const onChangeType = useCallback(
        value => {
            if (!imageFile) {
                switch (value) {
                    case 'amazon':
                        setDefaultImageFile(Assets.GiftCardDefaultAmazon)
                        break
                    case 'paytm':
                        setDefaultImageFile(Assets.GiftCardDefaultPaytm)
                        break
                    case 'flipkart':
                        setDefaultImageFile(Assets.GiftCardDefaultFlipkart)
                        break
                    case 'google play':
                        setDefaultImageFile(Assets.GiftCardDefaultGooglePlay)
                        break
                    default:
                        setDefaultImageFile(Assets.GiftCardDefaultOther)
                        break
                }
            }
        },
        [imageFile, watch('type')]
    )

    const getLogo = type => {
        switch (type) {
            case 'amazon':
                return Assets.AmazonLogo
            case 'paytm':
                return Assets.PaytmLogo
            case 'flipkart':
                return Assets.FlipkartLogo
            case 'google play':
                return Assets.GooglePlayLogo
            default:
                return Assets.GiftBoxIcon
        }
    }

    const onClickAddVariant = index => {
        insert(index, initialValues.variants[0])
    }

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
            setValue('type', modalForm.data.type)
            setValue('variants', modalForm.data.variants)
            if (modalForm.data?.imageURL) {
                setImageFile(modalForm.data.imageURL)
            } else {
                onChangeType(modalForm.data.type)
            }
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [modalForm.data])

    // console.log("getValues('variants')", getValues('variants'))

    const onClickRedeemedByUser = e => {
        e.preventDefault()
        toast.error('Detail user info not available.')
    }

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
                    <Col xs={9} className='px-2 mb-2'>
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
                    <Col xs={12} className='px-2 mt-3'>
                        <Controller
                            name='type'
                            control={control}
                            render={({ field }) => (
                                <Form.Group
                                    className='mb-3'
                                    controlId='formGroupType'
                                >
                                    {/* <Form.Label>Select Type</Form.Label> */}
                                    {DROPDOWN_REWARD_TYPES.map(x => (
                                        <div
                                            className={`RadioType ${
                                                getValues('type') === x.value
                                                    ? 'active'
                                                    : ''
                                            }`}
                                            key={x.value}
                                        >
                                            <Form.Check
                                                {...field}
                                                onChange={() => {
                                                    onChangeType(x.value ?? '')
                                                    setValue('type', x.value)
                                                }}
                                                inline
                                                label={
                                                    <div className='RadioTypeLabel'>
                                                        <img
                                                            src={getLogo(
                                                                x.value
                                                            )}
                                                            alt={x.label}
                                                        />
                                                        <p className='mb-0'>
                                                            {x.label}
                                                        </p>
                                                    </div>
                                                }
                                                name='type'
                                                type='radio'
                                                id={`type-value-${x.value}`}
                                            />
                                        </div>
                                    ))}
                                    {errors?.type?.message && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.type?.message ?? ''}
                                        </Form.Control.Feedback>
                                    )}
                                    {/* <FingoSelect
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
                                    )} */}
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
                                        isInvalid={Boolean(
                                            errors?.name?.message
                                        )}
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
                                        rows={2}
                                        placeholder='Input description'
                                        isInvalid={Boolean(
                                            errors?.description?.message
                                        )}
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
                                        isInvalid={Boolean(
                                            errors?.brandUrl?.message
                                        )}
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
                                        isInvalid={Boolean(
                                            errors?.diamondValue?.message
                                        )}
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
                                        isInvalid={Boolean(
                                            errors?.currencyValue?.message
                                        )}
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
                    <Col xs={12} className='px-2'>
                        <div className='FormRewardVariantContainer'>
                            {fields.length > 0 ? (
                                fields.map((variant, index) => (
                                    <div
                                        className={`FormRewardVariantContent mb-3 ${
                                            !variant.isAvailable
                                                ? 'VariantDisabled'
                                                : ''
                                        }`}
                                        key={String(index)}
                                    >
                                        <Row>
                                            <Col xs={12} className='px-2'>
                                                <div className='FormRewardVariantHeader relative'>
                                                    {variant.isAvailable ? (
                                                        <h6 className='subtitle'>
                                                            Item {index + 1}
                                                        </h6>
                                                    ) : (
                                                        <div className='RedeemedBy flex align-items-center mb-3'>
                                                            <RedeemIcon />
                                                            <p className='mb-0 ml-2'>
                                                                Redeemed By{' '}
                                                                {variant?.redeemedBy && (
                                                                    <a
                                                                        href='#'
                                                                        onClick={e =>
                                                                            onClickRedeemedByUser(
                                                                                e,
                                                                                variant
                                                                                    .redeemedBy
                                                                                    ._id
                                                                            )
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                variant
                                                                                    ?.redeemedBy
                                                                                    .displayName
                                                                            }
                                                                        </strong>
                                                                    </a>
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {fields.length > 1 &&
                                                        variant.isAvailable && (
                                                            <Button
                                                                disabled={
                                                                    !variant.isAvailable
                                                                }
                                                                variant='danger'
                                                                className='TrashBtn'
                                                                onClick={() =>
                                                                    remove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <TrashcanIcon />
                                                            </Button>
                                                        )}
                                                </div>
                                            </Col>
                                            <Col xs={7} className='px-2'>
                                                <Controller
                                                    name={`variants.${index}.claimCode`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Group
                                                            className='mb-1'
                                                            controlId='formGroupclaimCode'
                                                        >
                                                            <Form.Label>
                                                                Claim Code
                                                            </Form.Label>
                                                            <FingoInput
                                                                {...field}
                                                                disabled={
                                                                    !variant.isAvailable
                                                                }
                                                                value={
                                                                    isEdit
                                                                        ? getValues(
                                                                              `variants.${index}.claimCode`
                                                                          )
                                                                        : field.value
                                                                }
                                                                isInvalid={Boolean(
                                                                    errors
                                                                        ?.variants?.[
                                                                        index
                                                                    ]?.claimCode
                                                                        ?.message
                                                                )}
                                                                placeholder='Claim Code'
                                                            />
                                                            {errors?.variants?.[
                                                                index
                                                            ]?.claimCode
                                                                ?.message && (
                                                                <Form.Control.Feedback type='invalid'>
                                                                    {errors
                                                                        ?.variants?.[
                                                                        index
                                                                    ]?.claimCode
                                                                        ?.message ??
                                                                        ''}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Form.Group>
                                                    )}
                                                />
                                            </Col>
                                            <Col xs={5} className='px-2'>
                                                <Controller
                                                    name={`variants.${index}.pin`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Group
                                                            className='mb-1'
                                                            controlId='formGrouppin'
                                                        >
                                                            <Form.Label>
                                                                PIN
                                                            </Form.Label>
                                                            <FingoInput
                                                                {...field}
                                                                disabled={
                                                                    !variant.isAvailable
                                                                }
                                                                value={
                                                                    isEdit
                                                                        ? getValues(
                                                                              `variants.${index}.pin`
                                                                          )
                                                                        : field.value
                                                                }
                                                                isInvalid={Boolean(
                                                                    errors
                                                                        ?.variants?.[
                                                                        index
                                                                    ]?.pin
                                                                        ?.message
                                                                )}
                                                                placeholder='PIN'
                                                            />
                                                            {errors?.variants?.[
                                                                index
                                                            ]?.pin?.message && (
                                                                <Form.Control.Feedback type='invalid'>
                                                                    {errors
                                                                        ?.variants?.[
                                                                        index
                                                                    ]?.pin
                                                                        ?.message ??
                                                                        ''}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Form.Group>
                                                    )}
                                                />
                                            </Col>
                                            {/* <Col xs={12} className='px-2'>
                                                {index !==
                                                    fields.length - 1 && <hr />}
                                            </Col> */}
                                        </Row>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center'>
                                    <p>Variant empty</p>
                                    <FingoButton
                                        onClick={() => onClickAddVariant(0)}
                                    >
                                        Add variant
                                    </FingoButton>
                                </div>
                            )}
                            <Row>
                                <Col xs={12} className='px-2 text-center mb-4'>
                                    <FingoButton
                                        style={{ width: 120 }}
                                        size='sm'
                                        onClick={() =>
                                            onClickAddVariant(fields.length)
                                        }
                                    >
                                        Add Item
                                    </FingoButton>
                                </Col>
                            </Row>
                        </div>
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
