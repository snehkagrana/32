import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Axios from 'src/api/axios'
import { useNavigate } from 'react-router-dom'
import { Row, Button, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import Card from 'react-bootstrap/Card'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import SubCategorySidebar from '../components/SubCategorySidebar'
import LoadingBox from '../components/LoadingBox'
import { FingoHomeLayout } from 'src/components/layouts'
import '../index.css'
import { useAuth } from 'src/hooks'

const InformationPage = () => {
    const { auth_syncAndGetUser } = useAuth()
    const [imageURL, setImageURL] = useState('')
    const { skillName, category, subcategory, page } = useParams()
    const navigate = useNavigate()
    const [skillDetails, setSkillDetails] = useState({})
    const [information, setInformation] = useState({})
    const [informationDisplay, setInformationDisplay] = useState('')
    const [pageNumber, setPageNumber] = useState(0)
    const [maxInfoPages, setMaxInfoPages] = useState(0)
    const role = useRef('')
    const isCompleted = useRef(false)
    const [score, setScore] = useState(-1)
    const [isQuiz, setIsQuiz] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [subCategories, setSubCategories] = useState([])
    const [isLoadingInformation, setIsLoadingInformation] = useState(false)

    const getInformation = isNewUser => {
        setIsLoadingInformation(true)
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/information/${skillName}/${category}/${subcategory}/${page}`,
            params: {
                newUser: isNewUser,
            },
        })
            .then(res => {
                setIsLoadingInformation(false)
                if (res.data.url !== undefined) {
                    setImageURL(res.data.url)
                } else {
                    setImageURL('')
                }
                setInformation(res.data.data)
                setInformationDisplay(res.data.data.information)
            })
            .catch(e => {
                setIsLoadingInformation(false)
            })
    }

    const prev = () => {
        var newPageNumber = Math.max(pageNumber - 1, 0)
        const newUserQueryParam = searchParams.get('newUser')
            ? '?newUser=true'
            : ''
        navigate(
            `/skills/${skillName}/${category}/${subcategory}/information/${newPageNumber}${newUserQueryParam}`
        )
    }

    const next = () => {
        var newPageNumber = Math.min(pageNumber + 1, maxInfoPages - 1)
        const newUserQueryParam = searchParams.get('newUser')
            ? '?newUser=true'
            : ''
        navigate(
            `/skills/${skillName}/${category}/${subcategory}/information/${newPageNumber}${newUserQueryParam}`
        )
    }

    const onClickPagination = useCallback(
        paramPageNumber => {
            const newUserQueryParam = searchParams.get('newUser')
                ? '?newUser=true'
                : ''
            navigate(
                `/skills/${skillName}/${category}/${subcategory}/information/${paramPageNumber}${newUserQueryParam}`
            )
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [pageNumber, page]
    )

    const getSkillBySkillName = isNewUser => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/skills/${skillName}`,
            params: {
                newUser: isNewUser,
            },
        }).then(res => {
            const filteredData = res.data.data[0].information.filter(
                information =>
                    information.category === category &&
                    information.sub_category === subcategory
            )
            setSkillDetails(res.data.data[0])
            setMaxInfoPages(filteredData.length)

            res.data.data[0].questions.forEach(question => {
                if (
                    question.category === category &&
                    question.sub_category === subcategory
                ) {
                    setIsQuiz(true)
                }
            })

            // set sub category list
            const subCategoriesList =
                res.data?.data[0]?.sub_categories.filter(
                    i => i.category === category
                ) ?? []
            setSubCategories(subCategoriesList)
        })
    }

    const renderPageDots = () => {
        const dots = []
        for (let i = 0; i < maxInfoPages; i++) {
            dots.push(
                <span
                    key={i}
                    className={`page-dot ${i === pageNumber ? 'active' : ''}`}
                    onClick={() => onClickPagination(i)}
                ></span>
            )
        }
        return dots
    }

    useEffect(() => {
        const newUser = searchParams.get('newUser')
        if (newUser === 'true') {
            getSkillBySkillName(newUser)
            getInformation(newUser)
            var checkIsCompleted = (
                JSON.parse(sessionStorage.getItem('scores')) || []
            ).filter(function (score) {
                return (
                    score.skill === skillName &&
                    score.category === category &&
                    score.sub_category === subcategory
                )
            })
            if (checkIsCompleted.length > 0) {
                isCompleted.current = true
                setScore(checkIsCompleted[0].points)
            } else {
                isCompleted.current = false
            }
        } else {
            auth_syncAndGetUser().then(result => {
                if (result?._id) {
                    getSkillBySkillName()
                    getInformation()
                    role.current = result.role
                    var checkIsCompleted = result?.score && result.score.filter(
                        function (score) {
                            return (
                                score.skill === skillName &&
                                score.category === category &&
                                score.sub_category === subcategory
                            )
                        }
                    )
                    if (checkIsCompleted.length > 0) {
                        isCompleted.current = true
                        setScore(checkIsCompleted[0].points)
                    } else {
                        isCompleted.current = false
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, searchParams, subcategory])

    useEffect(() => {
        if (page) {
            setPageNumber(parseInt(page, 10))
        }
    }, [page])

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Let's Learn</title>
            </Helmet>
            <Row
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '1100px',
                    marginBottom: '20px',
                }}
            >
                <Col xs={12} md={7}>
                    <Card
                        className='d-flex flex-column mobile-card-style'
                        style={{
                            borderRadius: '15px',
                        }}
                    >
                        {isLoadingInformation ? (
                            <LoadingBox spinnerSize={52} height={300} />
                        ) : (
                            <Card.Body>
                                <Card.Title>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {information.heading}
                                    </span>
                                </Card.Title>
                                {imageURL && (
                                    <div className='d-flex'>
                                        <Card.Img
                                            variant='top'
                                            src={imageURL}
                                            className='zoomImage mt-2'
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '300px',
                                                marginBottom: '10px',
                                            }}
                                            alt='Responsive image'
                                        />
                                    </div>
                                )}

                                <Card.Text>
                                    <p>
                                        {informationDisplay !== ' ' &&
                                            informationDisplay
                                                .split('\n')
                                                .map((item, key) => (
                                                    <div
                                                        key={key}
                                                        onMouseDown={e =>
                                                            e.preventDefault()
                                                        }
                                                        onCopy={e =>
                                                            e.preventDefault()
                                                        }
                                                        onSelectStart={e =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        {item}
                                                        <br />
                                                    </div>
                                                ))}
                                    </p>
                                </Card.Text>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        {pageNumber > 0 && (
                                            <Button
                                                variant='secondary'
                                                onClick={prev}
                                            >
                                                Prev
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        {pageNumber + 1 < maxInfoPages && (
                                            <Button
                                                style={{ minWidth: '20%' }}
                                                variant='success'
                                                onClick={next}
                                            >
                                                Next
                                            </Button>
                                        )}
                                        {isQuiz &&
                                            pageNumber + 1 === maxInfoPages &&
                                            isCompleted.current === false && (
                                                <>
                                                    <Button
                                                        variant='success'
                                                        onClick={() => {
                                                            const newUserQueryParam =
                                                                searchParams.get(
                                                                    'newUser'
                                                                )
                                                                    ? '?newUser=true'
                                                                    : ''
                                                            navigate(
                                                                `/skills/${skillName}/${category}/${subcategory}/quiz${newUserQueryParam}`
                                                            )
                                                        }}
                                                    >
                                                        Start Quiz
                                                    </Button>
                                                </>
                                            )}
                                    </div>
                                </div>
                                {isQuiz &&
                                    pageNumber + 1 === maxInfoPages &&
                                    isCompleted.current === true && (
                                        <>
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip id='tooltip-disabled'>
                                                        Your score is {score}
                                                    </Tooltip>
                                                }
                                            >
                                                <span className='d-inline-block'>
                                                    <Button
                                                        variant='success'
                                                        disabled
                                                        style={{
                                                            pointerEvents:
                                                                'none',
                                                        }}
                                                    >
                                                        Start Quiz
                                                    </Button>
                                                </span>
                                            </OverlayTrigger>
                                        </>
                                    )}
                                {!isQuiz && pageNumber + 1 === maxInfoPages && (
                                    <Button
                                        variant='success'
                                        onClick={() =>
                                            navigate(
                                                `/skills/${skillName}/${category}`
                                            )
                                        }
                                    >
                                        Go Back!!
                                    </Button>
                                )}
                            </Card.Body>
                        )}
                    </Card>
                    <div className='page-dots'>{renderPageDots()}</div>
                </Col>
                <Col xs={12} md={5}>
                    <SubCategorySidebar data={subCategories} />
                </Col>
            </Row>
        </FingoHomeLayout>
    )
}

export default InformationPage

///TODO: change hard coded value 5
