import React, { useEffect, useCallback, useState, Fragment } from 'react'
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
import { FingoButton, FingoModalSlider } from 'src/components/core'
import styled from 'styled-components'
import { breakpoints } from 'src/utils/breakpoints.util'
import NotificationHistoryItem from 'src/components/admin/notifications/notification-history-item'
import LoadingBox from 'src/components/LoadingBox'
import NotificationHistoryDetail from 'src/components/admin/notifications/notification-history-detail'
import dayjs from 'dayjs'
import { NOTIFICATION_TYPE_LIST } from 'src/constants/notification.constant'
import NotificationItemTypeLabel from 'src/components/admin/notifications/notification-item-type-label'

const AdminNotificationHistoryPage = () => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [openModalForm, setOpenModalForm] = useState(false)
    const [detailData, setDetailData] = useState(null)
    const [filters, setFilters] = useState({ type: null })

    const [data, setData] = useState()

    const onCloseModalForm = useCallback(() => {
        setIsLoading(false)
        setDetailData(null)
        setOpenModalForm(false)
    }, [])

    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(-1)
    }

    const fetchNotificationHistory = async params => {
        try {
            // prettier-ignore
            const response = await NotificationsAPI.admin_getListNotificationHistory(params)
            if (response) {
                if (response?.data?.length > 0) {
                    // this gives an object with dates as keys
                    const groups = response.data.reduce(
                        (groups, notification) => {
                            const date = notification.createdAt.split('T')[0]
                            if (!groups[date]) {
                                groups[date] = []
                            }
                            groups[date].push(notification)
                            return groups
                        },
                        {}
                    )

                    // Edit: to add it in the array format instead
                    const groupArrays = Object.keys(groups).map(date => {
                        return {
                            date,
                            notifications: groups[date],
                        }
                    })

                    setData(groupArrays)
                }
            }
        } catch (e) {}
    }

    const onClickAddTemplate = useCallback(() => {
        setDetailData(null)
        setTimeout(() => {
            setOpenModalForm(true)
        }, 250)
    }, [])

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchNotificationHistory(filters)
        } else {
            navigate(`/accessdenied`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated, filters])

    const onResendNotification = useCallback(async values => {
        const isEdit = Boolean(values?._id)
        try {
            // prettier-ignore
            const response = await NotificationsAPI.admin_createOrUpdateNotificationTemplate(values)
            if (response) {
                fetchNotificationHistory()
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
                        setDetailData(null)
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

    const onClickDetailItem = useCallback(data => {
        // disable for now
        // setIsLoading(true)
        // setOpenModalForm(true)
        // setTimeout(() => {
        //     setDetailData(data)
        //     setIsLoading(false)
        // }, 750)
    }, [])

    const onSelectFilterType = useCallback(
        value => {
            if (value === filters.type) {
                setFilters({ type: null })
            } else {
                setFilters({ type: value })
            }
        },
        [filters.type]
    )

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>(Admin) Delivered Notification</title>
            </Helmet>
            <Container fluid>
                <div className='row justify-center h-auto'>
                    <div className='col-12 col-md-10'>
                        <Row className='justify-content-md-center'>
                            <Col>
                                <div className='AdminRewardContainer'>
                                    <Header>
                                        <button
                                            className='back-arrow'
                                            onClick={handleClick}
                                        >
                                            <BackIcon />
                                        </button>
                                        <div style={{ textAlign: 'center' }}>
                                            <h2 className='mb-3, text-center'>
                                                Delivered Notification History
                                            </h2>
                                        </div>
                                    </Header>

                                    <FilterContainer>
                                        {NOTIFICATION_TYPE_LIST.map(x => (
                                            <NotificationFilterType
                                                key={x.value}
                                            >
                                                <NotificationItemTypeLabel
                                                    onClick={onSelectFilterType}
                                                    type={x.value}
                                                    isSelected={
                                                        filters.type === x.value
                                                    }
                                                />
                                            </NotificationFilterType>
                                        ))}
                                    </FilterContainer>

                                    {data?.length > 0 &&
                                        data?.map((group, groupIndex) => (
                                            <NotificationItemContainer
                                                key={String(groupIndex)}
                                            >
                                                <NotificationItemGroupDate>
                                                    <h4>
                                                        {dayjs(
                                                            group.date
                                                        ).format('DD MMM YYYY')}
                                                    </h4>
                                                    <p>
                                                        {group?.notifications
                                                            ?.length || 0}{' '}
                                                        notifications
                                                    </p>
                                                </NotificationItemGroupDate>
                                                {/* prettier-ignore */}
                                                <Fragment>
                                                {group.notifications?.length > 0 ? group.notifications.map((item, itemIndex) => (
                                                    <NotificationHistoryItem
                                                        key={String(itemIndex)}
                                                        data={item}
                                                        onClickDetail={onClickDetailItem}
                                                        isLastItem={group.notifications.length - 1 === itemIndex}
                                                    />
                                                )) : null}
                                                </Fragment>
                                            </NotificationItemContainer>
                                        ))}
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
                <ModalWrapper>
                    {isLoading ? (
                        <LoadingBox spinnerSize={52} height={500} />
                    ) : (
                        <ModalBox>
                            <ModalTitle>Notification Detail</ModalTitle>
                            {detailData && (
                                <NotificationHistoryDetail
                                    data={detailData}
                                    onResendNotification={onResendNotification}
                                />
                            )}
                        </ModalBox>
                    )}
                </ModalWrapper>
            </FingoModalSlider>
        </FingoHomeLayout>
    )
}

const ModalWrapper = styled.div`
    overflow-y: scroll;
    max-height: 100vh;
`

const ModalBox = styled.div`
    border-radius: 0.4rem;
    padding: 1.5rem 2rem;
`

const ModalTitle = styled.div`
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
`

const Header = styled.div`
    background-color: transparent;
    padding-left: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.25rem;
    margin-top: 1.25rem;
    @media screen and (min-width: ${breakpoints.md}) {
        padding: 2rem 1rem;
        background-color: #00d02a;
        border-radius: 0.6rem;
        padding-left: 48px;
    }
    h2 {
        color: #fff;
        font-size: 22px;
        font-weight: bold;
    }
`

const NotificationItemContainer = styled.div`
    margin-bottom: 2rem;
`

const NotificationItemGroupDate = styled.div`
    background-color: #3366ff;
    height: 50px;
    border-radius: 6px;
    width: 180px;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    > h4 {
        font-weight: bold;
        font-size: 1.1rem;
        line-height: 1.1;
        color: #fff;
        margin-bottom: 0;
    }
    p {
        margin-bottom: 0;
        font-size: 0.8rem;
        color: #fff;
        font-weight: bold;
    }
`

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
`

const NotificationFilterType = styled.div`
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    transform: scale(1.2);
    margin: 0.85rem;
`

export default AdminNotificationHistoryPage
