import React, { useRef, useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar";
import Button from "react-bootstrap/Button";
import { Row, Col, ProgressBar, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ListGroup from "react-bootstrap/ListGroup";
// import "../DarkMode.css";
import image0 from "../images/Investing.png";
import image1 from "../images/Fixed.png";
import image2 from "../images/Economics.png";
import image3 from "../images/Personal.png";
import image4 from "../images/Trading.png";
import image5 from "../images/Crypto.png";
import image6 from "../images/Insurance.png";
import image7 from "../images/Sector.png";

import emoji1 from "../images/emojis/seedling.png";
import emoji2 from "../images/emojis/bulb.png";
import emoji3 from "../images/emojis/sunglasses.png";
import emoji4 from "../images/emojis/moneybag.png";
import emoji5 from "../images/emojis/turtle.png";
import emoji6 from "../images/emojis/ghost.png";
import emoji7 from "../images/emojis/house.png";
import emoji8 from "../images/emojis/robot_face.png";
import emoji9 from "../images/emojis/64918-united-money-dollar-sign-states-emoji.png";
import emoji10 from "../images/emojis/64926-emoticon-domain-network-sticker-graphics-emoji-portable.png";
import emoji11 from "../images/emojis/64944-emoticon-index-finger-the-gesture-emoji.png";
import emoji12 from "../images/emojis/64983-emoticon-sunglasses-smiley-iphone-go-emoji.png";
import emoji13 from "../images/emojis/64997-emoticon-on-money-keep-bag-carving-emoji.png";
import emoji14 from "../images/emojis/64998-money-dollar-sign-currency-android-emoji.png";
import emoji15 from "../images/emojis/65000-hunter_-monster-language-meaning-speech-world-emoji.png";
import emoji16 from "../images/emojis/58683-color-padlock-sms-apple-emoji-hd-image-free-png.png";
import emoji17 from "../images/emojis/5-money-bag-png-image.png";
import emoji18 from "../images/emojis/65023-thought-thinking-emoji-free-hq-image.png";
import emoji19 from "../images/emojis/65025-emoticon-like-signal-emoji-button-thumb.png";
import emoji20 from "../images/emojis/67366-hamburger-fries-cheeseburger-veggie-french-burger-emoji.png";
import emoji21 from "../images/emojis/71577-recycling-recycle-symbol-paper-emoji-free-hq-image.png";
import emoji22 from "../images/emojis/72527-purple-symbol-viber-circle-violet-hd-image-free-png.png";
import emoji23 from "../images/emojis/73728-emoticon-smiley-peace-emojis-laughter-emoji.png";
import emoji24 from "../images/emojis/77525-emojipedia-iphone-world-whatsapp-telefono-day-emoji.png";
import emoji25 from "../images/emojis/81204-all-xbox-game-video-accessory-emoji.png";
import emoji26 from "../images/emojis/101756-career-emoji-download-hq.png";
import emoji27 from "../images/emojis/101916-emoji-cool-free-download-image.png";
import emoji28 from "../images/emojis/102587-funny-picture-emoji-boy-free-download-png-hq.png";
import emoji29 from "../images/emojis/103180-hobby-emoji-free-transparent-image-hd.png";
import emoji30 from "../images/emojis/103188-hobby-emoji-free-download-image.png";
import emoji31 from "../images/emojis/103498-party-picture-hard-emoji-free-download-image.png";
import emoji32 from "../images/emojis/103717-blue-photos-sky-emoji-free-transparent-image-hq.png";


import Dropdown from "react-bootstrap/Dropdown";
import { MDBBtn } from "mdb-react-ui-kit";
import "../styles/file.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaCalendar, FaStar, FaTrophy, FaMedal, FaFire } from "react-icons/fa";
import DarkMode from "../components/DarkMode";
import { useSnapCarousel } from "react-snap-carousel";

////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents email of the logged in email
////join room is the invitation link to which user must be redirected to
const Home = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [userName, setUserName] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [categories, setCategories] = useState([]);
  const role = useRef("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [user, setUser] = useState(null);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [continueHeader, setContinueHeader] = useState("");
  const [continueButtonHeader, setContinueButtonHeader] = useState("");
  const [navigateTo, setNavigateTo] = useState(null);
  const [completedSkills, setCompletedSkills] = useState([]);
  const [completedCategories, setCompletedCategories] = useState([]);
  const navigate = useNavigate();

  const [xp, setXP] = useState({ dailyXP: 0, totalXP: 0 });
  const [lastCompletedDay, SetLastCompletedDay] = useState(0);
  const [completedDays, SetCompletedDays] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");

  const [index, setIndex] = useState(0);

  const { scrollRef, next, prev } = useSnapCarousel();

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    // Perform necessary actions with the uploaded file
    // For example, you can upload the file to a server or store it in the state
    const formData = new FormData();
    formData.append('photo', file);

    Axios({
      method: "POST",
      data: formData,
      withCredentials: true,
      url: "/server/updateProfilePhoto",
    }).then(function(response) {
      setProfilePicture(response.data.imageUrl);
    }).catch(error => {
      console.error("Error uploading file:", error);
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const now = new Date();
  const todayDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));

  const year = todayDate.getUTCFullYear();
  const month = todayDate.getUTCMonth();
  const day = todayDate.getUTCDate();

  const today = new Date(Date.UTC(year, month, day));

  const dayOfWeek = (today.getDay() + 6) % 7;

  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6
  );

  const statistics = [
    {
      title: "Daily Streak",
      value: user ? user.streak : 0,
      icon: FaCalendar,
      color: "#F9C80E",
      streak: FaFire,
    },
  ];

  const images = [
    image0,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
  ];

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

  const onChangeSearchValue = (event) => {
    setSearchValue(event.target.value);
    var tempFilteredQueries = [];

    skills.forEach((skill) => {
      const searchTerm = event.target.value.toLowerCase();
      const skillName = skill.skill.toLowerCase();

      if (searchTerm && skillName.includes(searchTerm)) {
        tempFilteredQueries.push({
          type: "skill",
          skill: skill.skill,
          name: skill.skill,
        });
      }

      // console.log('categories', skill.categories);
      // (skill.categories).forEach((category) => {
      //   if(searchTerm && category.includes(searchTerm)){
      //     tempFilteredQueries.push(category);
      //   }
      // })

      for (var i = 0; i < skill.categories.length; i++) {
        var category = skill.categories[i];
        if (searchTerm && category.toLowerCase().includes(searchTerm)) {
          tempFilteredQueries.push({
            type: "category",
            skill: skill.skill,
            category: category,
            name: category,
          });
        }
      }

      skill.sub_categories.forEach((subCategory) => {
        const subCategoryName = subCategory.sub_category;
        if (
          searchTerm &&
          subCategoryName.toLowerCase().includes(searchTerm)
        ) {
          tempFilteredQueries.push({
            type: "subcategory",
            skill: skill.skill,
            category: subCategory.category,
            sub_category: subCategoryName,
            name: subCategoryName,
          });
        }
      });
    });

    setFilteredQueries(tempFilteredQueries.slice(0, 10));
    // console.log('tempFilteredQueries', tempFilteredQueries);
  };

  const onSearch = (searchTerm) => {
    setSearchValue(searchTerm);
    // our api to fetch the search result
    // console.log("search ", searchTerm);
    if (searchTerm.type === "skill")
      navigate(`/skills/${searchTerm.skill}`);
    else if (searchTerm.type === "category")
      navigate(`/skills/${searchTerm.skill}/${searchTerm.category}`);
    else
      navigate(
        `/skills/${searchTerm.skill}/${searchTerm.category}/${searchTerm.sub_category}/information/0`
      );
    window.location.reload();
  };

  const getSkills = (last_played) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "/server/skills",
    }).then((res) => {
      // console.log('res.data skills', res.data.data);
      setSkills(res.data.data);
      // setSelectedSkill(res.data.data[0].skill);
      // console.log('last_played', last_played);
      if (Object.entries(last_played).length > 0) {
        if (last_played.skill === null) {
          // console.log('skill is null');
          setContinueHeader("Explore new Skills");
        } else {
          var tempSkills = res.data.data;
          var ind;
          for (var i = 0; i < tempSkills.length; i++) {
            if (tempSkills[i].skill === last_played.skill) ind = i;
          }
          // console.log('last_played', last_played);
          // console.log("ind", ind);
          var lastPlayedSkill = tempSkills[ind];
          var subCategories = [];
          lastPlayedSkill.sub_categories.forEach(function(
            subCategory
          ) {
            if (subCategory.category === last_played.category) {
              subCategories = subCategories.concat(
                subCategory.sub_category
              );
            }
          });
          var categories = lastPlayedSkill.categories;
          // console.log('categories', categories);
          // console.log('subCategories', subCategories);

          var subCategoryIndex = subCategories.indexOf(
            last_played.sub_category
          );
          var categoryIndex = categories.indexOf(
            last_played.category
          );

          if (subCategoryIndex + 1 < subCategories.length) {
            // console.log('continue with subCategoryIndex', subCategories[subCategoryIndex+1]);
            setContinueHeader(
              "In Progress: " +
              last_played.skill +
              " -> " +
              last_played.category
            );
            setContinueButtonHeader(
              subCategories[subCategoryIndex + 1]
            );
            setNavigateTo(
              `/skills/${last_played.skill}/${last_played.category
              }/${subCategories[subCategoryIndex + 1]
              }/information/${0}`
            );
          } else if (categoryIndex + 1 < categories.length) {
            // console.log('continue with categoryIndex', categories[categoryIndex+1]);
            setContinueHeader("In Progress: " + last_played.skill);
            setContinueButtonHeader(categories[categoryIndex + 1]);
            setNavigateTo(
              `/skills/${last_played.skill}/${categories[categoryIndex + 1]
              }`
            );
          } else {
            // console.log('explore new skill');
            setContinueHeader("Explore new Skills");
          }
        }
      } else {
        // console.log('last played not set');
        setContinueHeader("Explore new Skills");
      }
    });
  };

  const getCategories = (forSkill) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `/server/categories/${forSkill}`,
    }).then((res) => {
      // console.log('categories', res.data);
      setCategories(res.data.data);
    });
  };

  // When a skill is completed
  const markSkillAsCompleted = (skill) => {
    setCompletedSkills([...completedSkills, skill]);
  };

  // When a category is completed
  const markCategoryAsCompleted = (category) => {
    setCompletedCategories([...completedCategories, category]);
  };

  ////to authenticate user before allowing him to enter the home page
  ////if he is not redirect him to login page
  useEffect(() => {
    // console.log("in use effect");
    Axios({
      method: "GET",
      withCredentials: true,
      url: "/server/login",
    }).then(function(response) {
      if (response.data.redirect == "/login") {
        // console.log("Please log in");
        navigate(`/auth/login`);
      } else if (response.data.redirect == "/updateemail") {
        navigate("/updateemail");
      } else {
        // console.log("Already logged in");
        role.current = response.data.user.role;
        setUser(response.data.user);
        setUserName(
          response.data.user.displayName
            ? response.data.user.displayName?.split(" ")[0]
            : response.data.user.email
        );

        setXP({ dailyXP: response.data.user.xp.daily, totalXP: response.data.user.xp.total });
        SetLastCompletedDay(response.data.user.lastCompletedDay);
        SetCompletedDays(response.data.user.completedDays);
        setProfilePicture(response.data.user.imgPath);
        setLastPlayed(response.data.user.last_played);
        getSkills(response.data.user.last_played);
        // console.log("user is", response.data.user);
      }
    });
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex(0 === activeIndex ? activeIndex : activeIndex - 1);
  const slideNext = () => setActiveIndex(skills.length - 1 === activeIndex ? skills.length - 1 : activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const responsive = {
    0: { items: 2, itemsFit: 'contain' },
    580: { items: 3, itemsFit: 'contain' },
    768: { items: 3, itemsFit: 'contain' },
    1020: { items: 3, itemsFit: 'contain' },
  };

  const chapterCompleted = user ? user.score.length : 0;
  let subTopicsCompleted = 0;

  let lastSkillPercent = 0;

  if (user && skills.length) {
    skills.forEach(skill => {
      skill.categories.forEach(category => {
        const chaptersCount = skill.sub_categories.filter(s => s.category === category).length;
        const userChaptersCount = user.score.filter(i => (i.skill === skill.skill && i.category === category)).length;

        if (chaptersCount === userChaptersCount && chaptersCount !== 0) {
          subTopicsCompleted++;
        }
      })
    })

    if (lastPlayed && lastPlayed.skill) {
      const lastAllSubCategories = skills.find(s => s.skill === lastPlayed.skill).sub_categories.length;
      const userLastSubCategories = user.score.filter(s => s.skill === lastPlayed.skill).length
      lastSkillPercent = Math.round(userLastSubCategories / lastAllSubCategories * 100);
    }
  }


  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Navbar proprole={role} />
      <div className="container mt-5">
        <div className="row h-auto">
          <div className="col-md-8 order-md-1 order-2 mb-4">
            <div className="container">
              <div className="row h-auto">
                <div className="col-12 px-0">
                  <Card className="welcome-card homePage-welcome-card">
                    <Card.Body>
                      {
                        (continueHeader !== "Explore new Skills" && lastPlayed && lastPlayed.skill) ? (
                          <Card.Text className="welcome-card-text" style={{ display: 'flex', alignItems: 'center' }}>
                            <span>You are enrolled in the &nbsp;
                              <strong style={{ textDecoration: "underline", fontWeight: "bold" }}>{lastPlayed.skill.split("_").join(" ")}</strong>
                              &nbsp; track</span>
                          </Card.Text>
                        ) : null
                      }
                      <Card.Text className="welcome-card-text" style={{ display: 'flex', alignItems: 'center' }}>
                        {(continueHeader !== "Explore new Skills" && continueButtonHeader) ? (
                          <>
                            Continue with 👉 &nbsp;
                            <Button
                              style={{
                                width: "40%",
                                backgroundColor: "#28a745",
                                borderColor: "#28a745",
                                padding: "5px",
                                borderRadius: "7px",
                                boxShadow: "0px 7px #1a5928",
                                transition: "0.2s ease",
                                fontWeight: "800",
                                marginTop: '4px',
                              }}
                              className="getStarted welcome-card-button"
                              variant="success"
                              onClick={() => navigate(navigateTo)}
                            >
                              {continueButtonHeader.split("_").join(" ")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.1em' }}>Start with 👉</span> &nbsp;
                            <Button
                              style={{
                                width: "40%",
                                backgroundColor: "#28a745",
                                borderColor: "#28a745",
                                padding: "5px",
                                borderRadius: "7px",
                                boxShadow: "0px 7px #1a5928",
                                transition: "0.2s ease",
                                fontWeight: "800",
                                marginTop: '4px',
                              }}
                              className="getStarted welcome-card-button"
                              variant="success"
                              onClick={() => navigate("/skills/Investing/Start_Here/Stocks/information/0")}
                            >
                              What are Stocks?
                            </Button>
                          </>
                        )}
                      </Card.Text>
                      {
                        (continueHeader !== "Explore new Skills" && lastPlayed) ? (
                          <div className="topic-percent welcome-card-text">
                            <div className="grey-percent">
                              <div className="green-percent" style={{ width: `${lastSkillPercent}%` }}></div>
                            </div>
                            {lastSkillPercent}%
                          </div>
                        ) : null
                      }
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="row h-auto">
                <div className="col-8 px-0 ">
                  <div className="search-container mt-4 mb-6">
                    <form className="d-flex input-group">
                      <div className="input-container" >

                        <input
                          type="search"
                          value={searchValue}
                          width="100%"
                          onChange={onChangeSearchValue}
                          className="form-control mr-4 input-search"
                          placeholder="Search Here!"
                          aria-label="Search"
                        />
                        <MDBBtn
                          className="search-button"
                          color="success"
                          onClick={() => onSearch(searchValue)}
                          style={{ boxShadow: "0px 7px #1a5928" }}
                          disabled={!searchValue.trim()}>
                          Search
                        </MDBBtn>
                        <Dropdown.Menu show={searchValue !== ""}>
                          {filteredQueries.map((item, i) => (
                            <Dropdown.Item
                              key={i}
                              onClick={() => onSearch(item)}>
                              {item.name ? item.name.split("_").join(" ") : ""}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 order-md-2 order-1 mb-4 px-md-0">
            <Card className="profile-info">
              <Card.Body className="d-flex align-items-center p-3">
                <div className="profile-picture">
                  <label htmlFor="profile-picture-upload">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        style={{ width: "50px" }}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/50"
                        style={{ width: "50px" }}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    )}
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={
                      handleProfilePictureUpload
                    }
                  />
                </div>
                <div className="user-info ml-3">
                  <h1 className="user-name">
                    Hey, {userName}!
                    <span
                      style={{
                        display: 'inline-block',
                        animation: 'wave-animation 3s infinite',
                        transformOrigin: '70% 100%'
                      }}
                    >👋</span>
                  </h1>
                </div>
              </Card.Body>
              <div className="divider-h" />
              <Card.Body className="d-flex flex-row align-items-center justify-content-around p-2">
                <div className="xp dailyxp">
                  <div className="xp-header">
                    <span className="xp-name">Daily XP</span>
                  </div>
                  <div className="xp-count">
                    {xp.dailyXP || 0}/250
                  </div>
                </div>
                <div className="divider-v" />
                <div className="xp totalxp">
                  <div className="xp-header">
                    <span className="xp-name">Total XP</span>
                  </div>
                  <div className="xp-count">
                    {xp.totalXP || 0}
                  </div>
                </div>
              </Card.Body>
              <div className="divider-h" />
              <Card.Body className="d-flex flex-row align-items-end justify-content-around p-2">
                <div className="xp-days">
                  <div className="xp-header">
                    <span className="xp-name">Streak</span>
                    {
                      (user && user.streak) ? (
                        <FaFire size="1.2em" color="#FF6347" />
                      ) : <FaFire size="1.2em" color="#e8e8ea" />
                    }
                  </div>
                  <div className="xp-count-days">
                    {user && user.streak || 0} days
                  </div>
                </div>
                <div className="calender">
                  {
                    days.map((day, index) => (
                      <div key={index} className={"day "
                        + (index === dayOfWeek ? "day-circle-white " : " ")
                        + ((completedDays && completedDays[index] && new Date(completedDays[index]) >= startOfWeek && new Date(completedDays[index]) <= today) ? "day-circle-green " : " ")
                      }>
                        {day[0]}
                      </div>
                    ))
                  }
                </div>
              </Card.Body>
              <div className="divider-h" />
              <Card.Body className="d-flex flex-row align-items-center justify-content-around p-2">
                <div className="xp-completed completed-1">
                  <div className="xp-count">
                    {chapterCompleted}
                  </div>
                  <div className="xp-header">
                    <span className="xp-name">Chapter completed</span>
                  </div>
                </div>
                <div className="divider-v" />
                <div className="xp-completed completed-2">
                  <div className="xp-count">
                    {subTopicsCompleted}
                  </div>
                  <div className="xp-header">
                    <span className="xp-name">Sub-Topic completed</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 ">
            <h3 style={{ fontWeight: '800' }}>Explore</h3>
          </div>
        </div>
        <div className="row mt-1 ">
          <div className="col-md-8 px-0 ">
            {
              skills.length ? (
                <div className="snapCarousel">
                  <ul
                    ref={scrollRef}
                    style={{
                      display: 'flex',
                      overflowY: 'hidden',
                      scrollSnapType: 'x mandatory',
                      padding: "0",
                      width: "96%",
                      marginLeft: '15px'
                    }}
                  >
                    {
                      skills.map((skill, index) => (
                        <li key={index} style={{ listStyleType: "none" }}>
                          <button
                            className={"rounded-rectangle " + (skill.skill === selectedSkill ? "active " : " ") + `color${index + 1}`}
                            value={skill.skill}
                            onClick={(e) => {
                              setSelectedSkill(e.target.value);
                              getCategories(e.target.value);
                            }}
                          >
                            {skill.skill ? skill.skill.split("_").join(" ") : ""}
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ) : <p>Wait for it...</p>
            }
          </div>
          <div className="col-md-8">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 justify-content-center">
              {
                (categories.length && selectedSkill) ? (
                  categories.map((category, idx) => {
                    const catCount = skills.find(s => s.skill === selectedSkill).sub_categories.filter(s => s.category === category).length;
                    const userCatCount = user.score.filter(s => s.skill === selectedSkill).filter(s => s.category === category).length;
                    const percent = catCount !== 0 ? Math.round(userCatCount / catCount * 100) : 0;

                    return (
                      <div className="col px-sm-0 d-flex align-items-center justify-content-center" key={idx}>
                        <Card
                          className={`skill-card topic-card mt-1 mb-5 d-flex justify-content-center align-items-center`}
                          style={{
                            border: "",
                            width: '180px',
                            height: '210px',
                            margin: "10px",
                            padding: '10px',  // Adjust padding as needed
                            borderRadius: '15px',  // Increased border-radius

                          }}>
                          <Card.Body
                            className="d-flex justify-content-center align-items-center"
                          >
                            <div
                              className="category-circle-green"
                              style={{
                                background: `conic-gradient(#28a745 0% ${percent}%, #ffffff ${percent}% 100%)`
                              }}
                            >
                              <div className="category-circle-grey">
                                <Card.Img
                                  variant="top"
                                  src={emojis[idx] || "https://via.placeholder.com/50"}
                                  alt={category}
                                  style={{ width: '50px', height: '50px', borderRadius: "50%" }}
                                  className="mx-auto"
                                />
                              </div>
                            </div>
                          </Card.Body>
                          <Card.Body className="d-flex justify-content-center align-items-center">
                            <Button
                              variant="success"
                              style={{
                                boxShadow:
                                  "0px 7px #1a5928",
                              }}
                              value={category}
                              onClick={() => navigate(`/skills/${selectedSkill}/${category}`)}>
                              {category ? category.split("_").join(" ") : ""}
                            </Button>

                          </Card.Body>
                        </Card>
                      </div>
                    )
                  })
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
/*
TODO: Scrollable drop down

{(skills)? ((skills).map((skill, i) =>
          <>
            <br/>
            <div key={i}>
            <Card >
              <Card.Header as="h5">{skill.skill.split("_").join(" ")}</Card.Header>
              <Card.Body>
                <Card.Text>
                Lets learn about {((skill.categories)?(skill.categories).map((category, i) =><>{category.split("_").join(" ")}, </>):null)}
                </Card.Text>
                <Button onClick={() => navigate(`/skills/${skill.skill}`)}>Explore</Button>{' '}
              </Card.Body>
            </Card>
            </div>
          </>
          )):null}
*/

/* <ToggleButtonGroup type="radio" name="radio">
          {(skills)? skills.map((skill, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            variant={selectedSkill === skill.skill? 'success':'outline-success'}
            type="radio"
            value={skill.skill}
            checked={selectedSkill === skill.skill}
            onChange={(e) => {setSelectedSkill(e.target.value); getCategories(e.target.value); console.log(e.target.value);}}
          >
            {skill.skill.split("_").join(" ")}
          </ToggleButton>
          )):null}

        </ToggleButtonGroup> */
