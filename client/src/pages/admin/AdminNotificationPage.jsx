import React, { useEffect, useCallback } from 'react'
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
import NotificationForm from 'src/components/admin/notifications/notification-form'
import Swal from 'sweetalert2'

const AdminNotificationPage = () => {
    const dispatch = useDispatch()
    const { notifications_getNotificationRecipients } = useNotifications()

    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/home')
    }

    const _getNotificationRecipients = params => {
        dispatch(notifications_getNotificationRecipients(params))
    }

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            _getNotificationRecipients()
        } else {
            navigate(`/accessdenied`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated])

    const onSubmit = useCallback(async values => {
        console.log('----', values)
        try {
            // prettier-ignore
            const users = values?.users?.map(x => ({
                userId: x.userId,
                displayName: x.displayName,
                email: x.email,
            })) || []

            const submitValues = {
                title: values.title,
                body: values.body,
                imageUrl: null,
                users,
            }

            // prettier-ignore
            const response = await NotificationsAPI.admin_sendGeneralNotifications(submitValues)
            if (response) {
                Swal.fire({
                    title: 'Success',
                    text: 'Notification send successfully!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#009c4e',
                    confirmButtonText: 'Ok',
                }).then(result => {
                    if (result.isConfirmed) {
                    }
                })
            }
        } catch (e) {
            Swal.fire({
                title: 'Opss..',
                text: 'Failed to send notifications!',
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

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Notifications</title>
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
                                        <div>
                                            <h2 className='mb-3, text-center'>
                                                Notifications
                                            </h2>
                                        </div>
                                    </div>
                                    <NotificationForm onSubmit={onSubmit} />
                                    <FingoScrollToTop />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </FingoHomeLayout>
    )
}

export default AdminNotificationPage
