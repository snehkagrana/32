import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import Toast from "react-bootstrap/Toast";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ForgotPassword = (props) => {
    const { email, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [authMsg, setAuthMsg] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState(
        "Password not matching"
    );

    const navigate = useNavigate();

    const submit = () => {
        Axios({
            method: "POST",
            data: {
                email: email,
                token: token,
                password: password,
            },
            withCredentials: true,
            url: `/server/forgotpassword`,
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/login") {
                console.log("Success");
                navigate(`/auth/login`);
            }
        });
    };

    const editPassword = (e) => {
        setPassword(e.target.value);
        if (e.target.value === confirmPassword) {
            setPasswordMatch(true);
            setTooltipMessage("Password matched");
        } else setPasswordMatch(false);
    };

    const editConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value === password) {
            setPasswordMatch(true);
            setTooltipMessage("Password matched");
        } else setPasswordMatch(false);
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <GeneralNavbar />
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Col>
                    <div>
                        <Form
                            style={{
                                width: "80%",
                                marginLeft: "10%",
                                marginTop: "3%",
                            }}>
                            <h1>Edit Password</h1>
                            <Toast
                                onClose={() => setShowAuthMsg(false)}
                                show={showAuthMsg}
                                delay={2000}
                                autohide>
                                <Toast.Body>{authMsg}</Toast.Body>
                            </Toast>
                            <Form.Group>
                                <Form.Label>Enter new password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    onChange={editPassword}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm your new password"
                                    onChange={editConfirmPassword}
                                />
                            </Form.Group>
                            <br></br>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id="tooltip-disabled">
                                        {tooltipMessage}
                                    </Tooltip>
                                }>
                                <span className="d-inline-block">
                                    <Button
                                        disabled={
                                            !passwordMatch ||
                                            password.length == 0
                                        }
                                        variant={
                                            !passwordMatch ||
                                            password.length == 0
                                                ? "danger"
                                                : "success"
                                        }
                                        onClick={submit}>
                                        {!passwordMatch || password.length == 0
                                            ? "Password not matching"
                                            : "Submit"}
                                    </Button>
                                </span>
                            </OverlayTrigger>
                            <br />
                            <br />
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ForgotPassword;
