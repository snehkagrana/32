import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import GoogleButton from "react-google-button";
import Footer from "../components/Footer";

const Register = (props) => {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerFirstName, setRegisterFirstName] = useState("");
    const [registerLastName, setRegisterLastName] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [usernameTooltipMessage, setUsernameTooltipMessage] = useState("");
    const [emailTooltipMessage, setEmailTooltipMessage] = useState("");
    const [lastNameTooltipMessage, setLastNameTooltipMessage] = useState("");
    const [firstNameTooltipMessage, setFirstNameTooltipMessage] = useState("");
    const [hasInteractedWithUsername, setHasInteractedWithUsername] = useState(false);
    const [hasInteractedWithFirstName, setHasInteractedWithFirstName] = useState(false);
    const [hasInteractedWithLastName, setHasInteractedWithLastName] = useState(false);
    const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false);
    const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
    const [authMsg, setAuthMsg] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validFirstName, setValidFirstName] = useState(false);
    const [validLastName, setValidLastName] = useState(false);
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordTooltipMessage, setPasswordTooltipMessage] = useState(
        ""
    );

    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    ////function to register user from the server after he has entered the information
    //// if all the information is valid redirect him to login page else display the flash message
    const register = () => {
        Axios({
            method: "POST",
            data: {
                username: registerUsername,
                displayName: `${registerFirstName} ${registerLastName}`,
                email: registerEmail,
                password: registerPassword,
                role: "basic",
            },
            withCredentials: true,
            url: "/server/register",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/") {
                navigate(`/`);
            } else if (response.data.redirect == "/login") {
                navigate(`/auth/login`);
            }
        });
    };

    const registerWithGoogle = () => {
        // Axios does not work with Google Auth2.0 , need to navigate to the url directly
        window.open("https://tryfingo.com/auth/login-google", "_self");
    };

    ////when a user requests for the register , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the register page to let him register
    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/register",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/home") {
                navigate(`/home`);
            }
        });
    }, []);

    const handleUsernameChange = (e) => {
        setRegisterUsername(e.target.value);
        var emailRegex = /\s/;
        if (e.target.value === "" && hasInteractedWithUsername) {
            setUsernameTooltipMessage("Username can't be empty");
            setValidUsername(false);
        } else if (!emailRegex.test(e.target.value)) {
            setUsernameTooltipMessage("");
            setValidUsername(true);
        } else {
            setUsernameTooltipMessage("Spaces not allowed");
            setValidUsername(false);
        }
    };

    const handleUsernameBlur = () => {
        setHasInteractedWithUsername(true);
        if (registerUsername === "") {
            setUsernameTooltipMessage("Username can't be empty");
        }
    };

    const handleFirstNameChange = (e) => {
        setRegisterFirstName(e.target.value);
        var firstNameRegex = /\s/;
        if (e.target.value === "" && hasInteractedWithFirstName) {
            setFirstNameTooltipMessage("First Name can't be empty");
            setValidFirstName(false);
        } else if (!firstNameRegex.test(e.target.value)) {
            setFirstNameTooltipMessage("");
            setValidFirstName(true);
        }
    };

    const handleFirstNameBlur = () => {
        setHasInteractedWithFirstName(true);
        if (registerFirstName === "") {
            setFirstNameTooltipMessage("First Name can't be empty");
        }
    };




    const handleLastNameChange = (e) => {
        setRegisterLastName(e.target.value);
        var lastNameRegex = /\s/;
        if (e.target.value === "" && hasInteractedWithLastName) {
            setLastNameTooltipMessage("Last Name can't be empty");
            setValidLastName(false);
        } else if (!lastNameRegex.test(e.target.value)) {
            setLastNameTooltipMessage("");
            setValidLastName(true);
        }
    };

    const handleLastNameBlur = () => {
        setHasInteractedWithLastName(true);
        if (registerLastName === "") {
            setLastNameTooltipMessage("Last Name can't be empty");
        }
    };

    const handleEmailChange = (e) => {
        setRegisterEmail(e.target.value);
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (e.target.value === "" && hasInteractedWithEmail) {
            setEmailTooltipMessage("Email can't be empty");
            setValidEmail(false);
        } else if (emailRegex.test(e.target.value)) {
            setEmailTooltipMessage("");
            setValidEmail(true);
        } else {
            setEmailTooltipMessage("Email invalid");
            setValidEmail(false);
        }
    };

    const handleEmailBlur = () => {
        setHasInteractedWithEmail(true);
        if (registerEmail === "") {
            setEmailTooltipMessage("Email can't be empty");
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setRegisterPassword(password);

        if (password === "") {
            setPasswordTooltipMessage("Password can't be empty");
            setValidPassword(false);
        } else if (/\s/.test(password)) { // Check if password contains spaces
            setPasswordTooltipMessage("Spaces not allowed");
            setValidPassword(false);
        } else {
            setPasswordTooltipMessage("");
            setValidPassword(true);
        }
    };

    const handlePasswordBlur = () => {
        setHasInteractedWithPassword(true);
        if (registerPassword === "") {
            setPasswordTooltipMessage("Password can't be empty");

        }
    };

    return (
        <><div className="dottedBackground">
            <Helmet>
                <title>Register</title>
            </Helmet>
            <GeneralNavbar />
            <Row style={{ margin: "auto", width: "100%", minHeight: "85vh" }}>
                <Col
                    style={{
                        marginTop: "1px",
                        marginBottom: "25px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Form
                        style={{
                            width: "30%",
                            borderRadius: "10px",
                            padding: "40px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                            minWidth: "300px",
                            background: '#fff'
                        }}
                    >
                        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Create Account!</h1>

                        {/* <Toast onClose={() => setShowAuthMsg(false)} show={showAuthMsg} delay={1500} autohide>
                            <Toast.Body>{authMsg}</Toast.Body>
                        </Toast> */}
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{usernameTooltipMessage}</Form.Text>
                            <Form.Control
                                type="username"
                                placeholder="Enter a unique username"
                                onChange={handleUsernameChange}
                                onBlur={handleUsernameBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        {/* First Name Form Group */}
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{firstNameTooltipMessage}</Form.Text>
                            <Form.Control
                                type="text"
                                placeholder="First Name"
                                onChange={handleFirstNameChange}
                                onBlur={handleFirstNameBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        {/* Last Name Form Group */}
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{lastNameTooltipMessage}</Form.Text>
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                onChange={handleLastNameChange}
                                onBlur={handleLastNameBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        {/* Email Form Group */}
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{emailTooltipMessage}</Form.Text>
                            <Form.Control
                                type="email"
                                placeholder="Enter your Email"
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                        </Form.Group>
                        {/* Password Form Group */}
                        <Form.Group>
                            <Form.Text style={{ color: "red" }}>{passwordTooltipMessage}</Form.Text>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your Password"
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                style={{ borderRadius: "10px", padding: "15px", marginBottom: "10px" }}
                            />
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    label="Show Password"
                                    onClick={handleShowPassword}
                                    style={{ marginTop: "10px", marginBottom: "10px" }}
                                />
                            </Form.Group>
                        </Form.Group>
                        {/* Submit Button */}
                        <Button
                            style={{
                                borderRadius: "10px",
                                padding: "10px",
                                width: "100%",
                                boxShadow: `0px 7px ${
                                    validUsername && validEmail && validFirstName && validLastName && validPassword
                                        ? "#1a5928"
                                        : "#ab2a2a"
                                }`,
                            }}
                            variant={
                                validUsername && validEmail && validFirstName && validLastName && validPassword
                                    ? "success"
                                    : "danger"
                            }
                            disabled={!(validUsername && validEmail && validFirstName && validLastName && validPassword)}
                            onClick={register}
                        >
                            Create New Fingo ID
                        </Button>
                        <br />
                        <div style={{ textAlign: "center", fontSize: "16px", margin: "10px 0" }}>
                            <hr className="hr-text" data-content="OR" />
                        </div>

                        <GoogleButton
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                boxShadow: "0px 7px #056fdf",
                                transition: "0.2s ease",
                            }}
                            className="googleButton"
                            onClick={registerWithGoogle}
                        />

                        <br />
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "10px",
                                marginTop: "20px", // Added space above this line
                            }}
                        >
                            Already have an account?
                            <Link to="/auth/login">
                                <Button
                                    variant="success" // Added success variant to match the green color
                                    style={{
                                        marginLeft: "10px",
                                        borderRadius: "7px",
                                        boxShadow: "0px 5px #1a5928",
                                        transition: "0.2s ease",
                                    }}
                                    className="regHover"
                                >
                                    Login
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

export default Register;