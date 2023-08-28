import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import GoogleButton from "react-google-button";
import Footer from "../components/Footer";

/////Login page of our website
//// loginUsername is the entered username by the user
//// loginPassword is the entered password by the user

//// authMsg is the flash message which may be show if
//// user enters wrong user name or password

const Login = (props) => {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [authMsg, setAuthMsg] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validUsername, setValidUsername] = useState(false);
    const [hasInteractedWithUsername, setHasInteractedWithUsername] = useState(false);
    const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
    const [usernameTooltipMessage, setUsernameTooltipMessage] = useState("");
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
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            // Check the server response message and act accordingly
            if (response.data.message === "Incorrect Username or Wrong Password") {
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



    const handleUsernameBlur = () => {
        setHasInteracted(true);
        if (loginUsername === "") {
            setUsernameTooltipMessage("Username can't be empty");
        }};

    const handlePasswordBlur = () => {
        setHasInteractedWithPassword(true);
        if (loginPassword === "") {
            setPasswordTooltipMessage("Password can't be empty");
        }
        checkValidCredentials(loginUsername, loginPassword);
    };


    const handleUsernameChange = (e) => {
        const username = e.target.value;
        var spaceRegex = /\s/; // Regular expression to check for spaces

        setLoginUsername(username);

        if (username === "" && hasInteractedWithUsername) {
            setUsernameTooltipMessage("Username can't be empty");
        } else if (spaceRegex.test(username)) { // Check if username contains spaces
            setUsernameTooltipMessage("Spaces not allowed");
        } else {
            setUsernameTooltipMessage("");
        }

        checkValidCredentials(username, loginPassword);
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
        checkValidCredentials(loginUsername, password);
    };

    const checkValidCredentials = (username, password) => {
        var spaceRegex = /\s/; // Regular expression to check for spaces
        if (username === "" || password === "" || spaceRegex.test(password)) {
            setValidUsername(false);
        } else {
            setValidUsername(true);
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
                username: loginUsername,
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
                        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Login</h1>
                        <Form.Text style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{authMsg}</Form.Text>
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{usernameTooltipMessage}</Form.Text>
                            <Form.Control
                                type="username"
                                placeholder="Username"
                                onChange={handleUsernameChange}
                                onBlur={handleUsernameBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{passwordTooltipMessage}</Form.Text>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        <Row className="justify-content-md-center">
                            <Col md={6} sm={6}>
                                <Button
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "100%",
                                        marginBottom: "10px",
                                        boxShadow: `0px 7px ${validUsername ? "#1a5928" : "#ab2a2a"}`,
                                    }}
                                    variant={validUsername ? "success" : "danger"}
                                    disabled={!validUsername}
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
                                    disabled={!validUsername}
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
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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