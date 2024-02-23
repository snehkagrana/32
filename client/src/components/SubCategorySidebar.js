import { Card, Dropdown, DropdownButton } from 'react-bootstrap'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import '../styles/SubCategorySidebar.styles.css'
import { useAuth, usePersistedGuest } from 'src/hooks'

const SubCategorySidebar = props => {
    const { data, dropdownHeadingList } = props
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const { guest } = usePersistedGuest()

    const [searchParams] = useSearchParams()
    const { skillName, category, subcategory } = useParams()
    const [currentIndex, setCurrentIndex] = useState(null)
    const [showAlert, setShowAlert] = useState(false)

    const getIsCurrent = subcategoryParams => {
        return subcategoryParams === subcategory
    }

    const isCompleted = item => {
        if (isAuthenticated && user && user?.score?.length > 0) {
            return Boolean(
                user?.score.find(
                    x =>
                        x.sub_category === item.sub_category &&
                        x.category === item.category
                )
            )
        } else if (guest && guest?.score?.length > 0) {
            return Boolean(
                guest?.score?.find(
                    x =>
                        x.sub_category === item.sub_category &&
                        x.category === item.category
                )
            )
        }
        return false
    }

    const onClickItem = (subcategoryParams, isLocked) => {
        const newUser = searchParams.get('newUser')
        if (!isLocked) {
            navigate(
                `/skills/${skillName}/${category}/${subcategoryParams}/information/${0}${
                    newUser ? '?newUser=true' : ''
                }`
            )
        } else {
            setShowAlert(true)
        }
    }

    useEffect(() => {
        if (data?.length > 0) {
            setCurrentIndex(
                data.findIndex(item => item.sub_category === subcategory)
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false)
            }, [3000])
        }
    }, [showAlert])

    const variants = {
        open: { opacity: 1, y: 0 },
        closed: { opacity: 0, y: '-120px' },
    }

    const onChangeDropdownHeading = paramPageNumber => {
        const newUserQueryParam = searchParams.get('newUser')
            ? '?newUser=true'
            : ''
        navigate(
            `/skills/${skillName}/${category}/${subcategory}/information/${paramPageNumber}${newUserQueryParam}`
        )
    }

    return (
        <div className='SubCategorySidebar'>
            <motion.div
                animate={showAlert ? 'open' : 'closed'}
                variants={variants}
            >
                <div
                    style={{
                        display: showAlert ? 'block' : 'none',
                    }}
                >
                    <div
                        className='alert alert-warning d-flex justify-content-between'
                        role='alert'
                        data-mdb-color='warning'
                    >
                        <p className='mb-0'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                            >
                                <g
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                >
                                    <rect
                                        width='18'
                                        height='11'
                                        x='3'
                                        y='11'
                                        rx='2'
                                        ry='2'
                                    />
                                    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                                </g>
                            </svg>
                            Please Login to Unlock Lessons
                        </p>
                    </div>
                </div>
            </motion.div>
            <Card
                className='SubCategorySidebarCard d-flex flex-column mobile-card-style'
                style={{
                    borderRadius: '15px',
                }}
            >
                <Card.Body>
                    <Card.Title>{data?.length ?? 0} Lessons</Card.Title>
                    <div className='SubCategorySidebarContent'>
                        {data?.length > 0 &&
                            data.map((item, index) => {
                                if (getIsCurrent(item.sub_category)) {
                                    return (
                                        <div
                                            className={`SubCategorySidebarItem ${
                                                getIsCurrent(
                                                    item.sub_category
                                                ) && 'active'
                                            }`}
                                            key={String(index)}
                                        >
                                            <DropdownButton
                                                className='DropdownHeadingInformationPage'
                                                title={`${
                                                    index + 1
                                                } ${item.sub_category
                                                    .split('_')
                                                    .join(' ')}`}
                                            >
                                                {dropdownHeadingList.map(
                                                    (x, index) => (
                                                        <Dropdown.Item
                                                            eventKey={String(
                                                                index
                                                            )}
                                                            disabled={false}
                                                            href='#'
                                                        >
                                                            {x.heading}
                                                        </Dropdown.Item>
                                                    )
                                                )}
                                            </DropdownButton>
                                            <div className='IconContainer'>
                                                {getIsCurrent(
                                                    item.sub_category
                                                ) && (
                                                    <svg
                                                        className='bookIcon mr-1'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        width='24'
                                                        height='24'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            fill='none'
                                                            stroke='currentColor'
                                                            stroke-linecap='round'
                                                            stroke-linejoin='round'
                                                            stroke-width='2'
                                                            d='M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13'
                                                        />
                                                    </svg>
                                                )}
                                                {isCompleted(item) && (
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        width='24'
                                                        height='24'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            fill='currentColor'
                                                            d='m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z'
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div
                                            onClick={() =>
                                                onClickItem(item.sub_category)
                                            }
                                            className={`SubCategorySidebarItem ${
                                                getIsCurrent(
                                                    item.sub_category
                                                ) && 'active'
                                            }`}
                                            key={String(index)}
                                        >
                                            <p>{`${
                                                index + 1
                                            } ${item.sub_category
                                                .split('_')
                                                .join(' ')}`}</p>

                                            {getIsCurrent(
                                                item.sub_category
                                            ) && (
                                                <svg
                                                    className='bookIcon'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='24'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        fill='none'
                                                        stroke='currentColor'
                                                        stroke-linecap='round'
                                                        stroke-linejoin='round'
                                                        stroke-width='2'
                                                        d='M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13'
                                                    />
                                                </svg>
                                            )}

                                            {isCompleted(item) && (
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='24'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        fill='currentColor'
                                                        d='m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z'
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    )
                                }
                            })}
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SubCategorySidebar
