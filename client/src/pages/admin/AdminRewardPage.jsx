import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import { FingoScrollToTop } from 'src/components/layouts/FingoHomeLayout'
import { useAuth, useReward } from 'src/hooks'
import 'src/styles/AdminReward.styles.css'
import { ReactComponent as BackIcon } from 'src/assets/svg/back.svg'
import { useDispatch } from 'react-redux'
import { FingoButton } from 'src/components/core'
import { ModalFormReward, RewardCardItem } from 'src/components/reward'
import LoadingBox from 'src/components/LoadingBox'

const AdminRewardPage = () => {
    const dispatch = useDispatch()
    const {
        reward_adminGetList,
        modalForm,
        reward_setModalForm,
        listData,
        listIsLoading,
    } = useReward()
    const { skillName } = useParams()
    const { categoryName } = useParams()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/home')
    }

    const onClickAddNew = useCallback(() => {
        dispatch(reward_setModalForm({ open: true, data: null }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalForm])

    const getListRewards = params => {
        dispatch(reward_adminGetList(params))
    }

    useEffect(() => {
        getListRewards()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Reward</title>
            </Helmet>
            <Container>
                <div className='row justify-center h-auto'>
                    <div className='col-12 col-md-9'>
                        <Row className='justify-content-md-center'>
                            <Col>
                                <div className='sub_category_card_container'>
                                    <div className='AdminRewardHeader mb-4'>
                                        <button
                                            className='back-arrow'
                                            onClick={handleClick}
                                        >
                                            <BackIcon />
                                        </button>
                                        <div>
                                            <h2 className='mb-1 text-center'>
                                                Reward
                                            </h2>
                                            <FingoButton
                                                color='white'
                                                onClick={onClickAddNew}
                                            >
                                                Add New Item
                                            </FingoButton>
                                        </div>
                                    </div>
                                    {listIsLoading ? (
                                        <LoadingBox height={300} />
                                    ) : (
                                        <Row>
                                            {listData?.length > 0 &&
                                                listData.map(x => (
                                                    <Col
                                                        key={x._id}
                                                        xs={12}
                                                        md={4}
                                                    >
                                                        <RewardCardItem
                                                            data={x}
                                                        />
                                                    </Col>
                                                ))}
                                        </Row>
                                    )}
                                    <FingoScrollToTop />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
            <ModalFormReward />
        </FingoHomeLayout>
    )
}

export default AdminRewardPage
