import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import '../App.css';
import '../index.css';
import '../startpage.css';
import arrow from "../images/down-arrow.png";
import demoGif from "../images/demo2.gif";
import StartPageQuiz from "./StartPageQuiz";

const logo = require("../images/teach.png");

const words = ['finance', 'investing', 'mutual funds', 'personal finance', 'economics', 'crypto', 'insurance'];
const intervalDuration = 2000;

const StartPage = (props) => {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const updateCurrentWord = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    };

    useEffect(() => {
        const interval = setInterval(updateCurrentWord, intervalDuration);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const darkMode = localStorage.getItem("theme") === "dark";

    return (
        <>
        {
          //  showBanner && (
           //     <div className="site-down-banner">
           //         🚧 Our site is currently experiencing technical difficulties. We apologize for the inconvenience! 🚧
            //    </div>
          //  )
        }
        
            <div className={`dottedBackground ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <div style={{ paddingBottom: "10px" }}>
                    <Helmet>
                        <title>Fingo - Learn Finance the Fun Way</title>
                    </Helmet>
                    <GeneralNavbar />

                    <br />
                    <div style={{ flex: '1' }}>
                        <Row style={{ margin: "auto", width: "80%" }}>
                            <Col xs={12} md={6} style={{ marginTop: "6%"}}>
                            <img 
                                src={demoGif} 
                                style={{
                                    width: "95%", // or whatever percentage or fixed width you want
                                    borderRadius: "10px", // or the amount of border-radius you prefer
                                    border: "3px solid #2cb74c",
                                    minWidth: "95%"
                                }} 
                                className="img-fluid zoomImage" 
                                alt="Learn Finance" 
                            />
                            
                            </Col>

                            <Col xs={12} md={6} style={{ marginTop: "4%" }}>
                                <h1 className={`text-background-${darkMode ? 'dark' : 'light'}`} style ={{ textAlign: "center"}}>
                                    <span style={{ fontWeight: "bold", color: '#2cb74c' }}>
                                        learn finance the fun way!
                                    </span>
                                </h1>
                                <br />
                                <h4 className={`text-background-${darkMode ? 'dark' : 'light'}`} style={{ fontWeight: 'bold', textAlign: "center" }}>
                                    short jargon-free chapters and engaging quizzes on{' '}
                                    <span 
                                        className="changeBox"
                                        style={{
                                            display: "inline-block",
                                            width: "40%", // Fixed box width
                                            borderRadius: "7px",
                                            textAlign: "center",
                                            textDecorationColor: "#4285F4",
                                            padding: "0px 1px",
                                            border: `4px solid ${darkMode ? '#4285F4' : '#4285F4'}`,
                                            color: `${darkMode ? '#4285F4' : '#4285F4'}`,
                                        }}
                                    >
                                        {words[currentWordIndex]}
                                    </span>{/*}. put in 4 minutes a day and get better at managing your money.*/}
                                </h4>
                                <br />
                                <h4 className={`text-background-${darkMode ? 'dark' : 'light'}`} style={{ textAlign: "center", fontFamily: "Kalam, Nunito, sans-serif", color: '#2cb74c', fontWeight: 'bold' }}>
                                    try now. it's free!<img src={arrow} alt="Down Arrow" className="bounce" style={{ width: '45px', height: '45px' }} />
                                </h4>
                                <br />
                                
                                <Button
                                    style={{
                                        width: "55%",
                                        backgroundColor: "#28a745",
                                        borderColor: "#28a745",
                                        margin: "0 auto",
                                        display: "block",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        boxShadow: "0px 7px #1a5928",
                                        transition: "0.2s ease",
                                        fontWeight: "800",
                                        marginBottom: "20px"
                                    }}
                                    className="getStarted"
                                    onClick={() => navigate("/auth/register")}
                                >
                                    GET STARTED
                                </Button>

                                <Button
                                    style={{
                                        width: "55%",
                                        backgroundColor: "#FFFFFF",
                                        borderColor: "#808080",
                                        margin: "0 auto 20px auto",
                                        display: "block",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        boxShadow: "0px 7px #818589",
                                        transition: "0.2s ease",
                                        fontWeight: "800",
                                        color: "#4285F4"
                                    }}
                                    className="haveAccount"
                                    onClick={() => navigate("/auth/login")}
                                >
                                    LOGIN
                                </Button>
                            </Col>
                           {/*} <Col xs={12} md={6} style={{ marginTop: "6%"}}>
                            <h2 className={`text-background-${darkMode ? 'dark' : 'light'}`} style={{ fontWeight: 'bold', textAlign: "center", color: '#2cb74c', marginTop: '10px' }}>
                                take a quick, personal finance quiz and test yourself.
                            </h2>
                        </Col>
                            <Col xs={12} md={6} style={{ marginTop: "6%", align: 'center' }}>
                                <StartPageQuiz />
                                </Col>*/}
                        </Row>
                        <div style={{ marginBottom: "20px" }}></div>
                        
                    </div>
                    
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default StartPage;

