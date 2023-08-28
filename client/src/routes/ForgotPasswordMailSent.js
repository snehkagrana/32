import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Row, Card, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import GeneralNavbar from "../components/GeneralNavbar";

const ForgotPassword = (props) => {
    return (
        <>
            <Helmet>
                <title>Mail Sent</title>
            </Helmet>
            <GeneralNavbar />
            <br />
            <Card
                className="d-flex flex-column"
                style={{
                    width: "80%",
                    margin: "0 auto",
                    borderRadius: "15px",
                }}>
                <Card.Body>
                    <Card.Title>
                        <span style={{ fontWeight: "bold" }}>
                            Forgot Password Link Sent
                        </span>
                    </Card.Title>

                    <Card.Text>
                        Check your registered email. In case it is not show in
                        inbox, please check spam.
                    </Card.Text>
                    <Link to="/auth/login">
                        <Button>Login</Button>
                    </Link>
                </Card.Body>
            </Card>
        </>
    );
};

export default ForgotPassword;
