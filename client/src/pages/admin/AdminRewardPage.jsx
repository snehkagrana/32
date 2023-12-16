import React, { useEffect, useCallback } from 'react'
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
        adminListRewardData,
        adminListRewardIsLoading,
    } = useReward()
    const { user, isAuthenticated } = useAuth()
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
        if (isAuthenticated && user?.role === 'admin') {
            getListRewards()
        } else {
            navigate(`/accessdenied`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated])

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Reward</title>
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
                                    {adminListRewardIsLoading ? (
                                        <LoadingBox height={300} />
                                    ) : (
                                        <Row>
                                            {adminListRewardData?.length > 0 &&
                                                adminListRewardData.map(x => (
                                                    <Col
                                                        key={x._id}
                                                        xs={12}
                                                        md={6}
                                                        className='mb-3 px-2'
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
