import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import GoogleButton from "react-google-button";
import Axios from "axios";

const LoginModal = ({ onLogin, onGoogleLogin, onClose }) => {
  const [show, setShow] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false);
  const [hasInteractedWithPassword, setHasInteractedWithPassword] = useState(false);
  const [emailTooltipMessage, setEmailTooltipMessage] = useState("");
  const [passwordTooltipMessage, setPasswordTooltipMessage] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState("");

  const handleShow = () => {
    setShow(true);
    setAuthMsg("");
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  const handleLogin = () => {
    // Validate loginEmail and loginPassword here
    if (onLogin) {
      onLogin(loginEmail, loginPassword);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
  };

  const forgotPassword = () => {
    setIsForgotPasswordLoading(true);
    var link = window.location.href.substring(
      0,
      window.location.href.length - 11
    );
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
      if (response.data.redirect === "/forgotpasswordmailsent") {
        // Handle redirection to the appropriate page
      }
      setIsForgotPasswordLoading(false);
    });
  };

  const handleGoogleLogin = () => {
    // Perform the Google sign-in here
    if (onGoogleLogin) {
      onGoogleLogin();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                  onBlur={handleEmailBlur}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
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
          <div className="text-center">
            {isForgotPasswordLoading ? (
              <span>Loading...</span>
            ) : (
              <a
                href="#"
                onClick={forgotPassword}
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  display: "block",
                }}
              >
                Forgot Password?🤐
              </a>
            )}
          </div>
        </Modal.Footer>
        <Modal.Footer>
          <GoogleButton
            onClick={handleGoogleLogin}
            className="googleButton"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginModal;
