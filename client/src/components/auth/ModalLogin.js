import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Modal } from "react-bootstrap";
import CustomGoogleSignInButton from "../CustomGoogleSignInButton";
import "../../styles/auth.styles.css";

export default function ModalLogin({ isOpen, onClose }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [showAuthMsg, setShowAuthMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false);
  const [hasInteractedWithPassword, setHasInteractedWithPassword] =
    useState(false);
  const [emailTooltipMessage, setEmailTooltipMessage] = useState("");
  const [passwordTooltipMessage, setPasswordTooltipMessage] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    navigate("/home");
  };

  const handleLogin = () => {
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
          if (typeof onClose === "function") {
            onClose();
            navigate(`/home`);
            setTimeout(() => {
              window.location.reload();
            }, 150);
          }
        }
      } else {
        setAuthMsg("Unknown error occurred. Please try again.");
        setShowAuthMsg(true);
      }
    });
  };

  const loginWithGoogle = (e) => {
    e.stopPropagation()
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
    if (
      email === "" ||
      password === "" ||
      spaceRegex.test(password) ||
      !emailRegex.test(email)
    ) {
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
    });
  }, []);

  return (
    <Modal
      className="auth_modal"
      show={isOpen}
      onHide={() => onClose(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <button className="auth_modal_close" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="1024"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="currentColor"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
      </button>
      <Form
        style={{
          width: "100%",
          minWidth: "300px",
          borderRadius: "10px",
          padding: "40px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          background: "#f7fcf7",
        }}
      >
        {/* <button className="back-home" onClick={handleClick} alt="backButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"></path>
          </svg>
        </button> */}
        <h1
          style={{ color: "#333", textAlign: "center", marginBottom: "30px" }}
        >
          Login
        </h1>
        <Form.Text
          style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
        >
          {authMsg}
        </Form.Text>
        <Form.Group>
          <Form.Text style={{ color: "red" }}>{emailTooltipMessage}</Form.Text>
          <div className="input-group">
            <input
              type="email"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              style={{
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "10px",
              }}
              id="email"
              className="input-field"
              placeholder=" "
            />
            <label htmlFor="email" className="input-label">
              Email
            </label>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Text style={{ color: "red" }}>
            {passwordTooltipMessage}
          </Form.Text>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              style={{
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "10px",
              }}
              id="password"
              className="input-field"
              placeholder=" "
            />
            <label htmlFor="password" className="input-label">
              Password
            </label>
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
              onClick={handleLogin}
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
        <CustomGoogleSignInButton onClick={loginWithGoogle} />
        <br />
        <div
          style={{ color: "#333", textAlign: "center", marginBottom: "10px" }}
        >
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
    </Modal>
  );
}
