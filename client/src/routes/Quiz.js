/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    useParams,
    useNavigate,
    useSearchParams,
    useFetcher,
} from 'react-router-dom'
import Axios from 'src/api/axios'
import { Button, Card, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import Navbar from '../components/Navbar'
import Modal from 'react-bootstrap/Modal'
import '../styles/QuizPage.styles.css'
import WrongAudio from '../sounds/wrong-audio.mp3'
import CorrectAudio from '../sounds/correct-audio.mp3'
import { FingoHomeLayout } from 'src/components/layouts'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import { useDispatch } from 'react-redux'
import {
    BATCH_EVENT_TYPE_TIME_SPENT,
    NUMBER_OF_LIMIT_LESSON_FOR_GUEST,
} from 'src/constants/app.constant'
import { QuizPageHeader } from 'src/components/quiz'
import { motion, useAnimation } from 'framer-motion'
import { FingoButton, FingoSnackBar } from 'src/components/core'
import {
    ModalKeepLearning,
    ModalHeartRunOut,
    ModalConfirmRefillHearts,
    ModalUnlimitedHearts,
} from 'src/components/hearts'
import ModalInviteFriends from 'src/components/ModalInviteFriends'
import dayjs from 'dayjs'
import { QuizAPI } from 'src/api'
import ModalClaimReward from 'src/components/reward/ModalClaimReward'

const RenderBlockQuiz = () => {
    const dispatch = useDispatch()
    const { app_setOpenModalHeartRunOut } = useApp()
    return (
        <div
            onClick={() => dispatch(app_setOpenModalHeartRunOut(true))}
            className='RenderBlockQuiz'
        />
    )
}

const Quiz = () => {
    const today = new Date()
    const dispatch = useDispatch()
    const { appBatch, app_setOpenModalHeartRunOut, settings } = useApp()
    const {
        isAuthenticated,
        user,
        auth_syncAndGetUser,
        auth_setOpenModalRegister,
    } = useAuth()

    const { persistedGuest_setScore, persistedGuest_setLastPlayed, guest } =
        usePersistedGuest()
    const [imageURL, setImageURL] = useState('')
    const { skillName, subcategory, category } = useParams()
    const navigate = useNavigate()
    const [itemId, setItemId] = useState(null)
    // const [showAlert, setShowAlert] = useState(null)

    // const control = useAnimation()

    const skillDetails = useRef({})
    const questionSet = useRef([])
    const currentQuestionIndex = useRef(0)
    const maxQuestions = useRef(0)
    const correctAnswers = useRef([])
    const score = useRef([])
    const points = useRef(0)

    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [currentExplaination, setCurrentExplaination] = useState(null)
    const [currentCorrectOptions, setCurrentCorrectOptions] = useState(null)
    const [optionSet, setOptionSet] = useState([])
    const [answersList, setAnswersList] = useState([])
    const [correctOptionsText, setCorrectOptionsText] = useState([])

    const [currentIsWrongIndex, setCurrentIsWrongIndex] = useState(null)
    const [currentImageName, setCurrentImageName] = useState('')
    const [audio, setAudio] = useState(new Audio())
    const correctAudio = new Audio(CorrectAudio)
    const wrongAudio = new Audio(WrongAudio)

    const [showExplaination, setShowExplaination] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()

    const [isSubmittedAnswer, setIsSubmittedAnswer] = useState(false)
    const [currentIsCorrect, setCurrentIsCorrect] = useState(false)
    const [currentIsCorrectIndex, setCurrentIsCorrectIndex] = useState(null)
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(null)

    const isMultipleChoice = useMemo(() => {
        return correctAnswers?.current?.length > 1
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [correctAnswers?.current])

    const onClickExplanation = e => {
        e.preventDefault()
        setShowExplaination(true)
    }

    // prettier-ignore
    const guestLimit = useMemo(() => {
        return !isAuthenticated && Boolean(guest.score?.length >= NUMBER_OF_LIMIT_LESSON_FOR_GUEST)
    }, [isAuthenticated, guest])

    console.log('guestLimit->>', guestLimit)

    const handleCheck = () => {
        // control.start('visible').then(result => {
        //     setTimeout(() => {
        //         control.start('hidden')
        //     }, 2000)
        // })

        if (isMultipleChoice) {
            if (
                JSON.stringify(answersList) ===
                JSON.stringify(correctAnswers.current)
            ) {
                score.current[currentQuestionIndex.current] = 1
                points.current = points.current + 1
                setCurrentIsCorrect(true)
                if (settings.soundsEffect) {
                    correctAudio.play()
                }
                appBatch({
                    eventType: BATCH_EVENT_TYPE_TIME_SPENT,
                    eventTimestamp: new Date().getTime(),
                    isCorrect: true,
                    itemId,
                }).then(result => {
                    if (result) {
                        auth_syncAndGetUser()
                    }
                })
            } else {
                if (settings.soundsEffect) {
                    wrongAudio.play()
                }
                setCurrentIsCorrect(false)
                appBatch({
                    eventType: BATCH_EVENT_TYPE_TIME_SPENT,
                    eventTimestamp: new Date().getTime(),
                    isCorrect: false,
                    itemId,
                }).then(result => {
                    if (result) {
                        auth_syncAndGetUser()
                    }
                })
            }
        } else {
            if (
                JSON.stringify(answersList) ===
                JSON.stringify(correctAnswers.current)
            ) {
                score.current[currentQuestionIndex.current] = 1
                points.current = points.current + 1
                setCurrentIsCorrect(true)
                setCurrentIsCorrectIndex(currentSelectedIndex ?? null)
                if (settings.soundsEffect) {
                    correctAudio.play()
                }
                appBatch({
                    eventType: BATCH_EVENT_TYPE_TIME_SPENT,
                    eventTimestamp: new Date().getTime(),
                    isCorrect: true,
                    itemId,
                }).then(result => {
                    if (result) {
                        auth_syncAndGetUser()
                    }
                })
            } else {
                if (settings.soundsEffect) {
                    wrongAudio.play()
                }
                setCurrentIsCorrect(false)
                setCurrentIsCorrect(true)
                setCurrentIsWrongIndex(currentSelectedIndex ?? null)
                setCurrentIsCorrectIndex(correctAnswers?.current?.[0] ?? null)
                appBatch({
                    eventType: BATCH_EVENT_TYPE_TIME_SPENT,
                    eventTimestamp: new Date().getTime(),
                    isCorrect: false,
                    itemId,
                }).then(result => {
                    if (result) {
                        auth_syncAndGetUser()
                    }
                })
            }
        }

        setIsSubmittedAnswer(true)
        setAnswersList([])
        setCorrectOptionsText([])
    }

    const next = () => {
        setIsSubmittedAnswer(false)
        setCurrentIsCorrectIndex(null)
        setCurrentIsWrongIndex(null)
        setCurrentSelectedIndex(null)

        var newQuestionIndex = Math.min(
            currentQuestionIndex.current + 1,
            maxQuestions.current - 1
        )
        currentQuestionIndex.current = newQuestionIndex
        setCurrentQuestion(questionSet.current[newQuestionIndex].question)
        setCurrentExplaination(
            questionSet.current[newQuestionIndex].explaination
        )
        setOptionSet(questionSet.current[newQuestionIndex].options)

        setItemId(questionSet.current[newQuestionIndex]._id)

        correctAnswers.current =
            questionSet.current[newQuestionIndex].correct_answers
        for (var i = 0; i < correctAnswers.current.length; i++) {
            correctAnswers.current[i] = Number(correctAnswers.current[i])
        }
        setShowExplaination(false)

        var tempCorrectOptionsText = []
        for (
            var i = 0;
            i < questionSet.current[newQuestionIndex].options.length;
            i++
        ) {
            if (correctAnswers.current.includes(i)) {
                tempCorrectOptionsText = tempCorrectOptionsText.concat(
                    questionSet.current[newQuestionIndex].options[i]
                )
            }
        }
        setCorrectOptionsText(tempCorrectOptionsText)

        setCurrentCorrectOptions(tempCorrectOptionsText.join(', '))

        if (questionSet.current[newQuestionIndex].imgpath != undefined) {
            setCurrentImageName(questionSet.current[newQuestionIndex].imgpath)
            const key = questionSet.current[newQuestionIndex].imgpath
            Axios({
                method: 'GET',
                withCredentials: true,
                url: `/server/getImage/${key}`,
            }).then(res => {
                setImageURL(res.data.url)
            })
        } else {
            setCurrentImageName('')
            setImageURL('')
        }
    }

    const saveScore = async () => {
        try {
            const response = await QuizAPI.saveScore({
                skill: skillName,
                category: category,
                sub_category: subcategory,
                points: points.current,
                score: score.current,
            })
            if (response) {
                navigate(
                    `/skills/${skillName}/${category}/${subcategory}/score`,
                    {
                        state: { data: { score: score, points: points } },
                    }
                )
            }
        } catch (e) {}
    }

    const saveXP = async () => {
        let xp = 0
        if (points.current > 0) {
            xp = points.current * 20
            if (points.current === maxQuestions.current) {
                xp += 20
            }
        } else {
            xp = 15
        }
        try {
            const response = await QuizAPI.saveXP({
                xp,
            })
            if (response) {
                saveScore()
            }
        } catch (e) {
            console.log('e->', e)
        }
    }

    const handleAnswer = i => {
        var tempAnswersList = answersList
        if (answersList.includes(i))
            tempAnswersList = tempAnswersList.filter(j => j != i)
        else tempAnswersList = tempAnswersList.concat(i)
        tempAnswersList = tempAnswersList.sort()
        setAnswersList(tempAnswersList)
    }

    const handleAnswerRadio = i => {
        setCurrentSelectedIndex(i)
        if (!answersList.includes(i)) {
            setAnswersList([i])
        }
    }

    const getAllQuestions = () => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/questions/${skillName}/${category}/${subcategory}`,
            params: {
                newUser: Boolean(!isAuthenticated && !user),
            },
        }).then(res => {
            questionSet.current = res.data.data
            maxQuestions.current = res.data.data.length
            setCurrentQuestion(res.data.data[0].question)
            setCurrentExplaination(res.data.data[0].explaination)
            setOptionSet(res.data.data[0].options)
            setItemId(res.data.data[0]._id)
            if (res.data.data[0].imgpath != undefined) {
                setCurrentImageName(res.data.data[0].imgpath)
                const key = res.data.data[0].imgpath
                Axios({
                    method: 'GET',
                    withCredentials: true,
                    url: `/server/getImage/${key}`,
                    params: {
                        newUser: Boolean(!isAuthenticated && !user),
                    },
                }).then(res => {
                    setImageURL(res.data.url)
                })
            } else {
                setCurrentImageName('')
                setImageURL('')
            }
            correctAnswers.current = res.data.data[0].correct_answers
            for (var i = 0; i < correctAnswers.current.length; i++) {
                correctAnswers.current[i] = Number(correctAnswers.current[i])
            }
            var tempCorrectOptionsText = []
            for (var i = 0; i < res.data.data[0].options.length; i++) {
                if (correctAnswers.current.includes(i)) {
                    tempCorrectOptionsText = tempCorrectOptionsText.concat(
                        res.data.data[0].options[i]
                    )
                }
            }
            setCorrectOptionsText(tempCorrectOptionsText)
            setCurrentCorrectOptions(tempCorrectOptionsText.join())

            var tempScore = []
            for (var i = 0; i < res.data.data.length; i++) {
                tempScore.push(0)
            }
            score.current = tempScore
        })
    }

    const getSkillBySkillName = () => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/skills/${skillName}`,
            params: {
                newUser: Boolean(!isAuthenticated && !user),
            },
        }).then(res => {
            skillDetails.current = res.data.data
        })
    }

    useEffect(() => {
        getSkillBySkillName()
        getAllQuestions()
    }, [])

    const isDisabledAnswer = useMemo(() => {
        return (
            currentSelectedIndex !== null &&
            (currentIsWrongIndex !== null || currentIsCorrectIndex !== null)
        )
    }, [currentSelectedIndex, currentIsWrongIndex, currentIsCorrectIndex])

    const renderCorrectIcon = () => (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
        >
            <path
                fill='#039027'
                fillRule='evenodd'
                d='M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18Zm-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774l.701-.84Z'
                clip-rule='evenodd'
            />
        </svg>
    )

    const renderIncorrectIcon = () => (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
        >
            <path
                fill='#e00000'
                fillRule='evenodd'
                d='M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0ZM7.293 16.707a1 1 0 0 1 0-1.414L10.586 12L7.293 8.707a1 1 0 0 1 1.414-1.414L12 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414L13.414 12l3.293 3.293a1 1 0 0 1-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 0 1-1.414 0Z'
                clip-rule='evenodd'
            />
        </svg>
    )

    useEffect(() => {
        auth_syncAndGetUser().then(result => {})
        return () => {
            // Clean up audio elements
            correctAudio.pause()
            correctAudio.currentTime = 0
            wrongAudio.pause()
            wrongAudio.currentTime = 0
        }
    }, [])

    const getMessage = useMemo(() => {
        return 'No problem. Let’s keep going!'
        // "Careful! One more mistake and it’s over."
    }, [])

    // useEffect(() => {
    //     if (showAlert) {
    //         setTimeout(() => {
    //             setShowAlert(false)
    //         }, [3000])
    //     }
    // }, [showAlert])

    const variants = {
        hidden: { opacity: 0, y: '-400px' },
        visible: { opacity: 1, y: 0 },
    }

    useEffect(() => {
        // prettier-ignore
        if(isAuthenticated && user?.unlimitedHeart && dayjs(user.unlimitedHeart).isBefore(dayjs(today).toISOString(), 'minute')) {
            dispatch(app_setOpenModalHeartRunOut(true))
        }
        // prettier-ignore
        if ((!isAuthenticated && guest?.heart < 1) || (!user?.unlimitedHeart && user?.heart < 1)) {
            dispatch(app_setOpenModalHeartRunOut(true))
        }
        return () => {
            dispatch(app_setOpenModalHeartRunOut(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, guest])

    const isRunOutOfHearts = useMemo(() => {
        return (
            (isAuthenticated && !user?.unlimitedHeart && user?.heart === 0) ||
            guest?.heart === 0
        )
    }, [user, isAuthenticated, guest])

    const onClickRegister = () => {
        dispatch(auth_setOpenModalRegister(true))
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Quiz</title>
            </Helmet>

            <div className='QuizPageRoot'>
                <div className='QuizPageContainer'>
                    <QuizPageHeader />
                    {guestLimit ? (
                        <Card className='d-flex flex-column FingoShapeRadius relative py-4'>
                            <div className='h-36 w-100 d-flex align-items-center justify-center flex-column'>
                                <h5 className='mb-4 leading-7 text-center'>
                                    Don't lose out on your reward and progress.
                                    Register now to continue.
                                </h5>
                                <FingoButton
                                    style={{ minWidth: 200 }}
                                    color='success'
                                    onClick={onClickRegister}
                                >
                                    Register
                                </FingoButton>
                            </div>
                        </Card>
                    ) : (
                        <Card className='d-flex flex-column FingoShapeRadius relative'>
                            {isRunOutOfHearts && <RenderBlockQuiz />}
                            <Card.Body>
                                <Card.Title>
                                    Question {currentQuestionIndex.current + 1}
                                </Card.Title>
                                <Card.Text>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {currentQuestion}
                                    </span>
                                </Card.Text>
                                {imageURL && (
                                    <div className='d-flex'>
                                        <Card.Img
                                            variant='top'
                                            src={imageURL}
                                            className='zoomImage mt-2'
                                            style={{
                                                maxWidth: '80%',
                                                maxHeight: '300px',
                                                marginBottom: '10px',
                                            }}
                                            alt='Responsive image'
                                        />
                                    </div>
                                )}
                            </Card.Body>
                            <ListGroup className='option_quiz_container list-group-flush fix'>
                                {optionSet.map((option, i) => (
                                    <ListGroup.Item
                                        key={i}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => {
                                            if (!isDisabledAnswer) {
                                                correctAnswers.current
                                                    .length === 1
                                                    ? handleAnswerRadio(i)
                                                    : handleAnswer(i)
                                            }
                                        }}
                                    >
                                        {isMultipleChoice ? (
                                            <div
                                                className={`option_quiz_item ${
                                                    answersList.includes(i)
                                                        ? 'selected'
                                                        : ''
                                                } ${
                                                    isSubmittedAnswer
                                                        ? correctAnswers?.current?.includes(
                                                              i
                                                          )
                                                            ? 'correct'
                                                            : currentIsCorrect
                                                              ? ''
                                                              : 'incorrect'
                                                        : ''
                                                }`}
                                            >
                                                <input
                                                    type={
                                                        correctAnswers.current
                                                            .length === 1
                                                            ? 'radio'
                                                            : 'checkbox'
                                                    }
                                                    style={{
                                                        marginRight: '10px',
                                                    }} // Add space between the radio button and text
                                                    checked={answersList.includes(
                                                        i
                                                    )}
                                                />
                                                <label
                                                    style={{
                                                        margin: '0',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {option}
                                                </label>
                                                {isSubmittedAnswer
                                                    ? correctAnswers?.current?.includes(
                                                          i
                                                      )
                                                        ? renderCorrectIcon()
                                                        : currentIsCorrect
                                                          ? null
                                                          : renderIncorrectIcon()
                                                    : null}
                                            </div>
                                        ) : (
                                            <div
                                                className={`option_quiz_item ${
                                                    answersList.includes(i)
                                                        ? 'selected'
                                                        : ''
                                                } ${
                                                    currentIsWrongIndex === i
                                                        ? 'incorrect'
                                                        : ''
                                                } ${
                                                    currentIsCorrectIndex === i
                                                        ? 'correct'
                                                        : ''
                                                }`}
                                            >
                                                <input
                                                    type={
                                                        correctAnswers.current
                                                            .length === 1
                                                            ? 'radio'
                                                            : 'checkbox'
                                                    }
                                                    style={{
                                                        marginRight: '10px',
                                                    }} // Add space between the radio button and text
                                                    checked={answersList.includes(
                                                        i
                                                    )}
                                                />
                                                <label
                                                    style={{
                                                        margin: '0',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {option}
                                                </label>
                                                {currentIsCorrectIndex !==
                                                    null && (
                                                    <>
                                                        {currentSelectedIndex ===
                                                            currentIsCorrectIndex &&
                                                        currentIsCorrectIndex ===
                                                            i ? (
                                                            renderCorrectIcon()
                                                        ) : (
                                                            <>
                                                                {currentIsCorrectIndex ===
                                                                    i &&
                                                                    renderCorrectIcon()}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                {currentIsWrongIndex !==
                                                    null && (
                                                    <>
                                                        {currentSelectedIndex ===
                                                            currentIsWrongIndex &&
                                                            currentIsWrongIndex ===
                                                                i &&
                                                            renderIncorrectIcon()}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Card.Body>
                                <Row className='px-3 align-items-center justify-content-between'>
                                    {isSubmittedAnswer ? (
                                        <a
                                            href='#'
                                            className='explanation_btn'
                                            onClick={onClickExplanation}
                                        >
                                            Explanation
                                        </a>
                                    ) : (
                                        <div />
                                    )}
                                    {isSubmittedAnswer ? (
                                        <>
                                            {currentQuestionIndex.current + 1 <
                                                maxQuestions.current && (
                                                <>
                                                    <Button
                                                        variant='success'
                                                        style={{
                                                            boxShadow:
                                                                '0px 7px #1a5928',
                                                            minWidth: 100,
                                                            borderRadius:
                                                                '12px',
                                                        }}
                                                        onClick={next}
                                                    >
                                                        Next
                                                    </Button>{' '}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Button
                                            variant='success'
                                            className="QuizSubmitBtn"
                                            style={{
                                                width: '100%', // Make the button take full width on smaller screens
                                                whiteSpace: 'nowrap', // Prevent text from wrapping
                                                textAlign: 'center',
                                                boxShadow: '0px 7px #1a5928',
                                                borderRadius: '12px',
                                            }}
                                            onClick={handleCheck}
                                            disabled={answersList.length === 0}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                    {currentQuestionIndex.current + 1 ===
                                        maxQuestions.current &&
                                        isSubmittedAnswer && (
                                            <>
                                                <Button
                                                    style={{
                                                        borderRadius: '12px',
                                                        boxShadow:
                                                            '0px 7px #212121',
                                                    }}
                                                    onClick={() => {
                                                        saveXP()
                                                    }}
                                                >
                                                    End Quiz
                                                </Button>
                                            </>
                                        )}
                                </Row>

                                <Modal
                                    show={showExplaination}
                                    style={{ marginTop: '40px' }}
                                >
                                    {/* <Modal.Header
              style={{
                backgroundColor: currentIsCorrect ? "#3CB043" : "lightcoral",
              }}
            >
              <Modal.Title>
                {currentIsCorrect
                  ? "Correct Answer"
                  : "Oops, That is Incorrect"}
              </Modal.Title>
            </Modal.Header> */}

                                    <Modal.Body>
                                        <div>
                                            Correct Answer:{' '}
                                            {currentCorrectOptions}
                                        </div>
                                        <br />
                                        <div>
                                            Explanation: {currentExplaination}
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        {currentQuestionIndex.current + 1 ===
                                            maxQuestions.current && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        saveXP()
                                                    }}
                                                >
                                                    End Quiz
                                                </Button>{' '}
                                            </>
                                        )}
                                        {currentQuestionIndex.current + 1 <
                                            maxQuestions.current && (
                                            <>
                                                <Button
                                                    variant='success'
                                                    style={{
                                                        boxShadow:
                                                            '0px 7px #1a5928',
                                                        borderRadius: '12px',
                                                    }}
                                                    onClick={next}
                                                >
                                                    Next
                                                </Button>{' '}
                                            </>
                                        )}
                                    </Modal.Footer>
                                </Modal>
                            </Card.Body>
                        </Card>
                    )}

                    {!guestLimit && (
                        <div className='page-dots'>
                            {Array.from(
                                { length: maxQuestions.current },
                                (_, i) => (
                                    <span
                                        key={i}
                                        className={`dot ${
                                            i === currentQuestionIndex.current
                                                ? 'active'
                                                : ''
                                        }`}
                                    ></span>
                                )
                            )}
                        </div>
                    )}
                    {/* <motion.div
                        initial='hidden'
                        variants={variants}
                        animate={control}
                        className='mb-3'
                    >
                        <FingoSnackBar severity='success' text={getMessage} />
                    </motion.div> */}
                </div>
            </div>
            <ModalHeartRunOut />
            <ModalKeepLearning />
            <ModalConfirmRefillHearts />
            <ModalUnlimitedHearts />
            <ModalInviteFriends />
            <ModalClaimReward />
        </FingoHomeLayout>
    )
}

export default Quiz
