import React, { useCallback, useEffect } from 'react'
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
import LoadingBox from 'src/components/LoadingBox'
import RewardCardItem from './RewardCardItem'
import 'src/styles/ModalListReward.styles.css'

const schema = Yup.object().shape({
    name: Yup.string().required('Field required'),
    currencyValue: Yup.string().required('Field required'),
    // currencyCode: Yup.string().required('Field required'),
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

const ModalListReward = () => {
    const dispatch = useDispatch()
    const {
        openModalListReward,
        reward_setOpenModalListReward,
        listRewardIsLoading: isLoading,
        listRewardData: data,
        reward_getList,
    } = useReward()

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    })

    const handleCloseModal = () => {
        dispatch(reward_setOpenModalListReward(false))
    }

    const onClickCancel = () => {
        reset(initialValues)
        handleCloseModal()
    }

    useEffect(() => {
        if (openModalListReward) {
            dispatch(reward_getList())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListReward])

    return (
        <FingoModal
            open={openModalListReward}
            onClose={handleCloseModal}
            centered
            className='ModalListReward'
        >
            <div className='ListRewardContainer FingoShapeRadius'>
                <h2 className='mb-3'>Redeem your gems</h2>
                <p>Select the products you would like to redeem</p>
                <div className='ListReward'>
                    <Row>
                        {isLoading ? (
                            <Col xs={12}>
                                <LoadingBox height={300} />
                            </Col>
                        ) : (
                            <>
                                {data.length > 0 &&
                                    data.map(x => (
                                        <Col
                                            xs={12}
                                            md={6}
                                            key={x._id}
                                            className='mb-3 px-2'
                                        >
                                            <RewardCardItem data={x} />
                                        </Col>
                                    ))}
                            </>
                        )}
                    </Row>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalListReward
