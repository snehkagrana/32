/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNotifications } from 'src/hooks'
import {
    FingoButton,
    FingoInput,
    FingoModal,
    FingoModalSlider,
} from 'src/components/core'
import styled from 'styled-components'
import NotificationRecipientItem from './notification-recipient-item'
import { NotificationsAPI } from 'src/api'
import Swal from 'sweetalert2'
import NotificationTemplateItem from './notification-template-item'

const ModalNotificationSendTemplate = () => {
    const dispatch = useDispatch()
    const {
        notifications_setOpenModalUserRecipients,
        openModalUserRecipients,
        notificationRecipientsData,
        notifications_setModalSendTemplate,
        modalSendTemplate,
    } = useNotifications()
    const [searchValue, setSearchValue] = useState('')
    const [hasDirty, setHasDirty] = useState(false)
    const [selectedRecipients, setSelectedRecipients] = useState([])

    // prettier-ignore
    const onCheckItem = useCallback(item => {
        let currentSelectedItems = Array.from(selectedRecipients)
        const isExist = selectedRecipients?.find(x => x._id === item?._id)
        if (isExist) { 
            let _currentSelectedItems = Array.from(selectedRecipients).filter((x) => x._id !== item._id)
            setSelectedRecipients(_currentSelectedItems)
        } else {
            setSelectedRecipients([...currentSelectedItems, item])
        }
    }, [selectedRecipients])

    // prettier-ignore
    const displayData = useMemo(() => {
        if (notificationRecipientsData?.length > 0) {
            if (searchValue?.length > 0) {
                return notificationRecipientsData.filter(x => x.displayName?.toLowerCase()?.includes(searchValue?.toLowerCase()))
            } else {
                return notificationRecipientsData
            }
        }
    }, [searchValue, notificationRecipientsData])

    const isSelectedAll = useMemo(() => {
        return selectedRecipients?.length === notificationRecipientsData.length
    }, [selectedRecipients, notificationRecipientsData])

    const onConfirmClose = () => {
        dispatch(notifications_setOpenModalUserRecipients(true))
    }

    const onCloseModal = useCallback(() => {
        dispatch(
            notifications_setModalSendTemplate({
                open: false,
                template: null,
            })
        )
    }, [selectedRecipients, hasDirty, openModalUserRecipients])

    // prettier-ignore
    const onChangeSearchInput = useCallback(e => {
        setSearchValue(e.target.value)
    }, [searchValue])

    const onSubmit = useCallback(async () => {
        try {
            const submitValues = {
                title: modalSendTemplate?.template?.title || '',
                body: modalSendTemplate?.template?.body || '',
                imageUrl: modalSendTemplate?.template?.imageUrl || null,
                users: selectedRecipients.map(x => ({
                    userId: x._id,
                    displayName: x.displayName || '',
                    email: x.email,
                    imageUrl: x.imgPath || null,
                })),
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
    }, [modalSendTemplate, selectedRecipients])

    useEffect(() => {
        if (modalSendTemplate?.users?.length > 0) {
            setSelectedRecipients(modalSendTemplate)
            setHasDirty(false)
        }
    }, [modalSendTemplate, hasDirty])

    const onClickSelectAll = useCallback(() => {
        setSelectedRecipients(isSelectedAll ? [] : notificationRecipientsData)
    }, [isSelectedAll])

    return (
        <FingoModalSlider
            open={modalSendTemplate.open}
            onClose={onCloseModal}
            width={640}
        >
            <ModalWrapper>
                <ModalBox>
                    <ModalTitle>Send notification template</ModalTitle>
                    {modalSendTemplate?.template && (
                        <TemplateWrapper>
                            <NotificationTemplateItem
                                data={modalSendTemplate.template}
                            />
                        </TemplateWrapper>
                    )}
                    <SearchBox>
                        <FingoInput
                            name='searchValue'
                            value={searchValue}
                            placeholder='Search user'
                            onChange={onChangeSearchInput}
                            style={{ marginBottom: '1rem' }}
                        />
                    </SearchBox>
                    <Row className='justify-content-center'>
                        <Col xs={12} className='px-2 text-center mb-2'>
                            {displayData?.length > 0 && (
                                <Button size='sm' onClick={onClickSelectAll}>
                                    {isSelectedAll
                                        ? 'Unselect All'
                                        : 'Select All'}
                                </Button>
                            )}
                        </Col>
                        <Col xs={12} className='px-2'>
                            {Array.isArray(displayData) &&
                            displayData.length > 0 ? (
                                <Fragment>
                                    {displayData.map((item, index) => (
                                        <NotificationRecipientItem
                                            key={String(index)}
                                            data={item}
                                            checked={selectedRecipients.find(
                                                x => x._id === item._id
                                            )}
                                            onCheck={onCheckItem}
                                            canChecked={true}
                                        />
                                    ))}
                                </Fragment>
                            ) : (
                                <div className='text-center py-4'>
                                    <p>Users not found</p>
                                </div>
                            )}
                        </Col>
                        <Col xs={12} className='px-2 py-2 text-center'>
                            <FingoButton
                                style={{ width: 200 }}
                                onClick={onSubmit}
                            >
                                Send Notification
                            </FingoButton>
                        </Col>
                    </Row>
                </ModalBox>
            </ModalWrapper>
        </FingoModalSlider>
    )
}

const ModalWrapper = styled.div`
    overflow-y: scroll;
    max-height: 100vh;
`

const ModalBox = styled.div`
    border-radius: 0.4rem;
    padding: 1.2rem 2.5rem;
`

const SearchBox = styled.div``

const ModalTitle = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
`

const TemplateWrapper = styled.div`
    width: 100%;
    margin-bottom: 0.75rem;
`

export default memo(ModalNotificationSendTemplate)
