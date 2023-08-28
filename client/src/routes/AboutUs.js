import React, { useState, useEffect } from "react";
import Axios from "axios";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import GeneralNavbar from "../components/GeneralNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SocialIcon } from "react-social-icons";

const sneh = require("../images/sneh.jpg");
const harshit = require("../images/harshit.jpg");

const AboutUs = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("unknown");

    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            console.log("con", response.data);
            if (response.data.redirect === "/home") {
                setRole(response.data.user.role);
            } else {
                setRole("unknown");
            }
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>About Us</title>
            </Helmet>
            {/* <Navbar proprole={'basic'}/> */}
            {role === "unknown" ? (
                <GeneralNavbar />
            ) : (
                <Navbar proprole={role} />
            )}
            <br />
            <h1 style={{ textAlign: "center" }}>About Us</h1>

            <Container>
                <Row>
                    <Col>
                        <Card style={{ width: "75%" }}>
                            <Card.Img variant="top" src={sneh} />
                            <Card.Body>
                                <Card.Title style={{ textAlign: "center" }}>
                                    Sneh Kagrana{" "}
                                    <SocialIcon url="https://linkedin.com/in/sneh-kagrana" />{" "}
                                    <SocialIcon url="https://twitter.com/sneh_kagrana" />
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: "75%" }}>
                            <Card.Img variant="top" src={harshit} />
                            <Card.Body>
                                <Card.Title style={{ textAlign: "center" }}>
                                    Harshit Sureka{" "}
                                    <SocialIcon url="https://linkedin.com/in/hsureka" />{" "}
                                    <SocialIcon url="https://twitter.com/harshit_sureka_" />
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AboutUs;
