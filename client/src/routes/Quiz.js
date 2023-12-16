/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Axios from 'src/api/axios'
import { Button, Card, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Modal from "react-bootstrap/Modal";
import "../styles/QuizPage.styles.css";
import WrongAudio from "../sounds/wrong-audio.mp3"
import CorrectAudio from "../sounds/correct-audio.mp3"
import { FingoHomeLayout } from "src/components/layouts";
import { useAuth } from "src/hooks";

const Quiz = () => {
  const { isAuthenticated, user } = useAuth()
  const [imageURL, setImageURL] = useState("");
  const { skillName, subcategory, category } = useParams();
  const navigate = useNavigate();

  const skillDetails = useRef({});
  const questionSet = useRef([]);
  const currentQuestionIndex = useRef(0);
  const maxQuestions = useRef(0);
  const correctAnswers = useRef([]);
  const score = useRef([]);
  const points = useRef(0);
  const role = useRef("");

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentExplaination, setCurrentExplaination] = useState(null);
  const [currentCorrectOptions, setCurrentCorrectOptions] = useState(null);
  const [optionSet, setOptionSet] = useState([]);
  const [answersList, setAnswersList] = useState([]);
  const [correctOptionsText, setCorrectOptionsText] = useState([]);

  const [currentIsWrongIndex, setCurrentIsWrongIndex] = useState(null);
  const [currentImageName, setCurrentImageName] = useState("");
  const [audio, setAudio] = useState(new Audio());
  const correctAudio = new Audio(CorrectAudio);
  const wrongAudio = new Audio(WrongAudio);


  const [showExplaination, setShowExplaination] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [isSubmittedAnswer, setIsSubmittedAnswer] = useState(false);
  const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
  const [currentIsCorrectIndex, setCurrentIsCorrectIndex] = useState(null);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(null);

  const isMultipleChoice = useMemo(() => {
    return correctAnswers?.current?.length > 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctAnswers?.current]);

  const onClickExplanation = (e) => {
    e.preventDefault();
    setShowExplaination(true);
  };

  const handleCheck = () => {
    if (isMultipleChoice) {
      if (
        JSON.stringify(answersList) === JSON.stringify(correctAnswers.current)
      ) {
        score.current[currentQuestionIndex.current] = 1;
        points.current = points.current + 1;
        setCurrentIsCorrect(true);
        correctAudio.play()
      } else {
        wrongAudio.play()
        setCurrentIsCorrect(false);
      }
    } else {
      if (
        JSON.stringify(answersList) === JSON.stringify(correctAnswers.current)
      ) {
        score.current[currentQuestionIndex.current] = 1;
        points.current = points.current + 1;
        setCurrentIsCorrect(true);
        setCurrentIsCorrectIndex(currentSelectedIndex ?? null);
        correctAudio.play()
      } else {
        wrongAudio.play()
        setCurrentIsCorrect(false);
        setCurrentIsCorrect(true);
        setCurrentIsWrongIndex(currentSelectedIndex ?? null);
        setCurrentIsCorrectIndex(correctAnswers?.current?.[0] ?? null);
      }
    }

    setIsSubmittedAnswer(true);
    setAnswersList([]);
    setCorrectOptionsText([]);
  };

  const next = () => {
    setIsSubmittedAnswer(false);
    setCurrentIsCorrectIndex(null);
    setCurrentIsWrongIndex(null);
    setCurrentSelectedIndex(null);

    var newQuestionIndex = Math.min(
      currentQuestionIndex.current + 1,
      maxQuestions.current - 1
    );
    currentQuestionIndex.current = newQuestionIndex;
    setCurrentQuestion(questionSet.current[newQuestionIndex].question);
    setCurrentExplaination(questionSet.current[newQuestionIndex].explaination);
    setOptionSet(questionSet.current[newQuestionIndex].options);

    correctAnswers.current =
      questionSet.current[newQuestionIndex].correct_answers;
    for (var i = 0; i < correctAnswers.current.length; i++) {
      correctAnswers.current[i] = Number(correctAnswers.current[i]);
    }
    setShowExplaination(false);

    var tempCorrectOptionsText = [];
    for (
      var i = 0;
      i < questionSet.current[newQuestionIndex].options.length;
      i++
    ) {
      if (correctAnswers.current.includes(i)) {
        tempCorrectOptionsText = tempCorrectOptionsText.concat(
          questionSet.current[newQuestionIndex].options[i]
        );
      }
    }
    setCorrectOptionsText(tempCorrectOptionsText);

    setCurrentCorrectOptions(tempCorrectOptionsText.join(", "));

    if (questionSet.current[newQuestionIndex].imgpath != undefined) {
      setCurrentImageName(questionSet.current[newQuestionIndex].imgpath);
      const key = questionSet.current[newQuestionIndex].imgpath;
      Axios({
        method: "GET",
        withCredentials: true,
        url: `/server/getImage/${key}`,
      }).then((res) => {
        setImageURL(res.data.url);
      });
    } else {
      setCurrentImageName("");
      setImageURL("");
    }
  };

  const saveScore = () => {
    if (searchParams.get("newUser") === "true") {
      // If newUser is true, save the score in localStorage
      let scores = JSON.parse(sessionStorage.getItem("scores")) || [];
      // Add the new score to the array
      scores.push({
        skill: skillName,
        category: category,
        sub_category: subcategory,
        points: points, // Assuming `points` is already the updated value you want to store
      });
      // Save the updated array back to localStorage
      sessionStorage.setItem("scores", JSON.stringify(scores));
      sessionStorage.setItem(
        "lastPlayed",
        JSON.stringify({
          skill: skillName,
          category: category,
          sub_category: subcategory,
        })
      );
      // Directly navigate to score page without waiting for server response
      navigate(
        `/skills/${skillName}/${category}/${subcategory}/score?newUser=true`,
        {
          state: { data: { score: score, points: points } },
        }
      );
    } else {
      Axios({
        method: "POST",
        data: {
          skill: skillName,
          category: category,
          sub_category: subcategory,
          points: points.current,
        },
        withCredentials: true,
        url: "/server/savescore",
      }).then(function (response) {
        navigate(`/skills/${skillName}/${category}/${subcategory}/score`, {
          state: { data: { score: score, points: points } },
        });
      });
    }
  };

  const saveXP = () => {
    let xp = 0;
    if (points.current > 0) {
      xp = points.current * 20;
      if (points.current === maxQuestions.current) {
        xp += 20;
      }
    } else {
      xp = 15;
    }

    if (searchParams.get("newUser") === "true") {
      // If newUser is true, save the XP in localStorage
      const currentXP = parseInt(sessionStorage.getItem("xp"), 10) || 0;
      const updatedXP = currentXP + xp;
      sessionStorage.setItem("xp", updatedXP);
      sessionStorage.setItem("streak", "1");
      // Then call saveScore which will handle localStorage or Axios based on newUser status
      saveScore();
    } else {
      Axios({
        method: "POST",
        data: {
          xp: xp,
        },
        withCredentials: true,
        url: "/server/savexp",
      }).then(function (response) {
        saveScore();
      });
    }
  };

  const handleAnswer = (i) => {
    var tempAnswersList = answersList;
    if (answersList.includes(i))
      tempAnswersList = tempAnswersList.filter((j) => j != i);
    else tempAnswersList = tempAnswersList.concat(i);
    tempAnswersList = tempAnswersList.sort();
    setAnswersList(tempAnswersList);
  };

  const handleAnswerRadio = (i) => {
    setCurrentSelectedIndex(i);
    if (!answersList.includes(i)) {
      setAnswersList([i]);
    }
  };

  const getAllQuestions = (isNewUser) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `/server/questions/${skillName}/${category}/${subcategory}`,
      params: {
        newUser: isNewUser,
      },
    }).then((res) => {
      questionSet.current = res.data.data;
      maxQuestions.current = res.data.data.length;
      setCurrentQuestion(res.data.data[0].question);
      setCurrentExplaination(res.data.data[0].explaination);
      setOptionSet(res.data.data[0].options);
      if (res.data.data[0].imgpath != undefined) {
        setCurrentImageName(res.data.data[0].imgpath);
        const key = res.data.data[0].imgpath;
        Axios({
          method: "GET",
          withCredentials: true,
          url: `/server/getImage/${key}`,
          params: {
            newUser: isNewUser,
          },
        }).then((res) => {
          setImageURL(res.data.url);
        });
      } else {
        setCurrentImageName("");
        setImageURL("");
      }
      correctAnswers.current = res.data.data[0].correct_answers;
      for (var i = 0; i < correctAnswers.current.length; i++) {
        correctAnswers.current[i] = Number(correctAnswers.current[i]);
      }
      var tempCorrectOptionsText = [];
      for (var i = 0; i < res.data.data[0].options.length; i++) {
        if (correctAnswers.current.includes(i)) {
          tempCorrectOptionsText = tempCorrectOptionsText.concat(
            res.data.data[0].options[i]
          );
        }
      }
      setCorrectOptionsText(tempCorrectOptionsText);
      setCurrentCorrectOptions(tempCorrectOptionsText.join());

      var tempScore = [];
      for (var i = 0; i < res.data.data.length; i++) {
        tempScore.push(0);
      }
      score.current = tempScore;
    });
  };

  const getSkillBySkillName = (isNewUser) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `/server/skills/${skillName}`,
      params: {
        newUser: isNewUser,
      },
    }).then((res) => {
      skillDetails.current = res.data.data;
    });
  };

  ////to authenticate user before allowing him to enter the home page
  useEffect(() => {
    const newUser = searchParams.get("newUser");
    if (newUser === "true") {
      // Retrieve the scores array from localStorage and parse it
      const storedScores = JSON.parse(sessionStorage.getItem("scores")) || [];

      // Filter scores by skillName and category
      const matchingScores = storedScores.filter(
        (scoreItem) =>
          scoreItem.skill === skillName && scoreItem.category === category
      );

      // Check if there are 5 items with the same skillName and category
      if (matchingScores.length >= 5) {
        const score = matchingScores.reduce((acc, item) => acc + item.score, 0); // Sum of scores as an example
        const points = matchingScores.reduce(
          (acc, item) => acc + item.points,
          0
        ); // Sum of points as an example

        // Navigate with the state data
        navigate(
          `/skills/${skillName}/${category}/${subcategory}/score?newUser=true`,
          {
            state: { data: { score: score, points: points } },
          }
        );
      } else {
        // Call the functions as before
        getSkillBySkillName(newUser);
        getAllQuestions(newUser);
      }
    } else {
      if(isAuthenticated && user) {
        getSkillBySkillName();
        getAllQuestions();
        role.current = user?.role;
      }
    }
  }, [searchParams, isAuthenticated, user]);

  const isDisabledAnswer = useMemo(() => {
    return (
      currentSelectedIndex !== null &&
      (currentIsWrongIndex !== null || currentIsCorrectIndex !== null)
    );
  }, [currentSelectedIndex, currentIsWrongIndex, currentIsCorrectIndex]);

  const renderCorrectIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#039027"
        fill-rule="evenodd"
        d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18Zm-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774l.701-.84Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const renderIncorrectIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#e00000"
        fill-rule="evenodd"
        d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0ZM7.293 16.707a1 1 0 0 1 0-1.414L10.586 12L7.293 8.707a1 1 0 0 1 1.414-1.414L12 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414L13.414 12l3.293 3.293a1 1 0 0 1-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 0 1-1.414 0Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  useEffect(() => {
    return () => {
      // Clean up audio elements
      correctAudio.pause();
      correctAudio.currentTime = 0;
      wrongAudio.pause();
      wrongAudio.currentTime = 0;
    };
  }, []);
  

  return (
    <FingoHomeLayout>
      <Helmet>
        <title>Quiz</title>
      </Helmet>
      <br />
      <Card
        className="d-flex flex-column"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "15px",
          width: "90%",
          maxWidth: "450px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Card.Body>
          <Card.Title>Question {currentQuestionIndex.current + 1}</Card.Title>
          <Card.Text>
            <span style={{ fontWeight: "bold" }}>{currentQuestion}</span>
          </Card.Text>
          {imageURL && (
            <div className="d-flex">
              <Card.Img
                variant="top"
                src={imageURL}
                className="zoomImage mt-2"
                style={{
                  maxWidth: "80%",
                  maxHeight: "300px",
                  marginBottom: "10px",
                }}
                alt="Responsive image"
              />
            </div>
          )}
        </Card.Body>
        <ListGroup className="option_quiz_container list-group-flush fix">
          {optionSet.map((option, i) => (
            <ListGroup.Item
              key={i}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                if (!isDisabledAnswer) {
                  correctAnswers.current.length === 1
                    ? handleAnswerRadio(i)
                    : handleAnswer(i);
                }
              }}
            >
              {isMultipleChoice ? (
                <div
                  className={`option_quiz_item ${
                    answersList.includes(i) ? "selected" : ""
                  } ${
                    isSubmittedAnswer
                      ? correctAnswers?.current?.includes(i)
                        ? "correct"
                        : currentIsCorrect
                        ? ""
                        : "incorrect"
                      : ""
                  }`}
                >
                  <input
                    type={
                      correctAnswers.current.length === 1 ? "radio" : "checkbox"
                    }
                    style={{ marginRight: "10px" }} // Add space between the radio button and text
                    checked={answersList.includes(i)}
                  />
                  <label style={{ margin: "0", cursor: "pointer" }}>
                    {option}
                  </label>
                  {isSubmittedAnswer
                    ? correctAnswers?.current?.includes(i)
                      ? renderCorrectIcon()
                      : currentIsCorrect ? null : renderIncorrectIcon()
                    : null}
                </div>
              ) : (
                <div
                  className={`option_quiz_item ${
                    answersList.includes(i) ? "selected" : ""
                  } ${currentIsWrongIndex === i ? "incorrect" : ""} ${
                    currentIsCorrectIndex === i ? "correct" : ""
                  }`}
                >
                  <input
                    type={
                      correctAnswers.current.length === 1 ? "radio" : "checkbox"
                    }
                    style={{ marginRight: "10px" }} // Add space between the radio button and text
                    checked={answersList.includes(i)}
                  />
                  <label style={{ margin: "0", cursor: "pointer" }}>
                    {option}
                  </label>
                  {currentIsCorrectIndex !== null && (
                    <>
                      {currentSelectedIndex === currentIsCorrectIndex &&
                      currentIsCorrectIndex === i ? (
                        renderCorrectIcon()
                      ) : (
                        <>
                          {currentIsCorrectIndex === i && renderCorrectIcon()}
                        </>
                      )}
                    </>
                  )}
                  {currentIsWrongIndex !== null && (
                    <>
                      {currentSelectedIndex === currentIsWrongIndex &&
                        currentIsWrongIndex === i &&
                        renderIncorrectIcon()}
                    </>
                  )}
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Body>
          <Row className="px-3 align-items-center justify-content-between">
            {isSubmittedAnswer ? (
              <a
                href="#"
                className="explanation_btn"
                onClick={onClickExplanation}
              >
                Explanation
              </a>
            ) : (
              <div />
            )}
            {isSubmittedAnswer ? (
              <>
                {currentQuestionIndex.current + 1 < maxQuestions.current && (
                  <>
                    <Button
                      variant="success"
                      style={{ boxShadow: "0px 7px #1a5928", minWidth: 100 }}
                      onClick={next}
                    >
                      Next
                    </Button>{" "}
                  </>
                )}
              </>
            ) : (
              <Button
                variant="success"
                style={{
                    width: "100%", // Make the button take full width on smaller screens
                    maxWidth: "28%", // Set a maximum width to prevent excessive stretching
                    whiteSpace: "nowrap", // Prevent text from wrapping
                    textAlign: "center",
                    boxShadow: "0px 7px #1a5928",
                }}
                onClick={handleCheck}
                disabled={answersList.length === 0}
            >
                Submit
            </Button>
            )}
            {currentQuestionIndex.current + 1 === maxQuestions.current && isSubmittedAnswer && (
                <>
                  <Button
                    onClick={() => {
                      saveXP();
                    }}
                  >
                    End Quiz
                  </Button>
                </>
              )}
          </Row>

          <Modal show={showExplaination} style={{marginTop:'40px'}}>
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
              <div>Correct Answer: {currentCorrectOptions}</div>
              <br />
              <div>Explanation: {currentExplaination}</div>
            </Modal.Body>
            <Modal.Footer>
              {currentQuestionIndex.current + 1 === maxQuestions.current && (
                <>
                  <Button
                    onClick={() => {
                      saveXP();
                    }}
                  >
                    End Quiz
                  </Button>{" "}
                </>
              )}
              {currentQuestionIndex.current + 1 < maxQuestions.current && (
                <>
                  <Button
                    variant="success"
                    style={{ boxShadow: "0px 7px #1a5928" }}
                    onClick={next}
                  >
                    Next
                  </Button>{" "}
                </>
              )}
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
      <div className="page-dots">
        {Array.from({ length: maxQuestions.current }, (_, i) => (
          <span
            key={i}
            className={`dot ${
              i === currentQuestionIndex.current ? "active" : ""
            }`}
          ></span>
        ))}
      </div>
    </FingoHomeLayout>
  );
};

export default Quiz;

///TODO: change hard coded value 5
