import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import { Row, Col, Button } from "react-bootstrap";
import demoGif from "../images/demo2.gif";

const StartPage = () => {
    const navigate = useNavigate();
    const [currentWord, setCurrentWord] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const words = ['finance', 'investing', 'mutual funds', 'personal finance', 'economics', 'crypto', 'insurance'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prevWord) => {
                const currentWordToType = words[currentWordIndex];
                const targetLength = isTyping ? currentWordToType.length : 0;

                if (prevWord.length !== targetLength) {
                    const delta = isTyping ? 1 : -1;
                    return currentWordToType.substring(0, prevWord.length + delta);
                } else {
                    setIsTyping(!isTyping);

                    if (!isTyping) {
                        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                    }
                    return prevWord;
                }
            });
        }, 150);

        return () => clearInterval(interval);
    }, [currentWordIndex, isTyping]);

    return (
        <>
        {/* {
          //  showBanner && (
           //     <div className="site-down-banner">
           //         🚧 Our site is currently experiencing technical difficulties. We apologize for the inconvenience! 🚧
            //    </div>
          //  )
        } */}
            <div className="dottedBackground">
                <div style={{ paddingBottom: "10px" }}>
                    <Helmet>
                        <title>Fingo - Learn Finance the Fun Way</title>
                    </Helmet>
                    <GeneralNavbar />

                    <br />
                    <div style={{ flex: '1' }}>
                        <Row style={{ margin: "auto", width: "80%" }}>
                            <Col xs={12} md={6} style={{ marginTop: "6%" }}>
                                <img 
                                    src={demoGif} 
                                    style={{
                                        width: "95%",
                                        borderRadius: "10px",
                                        border: "3px solid #2cb74c",
                                        minWidth: "95%"
                                    }} 
                                    alt="Learn Finance" 
                                />
                            </Col>

                            <Col xs={12} md={6} style={{ marginTop: "4%" }}>
                                <h1 className="text-background-light" style={{ textAlign: "left" }}>
                                    <span style={{ fontWeight: "bold", color: '#2cb74c' }}>
                                        learn finance the fun way!
                                    </span>
                                </h1>
                                <br />
                                <h4 className="text-background-light" style={{ fontWeight: 'bold', textAlign: "left" }}>
                                    short jargon-free chapters and engaging quizzes on{' '}
                                    <span 
                                        className="changeBox"
                                        style={{
                                            display: "inline-block",
                                            width: "auto",
                                            borderRadius: "7px",
                                            textAlign: "center",
                                            textDecorationColor: "#4285F4",
                                            padding: "0px 1px",
                                            border: "none",
                                            color: "#4285F4",
                                            fontFamily: "monospace",
                                            fontSize: "100%",
                                        }}
                                    >
                                        {currentWord}
                                    </span>
                                </h4>
                                <br />
                                {/* <h4 className={`text-background-${darkMode ? 'dark' : 'light'}`} style={{ textAlign: "center", fontFamily: "Kalam, Nunito, sans-serif", color: '#2cb74c', fontWeight: 'bold' }}>
                                    try now. it's free!<img src={arrow} alt="Down Arrow" className="bounce" style={{ width: '45px', height: '45px' }} />
                                </h4> */}
                                <br />
                                
                                <h6
                                    className="text-background-light"
                                    style={{ textAlign: 'center', color: '#6c757d' }}
                                    >
                                    (No signup required.)
                                </h6>
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
                                    onClick={() => navigate("/home")}
                                >
                                    Try Now!
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





