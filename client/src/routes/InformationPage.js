import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../index.css"

const InformationPage = () => {
    const [imageURL, setImageURL] = useState("");
    const { skillName, category, subcategory, page } = useParams();
    const navigate = useNavigate();
    const [skillDetails, setSkillDetails] = useState({});
    const [information, setInformation] = useState({});
    const [informationDisplay, setInformationDisplay] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [maxInfoPages, setMaxInfoPages] = useState(0);
    const role = useRef("");
    const isCompleted = useRef(false);
    const [score, setScore] = useState(-1);
    const [isQuiz, setIsQuiz] = useState(false);

    const getInformation = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/information/${skillName}/${category}/${subcategory}/${page}`,
        }).then((res) => {
            // console.log("information data are:", res.data);
            if (res.data.url !== undefined) {
                setImageURL(res.data.url);
            } else {
                setImageURL("");
            }
            setInformation(res.data.data);
            setInformationDisplay(res.data.data.information);
        });
    };

    const prev = () => {
        var newPageNumber = Math.max(pageNumber - 1, 0);
        setPageNumber(newPageNumber);
        navigate(
            `/skills/${skillName}/${category}/${subcategory}/information/${newPageNumber}`
        );
    };

    const next = () => {
        var newPageNumber = Math.min(pageNumber + 1, maxInfoPages - 1);
        setPageNumber(newPageNumber);
        navigate(
            `/skills/${skillName}/${category}/${subcategory}/information/${newPageNumber}`
        );
    };

    const getSkillBySkillName = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/skills/${skillName}`,
        }).then((res) => {
            // console.log("skill is ", res.data.data[0]);
            const filteredData = res.data.data[0].information.filter(
                (information) =>
                    information.category === category &&
                    information.sub_category === subcategory
            );
            // console.log("filtered data", filteredData);
            // console.log("total info pages :", filteredData.length);
            setSkillDetails(res.data.data[0]);
            setMaxInfoPages(filteredData.length);

            res.data.data[0].questions.forEach((question) => {
                if (
                    question.category === category &&
                    question.sub_category === subcategory
                ) {
                    // console.log(question);
                    setIsQuiz(true);
                }
            });
        });
    };

    const renderPageDots = () => {
        const dots = [];
        for (let i = 0; i < maxInfoPages; i++) {
          dots.push(
            <span
              key={i}
              className={`page-dot ${i === pageNumber ? "active" : ""}`}
              onClick={() => navigate(`/skills/${skillName}/${category}/${subcategory}/information/${i}`)}
            ></span>
          );
        }
        return dots;
      };

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            if (response.data.redirect == "/login") {
                // console.log("Please log in");
                navigate(`/auth/login`);
            } else {
                // console.log("Already logged in");
                getSkillBySkillName();
                getInformation();
                role.current = response.data.user.role;
                var checkIsCompleted = response.data.user.score.filter(
                    function (score) {
                        return (
                            score.skill === skillName &&
                            score.category === category &&
                            score.sub_category === subcategory
                        );
                    }
                );
                // console.log('checkIsCompleted', checkIsCompleted);
                if (checkIsCompleted.length > 0) {
                    isCompleted.current = true;
                    setScore(checkIsCompleted[0].points);
                } else {
                    isCompleted.current = false;
                }
            }
        });
    }, [pageNumber]);

    return (
        <>
            <Helmet>
                <title>Let's Learn</title>
            </Helmet>
            <Navbar proprole={role} />
            <br />
            <Card
                className="d-flex flex-column mobile-card-style"
                style={{
                    marginLeft: "auto",   // Center the card
                    marginRight: "auto",  // Center the card
                    borderRadius: "15px",
                    width: '90%',
                    maxWidth: '450px',
                    marginTop: '20px',
                    marginBottom: '20px'
                }}>
                {/* <Card.Header>Let's Learn about {information.category}</Card.Header> */}
                <Card.Body>
                    <Card.Title>
                        <span style={{ fontWeight: "bold" }}>
                            {information.heading}
                        </span>
                    </Card.Title>
                    {/* {imageURL && <>
					<Card.Img 
						variant="top" 
						style={{ width: "300px", textAlign: "center", margin: "auto" }} 
						src={imageURL} 
						className='mt-2' />
						<br/><br/>
						</>} */}

                    {imageURL && (
                        <div className="d-flex">
                            <Card.Img
                                variant="top"
                                src={imageURL}
                                className="zoomImage mt-2"
                                style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: '10px' }}
                                alt="Responsive image"
                            />
                        </div>
                    )}

                    <Card.Text>
                        <p>
                            {/* {information.information} */}
                            {informationDisplay !== " " &&
                                informationDisplay
                                    .split("\n")
                                    .map((item, key) => (
                                        <div
                                            key={key}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onCopy={(e) => e.preventDefault()}
                                            onSelectStart={(e) =>
                                                e.preventDefault()
                                            }>
                                            {item}
                                            <br />
                                        </div>
                                    ))}
                        </p>
                    </Card.Text>
                    {pageNumber > 0 && (
                        <>
                            <Button variant="secondary" onClick={prev}>
                                Prev
                            </Button>
                            {"  "}
                        </>
                    )}
                    {pageNumber + 1 < maxInfoPages && (
                        <>
                            <Button style={{width: '20%'}} variant="success" onClick={next}>
                                Next
                            </Button>
                            {"  "}
                        </>
                    )}

                    {isQuiz &&
                        pageNumber + 1 === maxInfoPages &&
                        isCompleted.current === true && (
                            <>
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id="tooltip-disabled">
                                            Your score is {score}
                                        </Tooltip>
                                    }>
                                    <span className="d-inline-block">
                                        <Button
                                            variant="success"
                                            disabled
                                            style={{ pointerEvents: "none" }}>
                                            Start Quiz
                                        </Button>
                                    </span>
                                </OverlayTrigger>
                            </>
                        )}

                    {isQuiz &&
                        pageNumber + 1 === maxInfoPages &&
                        isCompleted.current === false && (
                            <>
                                <Button
                                    variant="success"
                                    onClick={() =>
                                        navigate(
                                            `/skills/${skillName}/${category}/${subcategory}/quiz`
                                        )
                                    }>
                                    Start Quiz
                                </Button>
                                {"  "}
                            </>
                        )}
                    {!isQuiz && pageNumber + 1 === maxInfoPages && (
                        <Button
                            
                            variant="success"
                            onClick={() =>
                                navigate(`/skills/${skillName}/${category}`)
                            }>
                            Go Back!!
                        </Button>
                    )}
                </Card.Body>
            </Card>
            <div className="page-dots">{renderPageDots()}</div>
        </>
    );
};

export default InformationPage;

///TODO: change hard coded value 5
