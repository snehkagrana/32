import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import { Form, Badge, Button, Card, ListGroup } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Modal from "react-bootstrap/Modal";

const Quiz = () => {
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
  const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
  const [currentImageName, setCurrentImageName] = useState("");

  const [showExplaination, setShowExplaination] = useState(false);

  const check = () => {
    if (JSON.stringify(answersList) === JSON.stringify(correctAnswers.current)) {
      score.current[currentQuestionIndex.current] = 1;
      points.current = points.current + 1;
      setCurrentIsCorrect(true);
    } else {
      setCurrentIsCorrect(false);
    }
    setAnswersList([]);
    setCorrectOptionsText([]);
    setShowExplaination(true);
  };

  const next = () => {
    var newQuestionIndex = Math.min(
      currentQuestionIndex.current + 1,
      maxQuestions.current - 1
    );
    currentQuestionIndex.current = newQuestionIndex;
    setCurrentQuestion(questionSet.current[newQuestionIndex].question);
    setCurrentExplaination(questionSet.current[newQuestionIndex].explaination);
    setOptionSet(questionSet.current[newQuestionIndex].options);

    correctAnswers.current = questionSet.current[newQuestionIndex].correct_answers;
    for (var i = 0; i < correctAnswers.current.length; i++) {
      correctAnswers.current[i] = Number(correctAnswers.current[i]);
    }
    setShowExplaination(false);

    var tempCorrectOptionsText = [];
    for (var i = 0; i < questionSet.current[newQuestionIndex].options.length; i++) {
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
    if (!answersList.includes(i)) {
      setAnswersList([i]);
    }
  };

  const getAllQuestions = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `/server/questions/${skillName}/${category}/${subcategory}`,
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
  
    const getSkillBySkillName = () => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: `/server/skills/${skillName}`,
      }).then((res) => {
        skillDetails.current = res.data.data;
      });
    };
  
    ////to authenticate user before allowing him to enter the home page
    useEffect(() => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: "/server/login",
      }).then(function (response) {
        if (response.data.redirect == "/login") {
          navigate(`/auth/login`);
        } else {
          getSkillBySkillName();
          getAllQuestions();
          role.current = response.data.user.role;
        }
      });
    }, []);
  
    return (
      <>
        <Helmet>
          <title>Quiz</title>
        </Helmet>
        <Navbar proprole={role} />
        <br />
        <Card
          className="d-flex flex-column"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "15px",
            width: '90%',
            maxWidth: '450px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <Card.Body>
            <Card.Title>
              Question {currentQuestionIndex.current + 1}
            </Card.Title>
            <Card.Text>
              <span style={{ fontWeight: "bold" }}>{currentQuestion}</span>
            </Card.Text>
            {imageURL && (
              <div className="d-flex">
                <Card.Img
                  variant="top"
                  src={imageURL}
                  className="zoomImage mt-2"
                  style={{ maxWidth: "80%", maxHeight: "300px", marginBottom: '10px' }}
                  alt="Responsive image"
                />
              </div>
            )}
          </Card.Body>
          <ListGroup className="list-group-flush fix">
            {optionSet.map((option, i) => (
              <ListGroup.Item key={i} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() =>
  correctAnswers.current.length === 1
    ? handleAnswerRadio(i)
    : handleAnswer(i)
}>
  <input
    type={correctAnswers.current.length === 1 ? "radio" : "checkbox"}
    style={{ marginRight: '10px' }} // Add space between the radio button and text
    checked={answersList.includes(i)}
  />
  <label style={{ margin: '0', cursor: 'pointer' }}>{option}</label>
</ListGroup.Item>

            ))}
          </ListGroup>
          <Card.Body>
            <Button
              variant="success"
              style={{ width: '25%', boxShadow: "0px 7px #1a5928" }}
              onClick={check}
              disabled={answersList.length === 0} // Disable if no answer is selected
            >
              Submit
            </Button>
  
            <Modal show={showExplaination}>
              <Modal.Header style={{ backgroundColor: currentIsCorrect ? '#3CB043' : 'lightcoral' }}>
  <Modal.Title>
    {currentIsCorrect
      ? "Correct Answer"
      : "Oops, That is Incorrect"}
  </Modal.Title>
</Modal.Header>

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
              className={`dot ${i === currentQuestionIndex.current ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </>
    );
  };
  
  export default Quiz;
  


///TODO: change hard coded value 5
