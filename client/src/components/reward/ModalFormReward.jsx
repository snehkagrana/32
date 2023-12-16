import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useReward } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { DROPDOWN_CURRENCY_CODES, DROPDOWN_REWARD_TYPES } from 'src/libs'
import Select from 'react-select'
import { RewardApi } from 'src/api'
import Swal from 'sweetalert2'

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

    const {
        control,
        reset,
        handleSubmit,
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
                    <h2>Add Gift Card</h2>
                </div>
                <Row className='row'>
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
                                    <Select
                                        {...field}
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
                                    <Form.Control
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
                                    <Form.Control
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
                                    <Form.Control
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
                                    <Form.Control
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
                                    <Form.Control
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
                                    <Select
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
                                    <Form.Control
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
                                    <Form.Control
                                        {...field}
                                        placeholder='PIN'
                                    />
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
                                    color='success'
                                    type='button'
                                    onClick={onClickCancel}
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
