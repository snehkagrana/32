/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { FingoButton, FingoInput } from 'src/components/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// import LoadingBox from '../LoadingBox'
import { ReactComponent as UploadIcon } from 'src/assets/svg/cloud-upload-sharp.svg'

import Assets from 'src/assets'
import LoadingBox from 'src/components/LoadingBox'
import styled from 'styled-components'

import NotificationItemTypeLabel from './notification-item-type-label'
import { NOTIFICATION_TYPE_LIST } from 'src/constants/notification.constant'
import { NotificationsAPI } from 'src/api'
import NotificationHistoryRecipientItem from './notification-history-recipient-item'

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

const NotificationHistoryDetail = ({ data, onResendNotification }) => {
    const dispatch = useDispatch()
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [defaultImageFile, setDefaultImageFile] = useState(null)

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

    const onValidSubmit = async () => {
        onResendNotification(data)
    }

    const onInvalidSubmit = _errors => {
        console.log('_errors', _errors)
    }

    useEffect(() => {
        if (data?.title) {
            setValue('title', data?.title || '')
            setValue('body', data?.body || '')
            setValue('imageUrl', data?.imageUrl || '')

            if (data?.users?.length > 0) {
                setValue(
                    'users',
                    data.users.map(x => ({
                        userId: x.userId,
                        displayName: x.displayName,
                        imageUrl: x.imgPath || null,
                    }))
                )
            }

            if (data.imageUrl) {
                setImageFile(data.imageUrl)
            }
        } else {
            reset(initialValues)
            setImageFile(null)
            setDefaultImageFile(null)
        }
    }, [data])

    return (
        <Form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className='px-2 FingoShapeRadius'
        >
            <Row className='justify-content-center'>
                <Col xs={12} className='px-2'>
                    <SectionTitle>
                        <h3>Recipients</h3>
                    </SectionTitle>
                    {data?.users?.map(x => (
                        <NotificationHistoryRecipientItem data={x} />
                    ))}
                </Col>
                <Col xs={12} className='px-2'>
                    <FooterSection>
                        <FingoButton type='submit' onClick={handleSubmit}>
                            Resend Notification
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

const SectionTitle = styled.div`
    margin-bottom: 1rem;
    text-align: center;
    h3 {
        font-size: 1.1rem;
        font-weight: bold;
    }
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

export default NotificationHistoryDetail
