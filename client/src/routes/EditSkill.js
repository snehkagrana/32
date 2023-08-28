import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";

const EditSkill = (props) => {
    const { skill } = useParams();
    const [editedSkill, setEditedSkill] = useState(skill);
    const role = useRef("");

    const navigate = useNavigate();

    const submit = () => {
        Axios({
            method: "POST",
            data: {
                newSkill: editedSkill,
            },
            withCredentials: true,
            url: `/server/editskill/${skill}/`,
        }).then(function (response) {
            console.log("Success");
            navigate(`/allskills`);
        });
    };

    useEffect(() => {
        // console.log("in use effect");
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            if (response.data.redirect == "/login") {
                // console.log("Please log in");
                navigate(`/auth/login`);
            } else if (response.data.user.role === "basic") {
                navigate(`/accessdenied`);
            } else {
                role.current = response.data.user.role;
                // console.log('edit skill', skill);
            }
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>Edit Skill</title>
            </Helmet>
            <Navbar proprole={role} />
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Col>
                    <div>
                        <Form
                            style={{
                                width: "80%",
                                marginLeft: "10%",
                                marginTop: "3%",
                            }}>
                            <h1>Edit Skill</h1>
                            <Form.Group>
                                <Form.Label>Edit</Form.Label>
                                <Form.Control
                                    type="string"
                                    defaultValue={skill.split("_").join(" ")}
                                    onChange={(e) =>
                                        setEditedSkill(e.target.value)
                                    }
                                />
                            </Form.Group>
                            <br></br>

                            <Button onClick={submit}>Submit</Button>
                            <br />
                            <br />
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default EditSkill;
