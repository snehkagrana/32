import React, { useState, useEffect, useRef } from "react";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const EnterEmail = (props) => {
    const { auth_syncAndGetUser } = useAuth();
    const [authMsg, setAuthMsg] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const role = useRef("");

    const navigate = useNavigate();

    const enteremail = () => {
        // console.log('hist ', props);
        Axios({
            method: "POST",
            data: {
                email: email,
            },
            withCredentials: true,
            url: "/server/updateemail",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/home") {
                navigate(`/home`);
            }
        });
    };

    const enterFullName = () => {
        Axios({
            method: "POST",
            data: {
                displayName: fullName,
            },
            withCredentials: true,
            url: "/server/updatefullname",
        }).then(function (response) {
            setAuthMsg(response.data.message);
            setShowAuthMsg(true);
            if (response.data.redirect == "/home") {
                navigate(`/home`);
            }
        });
    };

    ////when a user requests for the login , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the login page to enter credentials

    useEffect(() => {
        auth_syncAndGetUser().then(result => {
            if (result?._id) {
                setAuthMsg(result?.message);
                setShowAuthMsg(true);
            if (
                result?.email != undefined &&
                result?.email.length > 0
            ) {
                setEmail(result?.email);
            }
            role.current = result?.role;
            }
        })
    }, []);

    return (
        <>
            <Helmet>
                <title>Update Email</title>
            </Helmet>
            <Navbar proprole={role} />

            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Col>
                    <div>
                        <br />
                        <br />
                        <br />
                        <Form
                            style={{
                                width: "50%",
                                marginLeft: "25%",
                                marginTop: "3%",
                            }}>
                            <h1>Update Email</h1>
                            <Toast
                                onClose={() => setShowAuthMsg(false)}
                                show={showAuthMsg}
                                delay={2000}
                                autohide>
                                <Toast.Body>{authMsg}</Toast.Body>
                            </Toast>
                            <Form.Group>
                                <Form.Label>Enter your email</Form.Label>
                                <Form.Control
                                    type="email"
                                    defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <Button
                                variant="success"
                                onClick={enteremail}
                                style={{ boxShadow: "0px 7px #1a5928" }}>
                                Submit
                            </Button>
                        </Form>

                        <Form
                            style={{
                                width: "50%",
                                marginLeft: "25%",
                                marginTop: "3%",
                            }}>
                            <h1>Update Name</h1>
                            <Toast
                                onClose={() => setShowAuthMsg(false)}
                                show={showAuthMsg}
                                delay={2000}
                                autohide>
                                <Toast.Body>{authMsg}</Toast.Body>
                            </Toast>
                            <Form.Group>
                                <Form.Label>Enter your full name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />
                            </Form.Group>
                            <br />
                            <Button
                                variant="success"
                                onClick={enterFullName}
                                style={{ boxShadow: "0px 7px #1a5928" }}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default EnterEmail;
