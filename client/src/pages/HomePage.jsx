/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import Axios from 'src/api/axios'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet'
import Card from 'react-bootstrap/Card'

import emoji1 from 'src/images/emojis/seedling.png'
import emoji2 from 'src/images/emojis/bulb.png'
import emoji3 from 'src/images/emojis/sunglasses.png'
import emoji4 from 'src/images/emojis/moneybag.png'
import emoji5 from 'src/images/emojis/turtle.png'
import emoji6 from 'src/images/emojis/ghost.png'
import emoji7 from 'src/images/emojis/house.png'
import emoji8 from 'src/images/emojis/robot_face.png'
import emoji9 from 'src/images/emojis/64918-united-money-dollar-sign-states-emoji.png'
import emoji10 from 'src/images/emojis/64926-emoticon-domain-network-sticker-graphics-emoji-portable.png'
import emoji11 from 'src/images/emojis/64944-emoticon-index-finger-the-gesture-emoji.png'
import emoji12 from 'src/images/emojis/64983-emoticon-sunglasses-smiley-iphone-go-emoji.png'
import emoji13 from 'src/images/emojis/64997-emoticon-on-money-keep-bag-carving-emoji.png'
import emoji14 from 'src/images/emojis/64998-money-dollar-sign-currency-android-emoji.png'
import emoji15 from 'src/images/emojis/65000-hunter_-monster-language-meaning-speech-world-emoji.png'
import emoji16 from 'src/images/emojis/58683-color-padlock-sms-apple-emoji-hd-image-free-png.png'
import emoji17 from 'src/images/emojis/5-money-bag-png-image.png'
import emoji18 from 'src/images/emojis/65023-thought-thinking-emoji-free-hq-image.png'
import emoji19 from 'src/images/emojis/65025-emoticon-like-signal-emoji-button-thumb.png'
import emoji20 from 'src/images/emojis/67366-hamburger-fries-cheeseburger-veggie-french-burger-emoji.png'
import emoji21 from 'src/images/emojis/71577-recycling-recycle-symbol-paper-emoji-free-hq-image.png'
import emoji22 from 'src/images/emojis/72527-purple-symbol-viber-circle-violet-hd-image-free-png.png'
import emoji23 from 'src/images/emojis/73728-emoticon-smiley-peace-emojis-laughter-emoji.png'
import emoji24 from 'src/images/emojis/77525-emojipedia-iphone-world-whatsapp-telefono-day-emoji.png'
import emoji25 from 'src/images/emojis/81204-all-xbox-game-video-accessory-emoji.png'
import emoji26 from 'src/images/emojis/101756-career-emoji-download-hq.png'
import emoji27 from 'src/images/emojis/101916-emoji-cool-free-download-image.png'
import emoji28 from 'src/images/emojis/102587-funny-picture-emoji-boy-free-download-png-hq.png'
import emoji29 from 'src/images/emojis/103180-hobby-emoji-free-transparent-image-hd.png'
import emoji30 from 'src/images/emojis/103188-hobby-emoji-free-download-image.png'
import emoji31 from 'src/images/emojis/103498-party-picture-hard-emoji-free-download-image.png'
import emoji32 from 'src/images/emojis/103717-blue-photos-sky-emoji-free-transparent-image-hq.png'
import lock from 'src/images/lock.png'

import Dropdown from 'react-bootstrap/Dropdown'
import { MDBBtn } from 'mdb-react-ui-kit'
import 'src/styles/file.css'
import { useSnapCarousel } from 'react-snap-carousel'
import { FingoHomeLayout } from 'src/components/layouts'
import FingoWidgetContainer from 'src/components/FingoWidgetContainer'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks'
import { FingoScrollToTop } from 'src/components/layouts/FingoHomeLayout'
import FingoModalLevelUp from 'src/components/FingoModalLevelUp'
import { authUtils } from 'src/utils'
import ModalListReward from 'src/components/reward/ModalListReward'
import ModalRewardDetail from 'src/components/reward/ModalRewardDetail'
import { ModalFormReward } from 'src/components/reward'
import { ModalVerifyAction } from 'src/components/admin'
import ModalInfoEarnDiamond from 'src/components/reward/ModalInfoEarnDiamond'
import ModalListMyReward from 'src/components/reward/ModalListMyReward'
import ModalClaimReward from 'src/components/reward/ModalClaimReward'

////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents email of the logged in email
////join room is the invitation link to which user must be redirected to
const HomePage = props => {
    const dispatch = useDispatch()
    const token = authUtils.getUserAccessToken()
    const {
        auth_setOpenModalRegister,
        auth_syncAndGetUser,
        newUser,
        user,
        isAuthenticated,
    } = useAuth()
    const [searchValue, setSearchValue] = useState('')
    const [skills, setSkills] = useState([])
    const [selectedSkill, setSelectedSkill] = useState(null)
    const [categories, setCategories] = useState([])
    const [filteredQueries, setFilteredQueries] = useState([])
    const [lastPlayed, setLastPlayed] = useState(null)
    const [continueHeader, setContinueHeader] = useState('')
    const [continueButtonHeader, setContinueButtonHeader] = useState('')
    const [navigateTo, setNavigateTo] = useState(null)
    const [completedSkills, setCompletedSkills] = useState([])
    const [completedCategories, setCompletedCategories] = useState([])
    const navigate = useNavigate()

    // const [xp, setXP] = useState({ dailyXP: 0, totalXP: 0 })

    const { scrollRef, next, prev } = useSnapCarousel()

    const emojis = [
        emoji1,
        emoji2,
        emoji3,
        emoji4,
        emoji5,
        emoji6,
        emoji7,
        emoji8,
        emoji9,
        emoji10,
        emoji11,
        emoji12,
        emoji13,
        emoji14,
        emoji15,
        emoji16,
        emoji17,
        emoji18,
        emoji19,
        emoji20,
        emoji21,
        emoji22,
        emoji23,
        emoji24,
        emoji25,
        emoji26,
        emoji27,
        emoji28,
        emoji29,
        emoji30,
        emoji31,
        emoji32,
    ]

    const onChangeSearchValue = event => {
        setSearchValue(event.target.value)
        var tempFilteredQueries = []

        skills.forEach(skill => {
            const searchTerm = event.target.value.toLowerCase()
            const skillName = skill.skill.toLowerCase()

            if (searchTerm && skillName.includes(searchTerm)) {
                tempFilteredQueries.push({
                    type: 'skill',
                    skill: skill.skill,
                    name: skill.skill,
                })
            }

            // console.log('categories', skill.categories);
            // (skill.categories).forEach((category) => {
            //   if(searchTerm && category.includes(searchTerm)){
            //     tempFilteredQueries.push(category);
            //   }
            // })

            for (var i = 0; i < skill.categories.length; i++) {
                var category = skill.categories[i]
                if (searchTerm && category.toLowerCase().includes(searchTerm)) {
                    tempFilteredQueries.push({
                        type: 'category',
                        skill: skill.skill,
                        category: category,
                        name: category,
                    })
                }
            }

            skill.sub_categories.forEach(subCategory => {
                const subCategoryName = subCategory.sub_category
                if (
                    searchTerm &&
                    subCategoryName.toLowerCase().includes(searchTerm)
                ) {
                    tempFilteredQueries.push({
                        type: 'subcategory',
                        skill: skill.skill,
                        category: subCategory.category,
                        sub_category: subCategoryName,
                        name: subCategoryName,
                    })
                }
            })
        })

        setFilteredQueries(tempFilteredQueries.slice(0, 10))
        // console.log('tempFilteredQueries', tempFilteredQueries);
    }

    const onSearch = searchTerm => {
        setSearchValue(searchTerm)
        // our api to fetch the search result
        // console.log("search ", searchTerm);
        if (searchTerm.type === 'skill') navigate(`/skills/${searchTerm.skill}`)
        else if (searchTerm.type === 'category')
            navigate(`/skills/${searchTerm.skill}/${searchTerm.category}`)
        else
            navigate(
                `/skills/${searchTerm.skill}/${searchTerm.category}/${searchTerm.sub_category}/information/0`
            )
        window.location.reload()
    }

    const getSkills = last_played => {
        Axios({
            method: 'GET',
            url: '/server/skills',
            params: {
                newUser: newUser,
            },
        }).then(res => {
            setSkills(res.data.data)
            // setSelectedSkill(res.data.data[0].skill);
            // console.log('last_played', last_played);
            if (last_played && Object.entries(last_played).length > 0) {
                if (last_played?.skill === null) {
                    // console.log('skill is null');
                    setContinueHeader('Explore new Skills')
                } else {
                    var tempSkills = res.data.data
                    var ind
                    for (var i = 0; i < tempSkills.length; i++) {
                        if (tempSkills[i].skill === last_played.skill) ind = i
                    }
                    // console.log('last_played', last_played);
                    // console.log("ind", ind);
                    var lastPlayedSkill = tempSkills[ind]
                    var subCategories = []
                    lastPlayedSkill.sub_categories.forEach(
                        function (subCategory) {
                            if (subCategory.category === last_played.category) {
                                subCategories = subCategories.concat(
                                    subCategory.sub_category
                                )
                            }
                        }
                    )
                    var categories = lastPlayedSkill.categories
                    // console.log('categories', categories);
                    // console.log('subCategories', subCategories);

                    var subCategoryIndex = subCategories.indexOf(
                        last_played.sub_category
                    )
                    var categoryIndex = categories.indexOf(last_played.category)

                    if (subCategoryIndex + 1 < subCategories.length) {
                        // console.log('continue with subCategoryIndex', subCategories[subCategoryIndex+1]);
                        setContinueHeader(
                            'In Progress: ' +
                                last_played.skill +
                                ' -> ' +
                                last_played.category
                        )
                        setContinueButtonHeader(
                            subCategories[subCategoryIndex + 1]
                        )
                        setNavigateTo(
                            `/skills/${last_played.skill}/${
                                last_played.category
                            }/${
                                subCategories[subCategoryIndex + 1]
                            }/information/${0}`
                        )
                    } else if (categoryIndex + 1 < categories.length) {
                        // console.log('continue with categoryIndex', categories[categoryIndex+1]);
                        setContinueHeader('In Progress: ' + last_played.skill)
                        setContinueButtonHeader(categories[categoryIndex + 1])
                        setNavigateTo(
                            `/skills/${last_played.skill}/${
                                categories[categoryIndex + 1]
                            }`
                        )
                    } else {
                        // console.log('explore new skill');
                        setContinueHeader('Explore new Skills')
                    }
                }
            } else {
                // console.log('last played not set');
                setContinueHeader('Explore new Skills')
            }
        })
    }

    const getCategories = forSkill => {
        Axios({
            method: 'GET',
            url: `/server/categories/${forSkill}`,
            params: {
                newUser: newUser,
            },
        }).then(res => {
            // console.log('categories', res.data);
            setCategories(res.data.data)
        })
    }

    // When a skill is completed
    const markSkillAsCompleted = skill => {
        setCompletedSkills([...completedSkills, skill])
    }

    // When a category is completed
    const markCategoryAsCompleted = category => {
        setCompletedCategories([...completedCategories, category])
    }

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page

    useEffect(() => {
        auth_syncAndGetUser().then(result => {
            if (result?._id) {
                setLastPlayed(result.last_played)
                getSkills(result.last_played)
            } else {
                getSkills({})
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser])

    const storedScores = newUser
        ? JSON.parse(sessionStorage.getItem('scores')) || []
        : user
          ? user.score
          : []

    const storedLastPlayed = newUser
        ? JSON.parse(sessionStorage.getItem('lastPlayed')) || null
        : null

    let subTopicsCompleted = 0

    let lastSkillPercent = 0

    if (newUser && skills.length) {
        skills.forEach(skill => {
            skill.categories.forEach(category => {
                const chaptersCount = skill.sub_categories.filter(
                    s => s.category === category
                ).length
                const userChaptersCount = storedScores.filter(
                    i => i.skill === skill.skill && i.category === category
                ).length

                if (
                    chaptersCount === userChaptersCount &&
                    chaptersCount !== 0
                ) {
                    subTopicsCompleted++
                }
            })
        })

        if (storedLastPlayed && storedLastPlayed.skill) {
            const lastAllSubCategories = skills.find(
                s => s.skill === storedLastPlayed.skill
            ).sub_categories.length
            const userLastSubCategories = storedScores.filter(
                s => s.skill === storedLastPlayed.skill
            ).length
            lastSkillPercent = Math.round(
                (userLastSubCategories / lastAllSubCategories) * 100
            )
        }
    } else if (user && skills.length) {
        skills.forEach(skill => {
            skill.categories.forEach(category => {
                const chaptersCount = skill.sub_categories.filter(
                    s => s.category === category
                ).length
                const userChaptersCount = user.score.filter(
                    i => i.skill === skill.skill && i.category === category
                ).length

                if (
                    chaptersCount === userChaptersCount &&
                    chaptersCount !== 0
                ) {
                    subTopicsCompleted++
                }
            })
        })

        if (lastPlayed && lastPlayed.skill) {
            const lastAllSubCategories = skills.find(
                s => s.skill === lastPlayed.skill
            ).sub_categories.length
            const userLastSubCategories = user.score.filter(
                s => s.skill === lastPlayed.skill
            ).length
            lastSkillPercent = Math.round(
                (userLastSubCategories / lastAllSubCategories) * 100
            )
        }
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Home</title>
            </Helmet>
            {/* <Navbar proprole={role} newUser={newUser}/> */}
            <div className='container-fluid px-2'>
                <div className='row h-auto'>
                    <div className='FingoHomeMainContent relative col-md-8 order-md-1 order-2'>
                        <div className='container'>
                            <div className='row h-auto'>
                                <div className='col-12 px-0'>
                                    <Card className='welcome-card homePage-welcome-card'>
                                        <Card.Body>
                                            {newUser ? (
                                                <Card.Text
                                                    className='welcome-card-text'
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>
                                                        You can start with the
                                                        &nbsp;
                                                        <strong
                                                            style={{
                                                                textDecoration:
                                                                    'underline',
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {skills[0]?.skill
                                                                .split('_')
                                                                .join(' ')}
                                                        </strong>
                                                        &nbsp; track
                                                    </span>
                                                </Card.Text>
                                            ) : continueHeader !==
                                                  'Explore new Skills' &&
                                              lastPlayed &&
                                              lastPlayed.skill ? (
                                                <Card.Text
                                                    className='welcome-card-text'
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>
                                                        You are enrolled in the
                                                        &nbsp;
                                                        <strong
                                                            style={{
                                                                textDecoration:
                                                                    'underline',
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {lastPlayed.skill
                                                                .split('_')
                                                                .join(' ')}
                                                        </strong>
                                                        &nbsp; track
                                                    </span>
                                                </Card.Text>
                                            ) : null}

                                            <Card.Text
                                                className='welcome-card-text'
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {continueHeader !==
                                                    'Explore new Skills' &&
                                                continueButtonHeader ? (
                                                    <>
                                                        Continue with 👉 &nbsp;
                                                        <Button
                                                            style={{
                                                                width: '40%',
                                                                backgroundColor:
                                                                    '#28a745',
                                                                borderColor:
                                                                    '#28a745',
                                                                padding: '5px',
                                                                borderRadius:
                                                                    '7px',
                                                                boxShadow:
                                                                    '0px 7px #1a5928',
                                                                transition:
                                                                    '0.2s ease',
                                                                fontWeight:
                                                                    '800',
                                                                marginTop:
                                                                    '4px',
                                                            }}
                                                            className='getStarted welcome-card-button'
                                                            variant='success'
                                                            onClick={() =>
                                                                navigate(
                                                                    navigateTo
                                                                )
                                                            }
                                                        >
                                                            {continueButtonHeader
                                                                .split('_')
                                                                .join(' ')}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    '1.1em',
                                                            }}
                                                        >
                                                            Start with 👉
                                                        </span>{' '}
                                                        &nbsp;
                                                        <Button
                                                            style={{
                                                                width: '40%',
                                                                backgroundColor:
                                                                    '#28a745',
                                                                borderColor:
                                                                    '#28a745',
                                                                padding: '5px',
                                                                borderRadius:
                                                                    '7px',
                                                                boxShadow:
                                                                    '0px 7px #1a5928',
                                                                transition:
                                                                    '0.2s ease',
                                                                fontWeight:
                                                                    '800',
                                                                marginTop:
                                                                    '4px',
                                                            }}
                                                            className='getStarted welcome-card-button'
                                                            variant='success'
                                                            onClick={() =>
                                                                navigate(
                                                                    `/skills/Investing/Start_Here/Stocks/information/0${
                                                                        newUser
                                                                            ? '?newUser=true'
                                                                            : ''
                                                                    }`
                                                                )
                                                            }
                                                        >
                                                            What are Stocks?
                                                        </Button>
                                                    </>
                                                )}
                                            </Card.Text>
                                            {(continueHeader !==
                                                'Explore new Skills' &&
                                                lastPlayed) ||
                                            newUser ? (
                                                <div className='topic-percent welcome-card-text'>
                                                    <div className='grey-percent'>
                                                        <div
                                                            className='green-percent'
                                                            style={{
                                                                width: `${lastSkillPercent}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    {lastSkillPercent}%
                                                </div>
                                            ) : null}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            <div className='row h-auto'>
                                <div className='col-8 px-0 '>
                                    <div className='search-container mt-4 mb-6'>
                                        <form className='d-flex input-group'>
                                            <div className='input-container'>
                                                <input
                                                    type='search'
                                                    value={searchValue}
                                                    width='100%'
                                                    onChange={
                                                        onChangeSearchValue
                                                    }
                                                    className='form-control mr-4 input-search'
                                                    placeholder='Search Here!'
                                                    aria-label='Search'
                                                    disabled={newUser}
                                                />
                                                <MDBBtn
                                                    className='search-button'
                                                    color='success'
                                                    onClick={() =>
                                                        onSearch(searchValue)
                                                    }
                                                    style={{
                                                        boxShadow:
                                                            '0px 7px #1a5928',
                                                    }}
                                                    disabled={
                                                        !searchValue.trim()
                                                    }
                                                >
                                                    Search
                                                </MDBBtn>
                                                <Dropdown.Menu
                                                    show={searchValue !== ''}
                                                >
                                                    {filteredQueries.map(
                                                        (item, i) => (
                                                            <Dropdown.Item
                                                                key={i}
                                                                onClick={() =>
                                                                    onSearch(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                {item.name
                                                                    ? item.name
                                                                          .split(
                                                                              '_'
                                                                          )
                                                                          .join(
                                                                              ' '
                                                                          )
                                                                    : ''}
                                                            </Dropdown.Item>
                                                        )
                                                    )}
                                                </Dropdown.Menu>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-8 px-0 mb-2'>
                                    <h3 style={{ fontWeight: '800' }}>
                                        {newUser ? 'Explore  ' : 'Explore'}
                                        <span style={{ fontSize: '65%' }}>
                                            <span>{newUser ? '(' : ''}</span>
                                            <span>
                                                {newUser ? (
                                                    <a
                                                        href='#'
                                                        onClick={() =>
                                                            dispatch(
                                                                auth_setOpenModalRegister(
                                                                    true
                                                                )
                                                            )
                                                        }
                                                        style={{
                                                            color: '#28a745',
                                                        }}
                                                    >
                                                        Signup
                                                    </a>
                                                ) : (
                                                    ''
                                                )}
                                            </span>
                                            {newUser
                                                ? ' for free to get full access.)'
                                                : ''}
                                            {/* <span style={{ color:'#28a745', textDecoration: 'underline', textDecorationColor: '#28a745'}}>{newUser?'free' : ''}</span> */}
                                            {/* <span>{newUser?<a href="#" onClick={() => dispatch(auth_setOpenModalRegister(true))} style={{color:'#28a745'}}>Signup</a> : ''}</span> */}
                                        </span>
                                    </h3>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 px-0'>
                                    {skills.length ? (
                                        <div className='snapCarousel'>
                                            <ul
                                                ref={scrollRef}
                                                style={{
                                                    display: 'flex',
                                                    overflowY: 'hidden',
                                                    scrollSnapType:
                                                        'x mandatory',
                                                    padding: '0',
                                                    width: '100%',
                                                    // marginLeft: '15px'
                                                }}
                                            >
                                                {skills.map((skill, index) => (
                                                    <li
                                                        key={index}
                                                        style={{
                                                            listStyleType:
                                                                'none',
                                                        }}
                                                    >
                                                        <button
                                                            className={
                                                                'rounded-rectangle ' +
                                                                (skill.skill ===
                                                                selectedSkill
                                                                    ? 'active '
                                                                    : ' ') +
                                                                `color${
                                                                    index + 1
                                                                }`
                                                            }
                                                            value={skill.skill}
                                                            onClick={e => {
                                                                setSelectedSkill(
                                                                    e.target
                                                                        .value
                                                                )
                                                                getCategories(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }}
                                                        >
                                                            {skill.skill
                                                                ? skill.skill
                                                                      .split(
                                                                          '_'
                                                                      )
                                                                      .join(' ')
                                                                : ''}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>Wait for it...</p>
                                    )}
                                </div>
                                <div className='col-12'>
                                    <div className='row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 justify-content-center'>
                                        {categories.length && selectedSkill
                                            ? categories.map(
                                                  (category, idx) => {
                                                      const catCount = skills
                                                          .find(
                                                              s =>
                                                                  s.skill ===
                                                                  selectedSkill
                                                          )
                                                          .sub_categories.filter(
                                                              s =>
                                                                  s.category ===
                                                                  category
                                                          ).length
                                                      let userCatCount
                                                      if (newUser) {
                                                          // Retrieve the scores from localStorage
                                                          const scores =
                                                              JSON.parse(
                                                                  sessionStorage.getItem(
                                                                      'scores'
                                                                  )
                                                              ) || []
                                                          // Filter the scores by selectedSkill and category
                                                          userCatCount =
                                                              scores.filter(
                                                                  s =>
                                                                      s.skill ===
                                                                          selectedSkill &&
                                                                      s.category ===
                                                                          category
                                                              ).length
                                                      } else {
                                                          userCatCount =
                                                              user &&
                                                              user.score
                                                                  .filter(
                                                                      s =>
                                                                          s.skill ===
                                                                          selectedSkill
                                                                  )
                                                                  .filter(
                                                                      s =>
                                                                          s.category ===
                                                                          category
                                                                  ).length
                                                      }
                                                      const percent =
                                                          catCount !== 0
                                                              ? Math.round(
                                                                    (userCatCount /
                                                                        catCount) *
                                                                        100
                                                                )
                                                              : 0

                                                      return (
                                                          <div
                                                              className='col px-sm-0 d-flex align-items-center justify-content-center'
                                                              key={idx}
                                                          >
                                                              <Card
                                                                  className={`skill-card topic-card mt-1 mb-5 d-flex justify-content-center align-items-center`}
                                                                  style={{
                                                                      border: '',
                                                                      width: '180px',
                                                                      height: '210px',
                                                                      margin: '10px',
                                                                      padding:
                                                                          '10px', // Adjust padding as needed
                                                                      borderRadius:
                                                                          '15px', // Increased border-radius
                                                                  }}
                                                              >
                                                                  {newUser &&
                                                                  idx > 2 ? (
                                                                      <div className='card-overlay'>
                                                                          <img
                                                                              src={
                                                                                  lock
                                                                              }
                                                                              alt='Locked'
                                                                              style={{
                                                                                  width: '50px',
                                                                              }}
                                                                          />
                                                                      </div>
                                                                  ) : (
                                                                      <>
                                                                          <Card.Body className='d-flex justify-content-center align-items-center'>
                                                                              <div
                                                                                  className='category-circle-green'
                                                                                  style={{
                                                                                      background: `conic-gradient(#28a745 0% ${percent}%, #ffffff ${percent}% 100%)`,
                                                                                  }}
                                                                              >
                                                                                  <div className='category-circle-grey'>
                                                                                      <Card.Img
                                                                                          variant='top'
                                                                                          src={
                                                                                              emojis[
                                                                                                  idx
                                                                                              ] ||
                                                                                              'https://via.placeholder.com/50'
                                                                                          }
                                                                                          alt={
                                                                                              category
                                                                                          }
                                                                                          style={{
                                                                                              width: '50px',
                                                                                              height: '50px',
                                                                                              borderRadius:
                                                                                                  '50%',
                                                                                          }}
                                                                                          className='mx-auto'
                                                                                      />
                                                                                  </div>
                                                                              </div>
                                                                          </Card.Body>
                                                                          <Card.Body className='d-flex justify-content-center align-items-center'>
                                                                              <Button
                                                                                  variant='success'
                                                                                  style={{
                                                                                      boxShadow:
                                                                                          '0px 7px #1a5928',
                                                                                  }}
                                                                                  value={
                                                                                      category
                                                                                  }
                                                                                  onClick={() =>
                                                                                      navigate(
                                                                                          `/skills/${selectedSkill}/${category}${
                                                                                              newUser
                                                                                                  ? '?newUser=true'
                                                                                                  : ''
                                                                                          }`
                                                                                      )
                                                                                  }
                                                                                  disabled={
                                                                                      newUser &&
                                                                                      idx >
                                                                                          2
                                                                                  }
                                                                              >
                                                                                  {category
                                                                                      ? category
                                                                                            .split(
                                                                                                '_'
                                                                                            )
                                                                                            .join(
                                                                                                ' '
                                                                                            )
                                                                                      : ''}
                                                                              </Button>
                                                                          </Card.Body>
                                                                      </>
                                                                  )}
                                                              </Card>
                                                          </div>
                                                      )
                                                  }
                                              )
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FingoScrollToTop />
                    </div>
                    <div className='col-md-4 order-md-2 order-1 mb-2'>
                        <FingoWidgetContainer />
                    </div>
                </div>
            </div>
            <ModalFormReward />
            <FingoModalLevelUp />
            <ModalListReward />
            <ModalRewardDetail />
            <ModalVerifyAction />
            <ModalInfoEarnDiamond />
            <ModalListMyReward />
            <ModalClaimReward />
        </FingoHomeLayout>
    )
}

export default HomePage
