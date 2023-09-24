import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import GoogleButton from "react-google-button";
import Footer from "../components/Footer";
import "../DarkMode.css";

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
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

    const [hasInteracted, setHasInteracted] = useState(false);

    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
        window.open("https://tryfingo.com/auth/login-google", "_self");
    };

    const handlePasswordBlur = () => {
        setHasInteractedWithPassword(true);
        if (loginPassword === "") {
            setPasswordTooltipMessage("Password can't be empty");
        }
        checkValidCredentials(loginEmail, loginPassword);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value.trim();
        setLoginEmail(email);
        if (hasInteractedWithEmail) {
            if (email === "") {
                setEmailTooltipMessage("Email can't be empty");
                setValidEmail(false);
            } else {
                setEmailTooltipMessage("");
                setValidEmail(true);
            }
        }
    };

    const handleEmailBlur = () => {
        setHasInteractedWithEmail(true);
        if (loginEmail === "") {
            setEmailTooltipMessage("Email can't be empty");
            setValidEmail(false);
        } else if (!isValidEmail(loginEmail)) {
            setEmailTooltipMessage("Invalid email format");
            setValidEmail(false);
        } else {
            setEmailTooltipMessage("");
            setValidEmail(true);
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        var spaceRegex = /\s/;
        if (password === "" && hasInteractedWithPassword) {
            setPasswordTooltipMessage("Password can't be empty");
        } else if (spaceRegex.test(password)) {
            setPasswordTooltipMessage("Spaces not allowed");
        } else {
            setPasswordTooltipMessage("");
        }
        setLoginPassword(password);
        checkValidCredentials(loginEmail, password);
    };

    const checkValidCredentials = (email, password) => {
        var spaceRegex = /\s/;
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (email === "" || password === "" || spaceRegex.test(password) || !emailRegex.test(email)) {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }
    };

    const forgotPassword = () => {
        setIsForgotPasswordLoading(true);
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
            setIsForgotPasswordLoading(false);
        });
    };

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
                                width: "30%",
                                minWidth: "300px",
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
                            <Row className="justify-content-md-center align-items-center">
                                <Col md={6} sm={6}>
                                    <Button
                                        style={{
                                            borderRadius: "7px",
                                            padding: "8px",
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
                                <Col md={6} sm={6} className="text-center">
                                    <div className="text-center">
                                        {isForgotPasswordLoading ? (
                                            <span>Loading...</span>
                                        ) : (
                                            <Link
                                                to="#"
                                                onClick={forgotPassword}
                                                style={{
                                                    marginTop: "10px",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                Forgot Password?🤐
                                            </Link>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <hr style={{ margin: "20px 0", borderTop: "2px solid #ccc" }} />
                            <GoogleButton
                                style={{
                                    width: "100%",
                                    boxShadow: "0px 7px #056fdf",
                                    borderRadius: "7px",
                                    transition: "0.2s ease",
                                }}
                                onClick={loginWithGoogle}
                                className="googleButton"
                            />
                            <br />
                            <div style={{color: '#333', textAlign: "center", marginBottom: "10px" }}>
                                Don't have an account?
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <Link to="/auth/register">
                                    <Button
                                        variant="success"
                                        style={{
                                            textAlign: "center",
                                            width: "50%",
                                            transition: "0.2s ease",
                                            borderRadius: "5px",
                                            boxShadow: "0px 7px #1a5928",
                                        }}
                                        className="regHover"
                                    >
                                        Register Now...
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Login;
