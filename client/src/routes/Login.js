import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import GoogleButton from "react-google-button";
import Footer from "../components/Footer";
import "../DarkMode.css"

/////Login page of our website
//// loginEmail is the entered email by the user
//// loginPassword is the entered password by the user

//// authMsg is the flash message which may be show if
//// user enters wrong email or password

const Login = (props) => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [authMsg, setAuthMsg] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false);
    const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
    const [emailTooltipMessage, setEmailTooltipMessage] = useState("");
    const [passwordTooltipMessage, setPasswordTooltipMessage] = useState("");

    const [hasInteracted, setHasInteracted] = useState(false); // Moved the closing parenthesis to the end of this line
    // Rest of the code...


    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    ////function to authenticate user from the server after he has entered the credentials,
    //// if he is authorized redirect him to home page , otherwise dsiplay the flash message
    const login = () => {
        Axios({
            method: "POST",
            data: {
                email: loginEmail,
                password: loginPassword,
            },
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            // Check the server response message and act accordingly
            if (response.data.message === "Incorrect Email or Wrong Password") {
                setAuthMsg(response.data.message);
                setShowAuthMsg(true);
            } else if (response.data.message === "Login Successfully") {
                setAuthMsg(response.data.message);
                setShowAuthMsg(true);
                if (response.data.redirect === "/home") {
                    navigate(`/home`);
                }
            } else {
                setAuthMsg("Unknown error occurred. Please try again.");
                setShowAuthMsg(true);
            }
        });
    };


    const loginWithGoogle = () => {
        // Axios does not work with Google Auth2.0 , need to navigate to the url directly
        window.open("https://tryfingo.com/auth/login-google", "_self");
    };



    const handleEmailBlur = () => {
        setHasInteracted(true);
        if (loginEmail === "") {
            setEmailTooltipMessage("Email can't be empty");
        }};

    const handlePasswordBlur = () => {
        setHasInteractedWithPassword(true);
        if (loginPassword === "") {
            setPasswordTooltipMessage("Password can't be empty");
        }
        checkValidCredentials(loginEmail, loginPassword);
    };


    const handleEmailChange = (e) => {
        const email = e.target.value;

        setLoginEmail(email);

        if (email === "" && hasInteractedWithEmail) {
            setEmailTooltipMessage("Email can't be empty");
        } else {
            setEmailTooltipMessage("");
        }

        checkValidCredentials(email, loginPassword);
    };


    const handlePasswordChange = (e) => {
        const password = e.target.value;
        var spaceRegex = /\s/; // Regular expression to check for spaces

        if (password === "" && hasInteractedWithPassword) {
            setPasswordTooltipMessage("Password can't be empty");
        } else if (spaceRegex.test(password)) { // Check if password contains spaces
            setPasswordTooltipMessage("Spaces not allowed");
        } else {
            setPasswordTooltipMessage("");
        }

        setLoginPassword(password);
        checkValidCredentials(loginEmail, password);
    };

    const checkValidCredentials = (email, password) => {
        var spaceRegex = /\s/; // Regular expression to check for spaces
        if (email === "" || password === "" || spaceRegex.test(password)) {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }
    };




    const forgotPassword = () => {
        var link = window.location.href.substring(
            0,
            window.location.href.length - 11
        );
        console.log("link is", link);
        Axios({
            method: "POST",
            data: {
                email: loginEmail,
                link: link,
            },
            withCredentials: true,
            url: "/server/forgotpasswordform",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/forgotpasswordmailsent") {
                navigate(`/forgotpasswordmailsent`);
            }
        });
    };

    ////when a user requests for the login , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the login page to enter credentials

    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            if (response.data.message !== "Enter your credentials to Log In") {
                setAuthMsg(response.data.message);
                setShowAuthMsg(true);
            }

            if (response.data.redirect === "/home") {
                navigate(`/home`);
            }
        });
    }, []);


    return (
        <>
        <div className="dottedBackground">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <GeneralNavbar />
            <Row style={{ margin: "auto", width: "100%", minHeight: "85vh" }}>
                <Col
                    style={{
                        marginTop: "1px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        
                    }}
                >
                    <Form
                        style={{
                            width: "30%", // Reduced width
                            minWidth: "300px", // Minimum width set to 300px
                            borderRadius: "10px",
                            padding: "40px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                            background: '#fff'
                        }}
                    >
                        <h1 style={{color: '#333', textAlign: "center", marginBottom: "30px" }}>Login</h1>
                        <Form.Text style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{authMsg}</Form.Text>
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{emailTooltipMessage}</Form.Text>
                            <div className="input-group">
                                <input
                                    type="email"
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                                    id="email"
                                    className="input-field"
                                    placeholder=" "
                                />
                                <label htmlFor="email" className="input-label">Email</label>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{passwordTooltipMessage}</Form.Text>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                                    id="password"
                                    className="input-field"
                                    placeholder=" "
                                />
                                <label htmlFor="password" className="input-label">Password</label>
                            </div>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    label="Show Password"
                                    onClick={handleShowPassword}
                                    style={{ marginTop: "10px", marginBottom: "10px" }}
                                    className="custom-label-color"
                                />
                            </Form.Group>
                        </Form.Group>
                        <Row className="justify-content-md-center">
                            <Col md={6} sm={6}>
                                <Button
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "100%",
                                        marginBottom: "10px",
                                        boxShadow: `0px 7px ${validEmail ? "#1a5928" : "#ab2a2a"}`,
                                    }}
                                    variant={validEmail ? "success" : "danger"}
                                    disabled={!validEmail}
                                    onClick={login}
                                >
                                    Submit
                                </Button>
                            </Col>
                            <Col md={6} sm={6}>
                                <Button
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "100%",
                                        boxShadow: "0px 7px #ab2a2a",
                                    }}
                                    disabled={!validEmail}
                                    variant="danger"
                                    onClick={forgotPassword}
                                >
                                    Forgot Password
                                </Button>
                            </Col>
                        </Row>
                        <hr style={{ margin: "20px 0", borderTop: "2px solid #ccc" }} />
                        <GoogleButton
                            style={{
                                width: "100%",
                                boxShadow: "0px 7px #056fdf",
                                borderRadius: "10px",
                                transition: "0.2s ease",
                            }}
                            onClick={loginWithGoogle}
                            className="googleButton"
                        />
                        <br />
                        <div style={{color: '#333', textAlign: "center", marginBottom: "20px" }}>
                            Don't have an account?
                        </div>
                        <Link to="/auth/register">
                            <Button
                                variant="success"
                                style={{
                                    textAlign: "center",
                                    width: "100%",
                                    padding: "10px",
                                    transition: "0.2s ease",
                                    borderRadius: "10px",
                                    boxShadow: "0px 7px #1a5928",
                                }}
                                className="regHover"   //index.css
                            >
                                Register Now...
                            </Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
            </div>
        </>
    );

};

export default Login;