import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import Axios from 'src/api/axios'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Card, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import Navbar from '../components/Navbar'
import Confetti from 'react-dom-confetti'
import { Howl } from 'howler'
import Sound from '../sounds/success-1.mp3'
import { FingoHomeLayout } from 'src/components/layouts'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import { useDispatch } from 'react-redux'
import FingoModalLevelUp from 'src/components/FingoModalLevelUp'
import 'src/styles/FingoLessonComplete.styles.css'
import { FingoButton } from 'src/components/core'
import StartFilled from 'src/assets/images/diamond-filled.png'
import StartFilledFade from 'src/assets/images/diamond-faded.png'
import BG from 'src/assets/images/8270289.jpg'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import 'src/styles/ScorePage.styles.css'
import { NUMBER_OF_LIMIT_LESSON_FOR_GUEST } from 'src/constants/app.constant'

const ScorePage = () => {
    const dispatch = useDispatch()
    const {
        user,
        auth_syncAndGetUser,
        isAuthenticated,
        auth_setOpenModalRegister,
    } = useAuth()
    const { guest } = usePersistedGuest()
    const { app_setModalLevelUp } = useApp()
    const { skillName, category, subcategory } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [skillDetails, setSkillDetails] = useState({})
    const role = useRef('')
    const allSubCategories = useRef([])
    const totalSubCategories = useRef(-1)
    const subCategoryIndex = useRef(-1)

    const data = location.state?.data
    console.log('data', data)

    const [xp, setXP] = useState(0)
    const [diamondEarned, setDiamondEarned] = useState(0)
    const [celebrate, setCelebrate] = useState(false)

    // prettier-ignore
    const newUserLimit = useMemo(() => {
        return !isAuthenticated && Boolean(guest.score?.length >= NUMBER_OF_LIMIT_LESSON_FOR_GUEST)
    }, [isAuthenticated, guest])

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 30,
        elementCount: 100,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: '10px',
        height: '10px',
        perspective: '500px',
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    }

    const sound = new Howl({
        src: [Sound], // Replace with the path to your sound file
    })

    useEffect(() => {
        // Log to check if the sound file is loaded
        console.log('Sound loaded:', sound.state())

        // Ensure that the sound is loaded before playing
        sound.once('load', () => {
            console.log('Sound loaded:', sound.state())

            if (celebrate) {
                // Play the sound when celebrate state changes to true
                sound.play()
            }
        })

        // Load the sound
        sound.load()

        // Clean up the Howler.js sound object when the component is unmounted
        return () => {
            sound.unload()
        }
    }, [celebrate])

    const getSkillBySkillName = () => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/skills/${skillName}`,
            params: {
                newUser: Boolean(!isAuthenticated && guest._id),
            },
        }).then(res => {
            setSkillDetails(res.data.data[0])
            allSubCategories.current = res.data.data[0].sub_categories.filter(
                function (sub_category) {
                    return sub_category.category === category
                }
            )
            totalSubCategories.current = allSubCategories.current.length
            for (var i = 0; i < totalSubCategories.current; i++) {
                if (allSubCategories.current[i].sub_category === subcategory) {
                    subCategoryIndex.current = i
                    break
                }
            }
        })
    }

    // const getAllScores = newUser => {
    //     Axios({
    //         method: 'GET',
    //         withCredentials: true,
    //         url: `/server/allscores`,
    //         params: {
    //             newUser: newUser,
    //         },
    //     }).then(res => {
    //         // console.log("all scores ", res.data);
    //     })
    // }

    const calculateDiamondEarned = paramsScore => {
        if (paramsScore && paramsScore.length > 0) {
            let _diamondEarned = 0
            // sample paramsScore = [1, 0, 1, 0, 1]
            const correctAnswers = paramsScore.filter(s => s > 0)

            // all correct
            if (paramsScore.length === correctAnswers.length) {
                _diamondEarned = 3
            }
            // upto 2 wrong answers
            else if (correctAnswers.length + 2 >= paramsScore.length) {
                _diamondEarned = 2
            }
            // upto 3 wrong answers
            else if (correctAnswers.length + 3 >= paramsScore.length) {
                _diamondEarned = 1
            } else {
                _diamondEarned = 0
            }
            setDiamondEarned(_diamondEarned)
        }
    }

    const getUserInfo = async () => {
        auth_syncAndGetUser().then(result => {
            if (result?._id) {
                setXP(result?.xp?.current)
                // setDiamondEarned()
                role.current = result?.role
                // Put logic to show modal level up here

                if (isAuthenticated) {
                    if (
                        parseInt(user?.xp?.total) <
                            parseInt(result?.xp?.total) &&
                        parseInt(user?.xp?.level) < parseInt(result?.xp?.level)
                    ) {
                        dispatch(
                            app_setModalLevelUp({
                                open: true,
                                data: result?.xp,
                            })
                        )
                    }
                }
            }
        })
    }

    useEffect(() => {
        getUserInfo()
        calculateDiamondEarned(data.score.current)
        setCelebrate(true)
        getSkillBySkillName()

        // const newUser = searchParams.get('newUser')

        // if (newUser === 'true') {
        //     const storedScores =
        //         JSON.parse(sessionStorage.getItem('scores')) || []

        //     const matchingScores = storedScores.filter(
        //         scoreItem =>
        //             scoreItem.skill === skillName &&
        //             scoreItem.category === category
        //     )

        //     if (matchingScores.length >= 5) {
        //         const score = matchingScores.reduce(
        //             (acc, item) => acc + item.score,
        //             0
        //         )
        //         const points = matchingScores.reduce(
        //             (acc, item) => acc + item.points,
        //             0
        //         )

        //         setNewUserLimit(true)
        //     } else {
        //         setCelebrate(true)
        //         getSkillBySkillName(newUser)
        //         // getAllScores(newUser)

        //         const storedXp = sessionStorage.getItem('xp')
        //         if (storedXp) {
        //             setXP(parseInt(storedXp, 10))
        //         }
        //     }
        // } else {
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderStar = paramsDiamondEarned => {
        return (
            <>
                {Array(3)
                    .fill('')
                    .map((i, index) => (
                        <div key={String(index)}>
                            <img
                                src={
                                    paramsDiamondEarned > index
                                        ? StartFilled
                                        : StartFilledFade
                                }
                                alt='star'
                            />
                        </div>
                    ))}
            </>
        )
        // const correctAnswers = _score.filter(i => i > 0)
        // if (_score.length === correctAnswers.length) return renderStarImg(3)
        // else if (_score.length === correctAnswers.length + 1)
        //     return renderStarImg(2)
        // else if (_score.length === correctAnswers.length + 2)
        //     return renderStarImg(1)
        // else return renderStarImg()
    }

    const onClickRegister = () => {
        dispatch(auth_setOpenModalRegister(true))
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Score page</title>
            </Helmet>
            <div>
                <div className='FingoLessonCompleteHeader'>
                    <h2 className='text-center'>
                        {skillName.split('_').join(' ')} {'->'}{' '}
                        {category.split('_').join(' ')} {'->'}{' '}
                        {subcategory.split('_').join(' ')}
                    </h2>
                </div>

                {data ? (
                    <>
                        {newUserLimit ? (
                            <>
                                <Card.Header className='congratulation-card-header'>
                                    If you want to continue please Register
                                </Card.Header>
                                <Card.Body>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            variant='success'
                                            onClick={onClickRegister}
                                        >
                                            Register
                                        </Button>
                                    </div>
                                </Card.Body>
                            </>
                        ) : (
                            <div
                                className='FingoLessonComplete'
                                style={{ backgroundImage: `url('${BG}')` }}
                            >
                                <div className='LessonCompleteOverlay' />
                                <div className='confetti-container'>
                                    <Confetti
                                        active={celebrate}
                                        config={confettiConfig}
                                    />
                                </div>
                                <div className={`StarContainer count-3`}>
                                    {data?.score?.current &&
                                        diamondEarned &&
                                        renderStar(diamondEarned)}
                                </div>

                                <div className='FingoLessonCompleteContent'>
                                    <h2>You earned</h2>
                                    <h6>🍌{xp}</h6>
                                    <h6 className='ScorePageDiamondText'>
                                        <DiamondSvg /> {diamondEarned}
                                    </h6>
                                    <div className='relative flex flex-column mt-4'>
                                        {subCategoryIndex.current + 1 <
                                            totalSubCategories.current && (
                                            <>
                                                <FingoButton
                                                    color='white'
                                                    style={{
                                                        borderRadius: '12px',
                                                    }}
                                                    onClick={() => {
                                                        const newUserQueryParam =
                                                            !isAuthenticated
                                                                ? '?newUser=true'
                                                                : ''
                                                        navigate(
                                                            `/skills/${skillName}/${category}/${
                                                                allSubCategories
                                                                    .current[
                                                                    subCategoryIndex.current +
                                                                        1
                                                                ].sub_category
                                                            }/information/${0}${newUserQueryParam}`
                                                        )
                                                    }}
                                                >
                                                    Next: Start with{' '}
                                                    {allSubCategories.current[
                                                        subCategoryIndex.current +
                                                            1
                                                    ].sub_category
                                                        .split('_')
                                                        .join(' ')}
                                                </FingoButton>
                                            </>
                                        )}
                                        {subCategoryIndex.current + 1 ===
                                            totalSubCategories.current && (
                                            <>
                                                <FingoButton
                                                    color='white'
                                                    onClick={() => {
                                                        navigate(
                                                            `/skills/${skillName}/${category}`
                                                        )
                                                    }}
                                                >
                                                    Go Back!!
                                                </FingoButton>{' '}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    'Loading'
                )}
                <br />
                <br />
            </div>
            <FingoModalLevelUp isFormScorePage={true} />
        </FingoHomeLayout>
    )
}

export default ScorePage
