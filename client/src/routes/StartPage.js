import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap"; // Import Container from react-bootstrap
import '../App.css';
import '../index.css';
import arrow from "../images/down-arrow.png";
import demoGif from "../images/demo2.gif"

const logo = require("../images/teach.png");



////This is the home page of the website, which is user directed to the
////after he has been authenticated, where he is given 2 options whether
////to join an existing room or create a new one

////data represents username of the logged in username
////join room is the invitation link to which user must be redirected to
const StartPage = (props) => {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);


    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        // console.log("in use effect");
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            if (response.data.redirect != "/login") {
                // console.log("Already logged in");
                navigate(`/home`);
            }
        });
    }, []);

    return (
        <>
        {
          //  showBanner && (
           //     <div className="site-down-banner">
           //         🚧 Our site is currently experiencing technical difficulties. We apologize for the inconvenience! 🚧
            //    </div>
          //  )
        }
        
            <div className="dottedBackground">
                <div style={{ paddingBottom: "10px" }}>
                    <Helmet>
                        <title>Fingo - Learn Finance the Fun Way</title>
                    </Helmet>
                    <GeneralNavbar />

                    <br />
                    <div style={{ flex: '1' }}>
                        <Row style={{ margin: "auto", width: "80%" }}>
                            <Col xs={12} md={6} style={{ marginTop: "90px"}}>
                            <img 
                                src={demoGif} 
                                style={{
                                    width: "90%", // or whatever percentage or fixed width you want
                                    borderRadius: "10px", // or the amount of border-radius you prefer
                                    border: "2px solid #2cb74c"
                                }} 
                                className="img-fluid zoomImage" 
                                alt="Learn Finance" 
                            />
                            </Col>

                            <Col xs={12} md={6} style={{ marginTop: "5%" }}>
                                <h1>
                        <span style={{ fontWeight: "bold", color: '#2cb74c' }}>
                            LEARN FINANCE THE FUN WAY!
                        </span>
                                </h1>
                                <br />
                                <h4 style= {{fontWeight: 'bold'}}>
                                    500+ Short, Jargon-Free Chapters and 2000+ engaging quizzes.
                                </h4>
                                <br />
                                <h3 style={{ textAlign: "center", fontFamily: "Kalam, Nunito, sans-serif", color: '#2cb74c', fontWeight: 'bold' }}>Try Now. It's Free!<img src={arrow} alt="Down Arrow" className="bounce" style={{ width: '45px', height: '45px' }} /></h3>
                                <br />
                                <Button
                                    style={{
                                        width: "60%",
                                        backgroundColor: "#28a745",
                                        borderColor: "#28a745",
                                        margin: "0 auto",
                                        display: "block",
                                        padding: "15px",
                                        borderRadius: "15px",
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
                                        width: "60%",
                                        backgroundColor: "#FFFFFF",
                                        borderColor: "#808080",
                                        margin: "0 auto 20px auto",
                                        display: "block",
                                        padding: "15px",
                                        borderRadius: "15px",
                                        boxShadow: "0px 7px #818589",
                                        transition: "0.2s ease",
                                        fontWeight: "800",
                                        color: "#4285F4"
                                    }}
                                    className="haveAccount"
                                    onClick={() => navigate("/auth/login")}
                                >
                                    I ALREADY HAVE AN ACCOUNT
                                </Button>
                            </Col>
                        </Row>
                        <div style={{ marginBottom: "10px" }}></div> {/* Added space before the footer */}

                        {/* <Row style={{ margin: "auto", width: "80%"}}>
			<Col>
				<img
					src={logo}
					height={500}
					width={600}
					fluid
					alt="Learn Finance Logo"
				/>
			</Col>
			<Col style={{ marginTop: "10%"}}>
				<h1><span style={{fontWeight: 'bold'}}>Learn Finance the Fun Way!</span></h1>
				<br/>
				<h5 > Get access to 450+ chapters on Investing, Trading, Crypto, and more. Each only 3 minutes long.</h5>
				<br/>
				<h5>Plus, challenge yourself with 1800+ quizzes to test your knowledge.</h5>
				<br/>
			<Button style={{ width: "50%", marginLeft: "25%", padding: "15px", borderRadius: "15px", boxShadow: "initial" }} onClick={() => navigate(`/auth/login`)}>Get Started</Button>
			</Col>
		</Row> */}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    );
};

export default StartPage;