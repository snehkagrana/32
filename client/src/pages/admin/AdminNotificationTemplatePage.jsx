import React, { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import { FingoScrollToTop } from 'src/components/layouts/FingoHomeLayout'
import { useAuth, useNotifications } from 'src/hooks'
import 'src/styles/AdminReward.styles.css'
import { ReactComponent as BackIcon } from 'src/assets/svg/back.svg'
import { useDispatch } from 'react-redux'
import { NotificationsAPI } from 'src/api'
import Swal from 'sweetalert2'
import NotificationTemplateItem from 'src/components/admin/notifications/notification-template-item'
import { FingoButton, FingoModalSlider } from 'src/components/core'
import NotificationTemplateForm from 'src/components/admin/notifications/notification-template-form'
import styled from 'styled-components'
import { isElement } from 'react-dom/test-utils'

const AdminNotificationTemplatePage = () => {
    const dispatch = useDispatch()

    const [openModalForm, setOpenModalForm] = useState(false)
    const [formValues, setFormValues] = useState(null)

    const onCloseModalForm = useCallback(() => {
        setOpenModalForm(false)
        setFormValues(null)
    }, [])

    const {
        notifications_getListNotificationTemplate,
        listNotificationTemplateData,
    } = useNotifications()

    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(-1)
    }

    const _getNotificationTemplates = params => {
        dispatch(notifications_getListNotificationTemplate(params))
    }

    const onClickAddTemplate = useCallback(() => {
        setFormValues(null)
        setTimeout(() => {
            setOpenModalForm(true)
        }, 250)
    }, [])

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            _getNotificationTemplates()
        } else {
            navigate(`/accessdenied`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated])

    const onSubmitForm = useCallback(async values => {
        const isEdit = Boolean(values?._id)
        try {
            // prettier-ignore
            const response = await NotificationsAPI.admin_createOrUpdateNotificationTemplate(values)
            if (response) {
                _getNotificationTemplates()
                Swal.fire({
                    title: 'Success',
                    text: `Notification template has been ${
                        isEdit ? 'updated' : 'created'
                    }!`,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#009c4e',
                    confirmButtonText: 'Ok',
                }).then(result => {
                    if (result.isConfirmed) {
                        setOpenModalForm(false)
                        setFormValues(null)
                    }
                })
            }
        } catch (e) {
            Swal.fire({
                title: 'Opss..',
                text: `Failed to ${
                    isEdit ? 'update' : 'create'
                } notification template!`,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#9c0017',
                confirmButtonText: 'Ok',
            }).then(result => {
                if (result.isConfirmed) {
                }
            })
        }
    }, [])

    const onEditTemplate = useCallback(data => {
        setFormValues({
            title: data.title,
            body: data.body,
            imageUrl: data.imageUrl,
        })
        setTimeout(() => {
            setOpenModalForm(true)
        }, 250)
    }, [])

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>(Admin) Notification Templates</title>
            </Helmet>
            <Container fluid>
                <div className='row justify-center h-auto'>
                    <div className='col-12 col-md-10 col-lg-8'>
                        <Row className='justify-content-md-center'>
                            <Col>
                                <div className='AdminRewardContainer'>
                                    <div className='AdminRewardHeader mb-4'>
                                        <button
                                            className='back-arrow'
                                            onClick={handleClick}
                                        >
                                            <BackIcon />
                                        </button>
                                        <div style={{ textAlign: 'center' }}>
                                            <h2 className='mb-3, text-center'>
                                                Notification Template
                                            </h2>
                                            <FingoButton
                                                color='white'
                                                onClick={onClickAddTemplate}
                                            >
                                                Add Template
                                            </FingoButton>
                                        </div>
                                    </div>

                                    {listNotificationTemplateData?.length > 0 &&
                                        listNotificationTemplateData?.map(
                                            (x, index) => (
                                                <NotificationTemplateItem
                                                    fetchData={
                                                        _getNotificationTemplates
                                                    }
                                                    key={String(index)}
                                                    data={x}
                                                    onEdit={onEditTemplate}
                                                />
                                            )
                                        )}
                                    <FingoScrollToTop />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>

            <FingoModalSlider
                open={openModalForm}
                onClose={onCloseModalForm}
                width={600}
            >
                <ModalWrapper className='FingoBackground'>
                    <ModalBox>
                        <div className='mb-4'>Notification Template</div>
                        <NotificationTemplateForm
                            defaultValue={formValues}
                            onSubmit={onSubmitForm}
                        />
                    </ModalBox>
                </ModalWrapper>
            </FingoModalSlider>
        </FingoHomeLayout>
    )
}

const ModalWrapper = styled.div`
    overflow-y: scroll;
    min-height: 100vh;
`

const ModalBox = styled.div`
    border-radius: 0.4rem;
    padding: 1.5rem 2rem;
`

export default AdminNotificationTemplatePage
