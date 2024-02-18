import React, { useCallback, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useReward } from 'src/hooks'
import LoadingBox from 'src/components/LoadingBox'
import MyRewardCardItem from './MyRewardCardItem'
import 'src/styles/ModalListMyReward.styles.css'
import { FingoModal } from '../core'

const ModalListMyReward = () => {
    const dispatch = useDispatch()
    const {
        openModalListMyReward,
        reward_setOpenModalListMyReward,
        listMyRewardIsLoading: isLoading,
        listMyRewardData: data,
        reward_getListMyRewards,
    } = useReward()

    const handleCloseModal = () => {
        dispatch(reward_setOpenModalListMyReward(false))
    }

    useEffect(() => {
        if (openModalListMyReward) {
            dispatch(reward_getListMyRewards())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListMyReward])

    return (
        <FingoModal
            open={openModalListMyReward}
            onClose={handleCloseModal}
            centered
            className='ModalListMyReward'
        >
            <div className='ListRewardContainer FingoShapeRadius'>
                <div className='ListRewardHeader'>
                    <h2 className='mb-0'>My Rewards</h2>
                    <p>You have {data.length} gift card{'(s)'}.</p>
                </div>
                <hr />
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
                                            key={x._id}
                                            className='mb-3 px-2'
                                        >
                                            <MyRewardCardItem data={x} />
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

export default ModalListMyReward
