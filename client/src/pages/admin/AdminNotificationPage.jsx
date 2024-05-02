import React, { useEffect, useCallback, Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import { FingoScrollToTop } from 'src/components/layouts/FingoHomeLayout'
import { useAuth, useNotifications, useReward } from 'src/hooks'
import 'src/styles/AdminReward.styles.css'
import { ReactComponent as BackIcon } from 'src/assets/svg/back.svg'
import { useDispatch } from 'react-redux'
import { FingoButton, FingoInput } from 'src/components/core'
import { ModalFormReward } from 'src/components/reward'
import ModalRewardDetail from 'src/components/reward/ModalRewardDetail'
import { ModalVerifyAction } from 'src/components/admin'
import ModalInfoEarnDiamond from 'src/components/reward/ModalInfoEarnDiamond'
import ModalListMyReward from 'src/components/reward/ModalListMyReward'
import ModalClaimReward from 'src/components/reward/ModalClaimReward'
import NotificationRecipientItem from 'src/components/admin/test-dnd/notifications/notification-recipient-item'
import { NotificationsAPI } from 'src/api'
import styled from 'styled-components'

const AdminNotificationPage = () => {
    const dispatch = useDispatch()
    const {
        reward_adminGetList,
        modalForm,
        reward_setModalForm,
        adminListRewardData,
        adminListRewardIsLoading,
    } = useReward()

    const [values, setValues] = useState('')

    const {
        notifications_getNotificationRecipients,
        notificationRecipientsData,
    } = useNotifications()

    const [checkedItems, setCheckedItems] = useState([])

    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/home')
    }

    const onClickAddNew = useCallback(() => {
        dispatch(reward_setModalForm({ open: true, data: null }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalForm])

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

    const onCheckItem = useCallback(
        item => {
            // alert('CALL ME')
            // let nextValues = checkedItems
            // nextValues.push(item)
            setCheckedItems([item])
        },
        [checkedItems]
    )

    const handleSubmit = useCallback(async () => {
        try {
            const submitValues = {
                title: values.title,
                body: values.body,
                imageUrl: null,
                users: checkedItems.map(user => ({
                    userId: user._id,
                    displayName: user.displayName || user.username,
                    email: user.email || '',
                })),
            }

            const response =
                await NotificationsAPI.admin_sendGeneralNotifications(
                    submitValues
                )
            if (response) {
                console.log('response')
            }
        } catch (e) {
            alert('Failed to send notification')
        }
    }, [checkedItems, values])

    console.log('checkedItems', checkedItems)

    const onChangeValue = (property, value) => {
        setValues({
            ...values,
            [property]: value,
        })
    }

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
                                            <FingoButton
                                                color='white'
                                                onClick={onClickAddNew}
                                            >
                                                Add New Item
                                            </FingoButton>
                                        </div>
                                    </div>

                                    {Array.isArray(
                                        notificationRecipientsData
                                    ) &&
                                    notificationRecipientsData.length > 0 ? (
                                        <Fragment>
                                            {notificationRecipientsData.map(
                                                (item, index) => (
                                                    <NotificationRecipientItem
                                                        key={String(index)}
                                                        data={item}
                                                        checked={checkedItems.find(
                                                            x =>
                                                                x._id ===
                                                                item._id
                                                        )}
                                                        onCheck={onCheckItem}
                                                    />
                                                )
                                            )}
                                        </Fragment>
                                    ) : (
                                        <div>
                                            <p>Users not found</p>
                                        </div>
                                    )}

                                    <FormSection>
                                        <FingoInput
                                            as='textarea'
                                            rows={3}
                                            name='title'
                                            value={values.title}
                                            placeholder='Notification title'
                                            onChange={e =>
                                                onChangeValue(
                                                    'title',
                                                    e.target.value
                                                )
                                            }
                                            style={{ marginBottom: '1rem' }}
                                        />
                                        <FingoInput
                                            as='textarea'
                                            rows={3}
                                            placeholder='Notification body...'
                                            value={values.body}
                                            onChange={e =>
                                                onChangeValue(
                                                    'body',
                                                    e.target.value
                                                )
                                            }
                                            style={{ marginBottom: '2rem' }}
                                        />
                                    </FormSection>
                                    <FooterSection>
                                        <FingoButton onClick={handleSubmit}>
                                            Test Send Notifications
                                        </FingoButton>
                                    </FooterSection>

                                    <FingoScrollToTop />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
            <ModalFormReward />
            <ModalRewardDetail />
            <ModalVerifyAction />
            <ModalInfoEarnDiamond />
            <ModalListMyReward />
            <ModalClaimReward />
        </FingoHomeLayout>
    )
}

const FooterSection = styled.div`
    width: 320px;
    display: flex;
    align-self: center;
    margin-top: 2rem;
`

const FormSection = styled.div`
    width: 600px;
    display: flex;
    flex-direction: column;
    align-self: center;
    margin-top: 2rem;
    input {
        margin-bottom: 1.2rem;
    }
`

export default AdminNotificationPage
