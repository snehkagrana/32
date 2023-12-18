import React, { useCallback, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useReward } from 'src/hooks'
import { FingoModal } from 'src/components/core'
import LoadingBox from 'src/components/LoadingBox'
import RewardCardItem from './RewardCardItem'
import 'src/styles/ModalListReward.styles.css'

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

    const onClickCancel = () => {
        handleCloseModal()
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
            className='ModalListReward'
        >
            <div className='ListRewardContainer FingoShapeRadius'>
                <h2 className='mb-3'>Reward History</h2>
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

export default ModalListMyReward
