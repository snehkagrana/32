/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNotifications } from 'src/hooks'
import { FingoButton, FingoInput, FingoModal } from 'src/components/core'
import styled from 'styled-components'
import NotificationRecipientItem from './notification-recipient-item'

const ModalNotificationUserRecipient = ({ defaultValues, onSubmit }) => {
    const dispatch = useDispatch()
    const {
        notifications_setOpenModalUserRecipients,
        openModalUserRecipients,
        notificationRecipientsData,
    } = useNotifications()
    const [searchValue, setSearchValue] = useState('')
    const [hasDirty, setHasDirty] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])

    // prettier-ignore
    const onCheckItem = useCallback(item => {
        let currentSelectedItems = Array.from(selectedItems)
        const isExist = selectedItems?.find(x => x._id === item?._id)
        if (isExist) { 
            let _currentSelectedItems = Array.from(selectedItems).filter((x) => x._id !== item._id)
            setSelectedItems(_currentSelectedItems)
        } else {
            setSelectedItems([...currentSelectedItems, item])
        }
    }, [selectedItems])

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
        return selectedItems?.length === notificationRecipientsData.length
    }, [selectedItems, notificationRecipientsData])

    const onConfirmClose = () => {
        dispatch(notifications_setOpenModalUserRecipients(true))
    }

    const onCloseModal = useCallback(() => {
        dispatch(notifications_setOpenModalUserRecipients(false))
        onSubmit(selectedItems)
        // dispatch(notifications_setSelectedUserRecipients(selectedItems))
    }, [selectedItems, hasDirty, openModalUserRecipients])

    // prettier-ignore
    const onChangeSearchInput = useCallback(e => {
        setSearchValue(e.target.value)
    }, [searchValue])

    const onClickAdd = useCallback(() => {
        onSubmit(selectedItems)
        // dispatch(notifications_setSelectedUserRecipients(selectedItems))
        onCloseModal()
    }, [selectedItems, openModalUserRecipients])

    useEffect(() => {
        if (defaultValues?.length > 0) {
            setSelectedItems(defaultValues)
            setHasDirty(false)
        }
    }, [defaultValues, hasDirty])

    const onClickSelectAll = useCallback(() => {
        setSelectedItems(isSelectedAll ? [] : notificationRecipientsData)
    }, [isSelectedAll])

    return (
        <ModalWrapper>
            <FingoModal
                className='modal-notification-recipients'
                open={openModalUserRecipients}
                onClose={onCloseModal}
                centered
            >
                <ModalBox>
                    <div className='mb-4'>Select notification recipients</div>
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
                                            checked={selectedItems.find(
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
                                style={{ width: 120 }}
                                onClick={onClickAdd}
                            >
                                DONE
                            </FingoButton>
                        </Col>
                    </Row>
                </ModalBox>
            </FingoModal>
        </ModalWrapper>
    )
}

const ModalWrapper = styled.div`
    .modal-dialog {
        width: 620px !important;
    }
`
const ModalBox = styled.div`
    background-color: #fff;
    border-radius: 0.4rem;
    padding: 1rem;
`

const SearchBox = styled.div``

export default ModalNotificationUserRecipient
