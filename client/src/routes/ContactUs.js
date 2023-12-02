import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [authMsg, setAuthMsg] = useState("");
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const [emailTooltipMessage, setEmailTooltipMessage] = useState("");
    const [nameTooltipMessage, setNameTooltipMessage] = useState("");
    const [concernTooltipMessage, setConcernTooltipMessage] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validConcern, setValidConcern] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [concernTouched, setConcernTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const contactus = () => {
        if (validEmail && validName && validConcern) {
            setLoading(true);

            Axios({
                method: "POST",
                data: {
                    name: name,
                    emailMessage: emailMessage,
                    emailAddress: emailAddress,
                },
                withCredentials: true,
                url: "/server/contactus",
            })
                .then(function (response) {
                    setAuthMsg(response.data.message);
                    setShowAuthMsg(true);

                    // Clear the form fields after submission
                    setName("");
                    setEmailAddress("");
                    setEmailMessage("");
                    setValidEmail(false);
                    setValidName(false);
                    setValidConcern(false);
                    setNameTouched(false);
                    setEmailTouched(false);
                    setConcernTouched(false);
                })
                .catch(function (error) {
                    console.error("Error submitting form:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleEmailChange = (e) => {
        setEmailAddress(e.target.value);
        setEmailTouched(true);

        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (e.target.value === "") {
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

    const handleNameChange = (e) => {
        setName(e.target.value);
        setNameTouched(true);
        if (e.target.value === "") {
            setNameTooltipMessage("Name can't be empty");
            setValidName(false);
        } else {
            setNameTooltipMessage("");
            setValidName(true);
        }
    };

    const handleConcernChange = (e) => {
        setEmailMessage(e.target.value);
        setConcernTouched(true);
        if (e.target.value === "") {
            setConcernTooltipMessage("Concern can't be empty");
            setValidConcern(false);
        } else {
            setConcernTooltipMessage("");
            setValidConcern(true);
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us</title>
            </Helmet>
            <GeneralNavbar />
            <Row style={{ margin: "auto", width: "100%", minHeight: "85vh" }}>
                <Col style={{ marginTop: "50px" }}>
                    <div>
                        <Form
                            style={{
                                width: "40%",
                                marginLeft: "30%",
                                marginRight: "30%",
                            }}
                        >
                            <h1
                                style={{
                                    textAlign: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                Contact Us
                            </h1>
                            <Toast
                                onClose={() => setShowAuthMsg(false)}
                                show={showAuthMsg}
                                delay={2000}
                                autohide
                            >
                                <Toast.Body>{authMsg}</Toast.Body>
                            </Toast>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Text
                                    style={{
                                        color: emailTouched && !validEmail ? "red" : "",
                                    }}
                                >
                                    {emailTooltipMessage}
                                </Form.Text>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={emailAddress}
                                    onChange={handleEmailChange}
                                    style={{
                                        borderRadius: "10px",
                                        padding: "25px",
                                    }}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Text
                                    style={{
                                        color: nameTouched && !validName ? "red" : "green",
                                    }}
                                >
                                    {nameTooltipMessage}
                                </Form.Text>
                                <Form.Control
                                    type="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={handleNameChange}
                                    style={{
                                        borderRadius: "10px",
                                        padding: "25px",
                                    }}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>Concern</Form.Label>
                                <Form.Text
                                    style={{
                                        color: concernTouched && !validConcern ? "red" : "",
                                    }}
                                >
                                    {concernTooltipMessage}
                                </Form.Text>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter your concern"
                                    value={emailMessage}
                                    onChange={handleConcernChange}
                                    onFocus={() => setConcernTooltipMessage("Concern can't be empty")}
                                    style={{
                                        borderRadius: "10px",
                                        padding: "25px",
                                    }}
                                />
                            </Form.Group>
                            <br />
                            <Button
                                style={{
                                    borderRadius: "10px",
                                    padding: "13px",
                                    width: "",
                                    marginRight: "3%",
                                }}
                                variant={
                                    validEmail && validName && validConcern
                                        ? "success"
                                        : "danger"
                                }
                                disabled={
                                    !(validEmail && validName && validConcern)
                                }
                                onClick={contactus}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Footer />
        </>
    );
};

export default ContactUs;


