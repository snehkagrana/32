import React, { useRef, useState, useEffect } from "react";
import Axios from 'src/api/axios'
import { useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const AddSkill = (props) => {
    const { user, isAuthenticated } = useAuth();
    const [skill, setSkill] = useState("");
    const [categoriesList, setCategoriesList] = useState([{ category: "" }]);
    const navigate = useNavigate();
    const role = useRef("");

    const handleOptionInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...categoriesList];
        list[index]["category"] = value;
        setCategoriesList(list);
        // console.log('categoriesList', categoriesList);
    };

    const handleRemove = (index) => {
        const list = [...categoriesList];
        list.splice(index, 1);
        setCategoriesList(list);
    };

    const handleAddNewOptionClick = () => {
        setCategoriesList([...categoriesList, { category: "" }]);
    };

    const submit = () => {
        // // console.log('hist ', props);
        // console.log("before category List", categoriesList);
        if (categoriesList.length === 1 && categoriesList[0].category === "") {
            const list = [...categoriesList];
            list[0]["category"] = skill;
            setCategoriesList(list);
        }
        // console.log("after category List", categoriesList);
        Axios({
            method: "POST",
            data: {
                skill: skill,
                categories: categoriesList,
            },
            withCredentials: true,
            url: "/server/addskill",
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    ////when a user requests for the login , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the login page to enter credentials

    useEffect(() => {
        // console.log("in use effect");
        if(isAuthenticated) {
            if (user.role === "basic") {
                navigate(`/accessdenied`);
            }
        } else {
            navigate(`/accessdenied`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user]);

    return (
        <>
            <Helmet>
                <title>Add Skill</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Col>
                    <div>
                        <Form
                            style={{
                                width: "80%",
                                marginLeft: "10%",
                                marginTop: "3%",
                            }}>
                            <h1>Add Skill</h1>
                            <Form.Group>
                                <Form.Label>Enter Skill</Form.Label>
                                <Form.Control
                                    type="string"
                                    placeholder="Type skill here ..."
                                    onChange={(e) => setSkill(e.target.value)}
                                />
                            </Form.Group>
                            <br></br>

                            <div>
                                Enter Categories
                                <br></br>
                                {categoriesList.map((x, i) => {
                                    return (
                                        <div className="row mb-3">
                                            <div className="form-group col-md-4">
                                                <Form.Group>
                                                    <Form.Control
                                                        type="string"
                                                        placeholder="Type category here ..."
                                                        onChange={(e) =>
                                                            handleOptionInput(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="form-group col-md-2 mt-4">
                                                {categoriesList.length !==
                                                    1 && (
                                                    <button
                                                        className="btn btn-danger mx-1"
                                                        onClick={() =>
                                                            handleRemove(i)
                                                        }>
                                                        Remove
                                                    </button>
                                                )}
                                                {categoriesList.length - 1 ===
                                                    i && (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={
                                                            handleAddNewOptionClick
                                                        }>
                                                        Add More
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <br></br>
                            <Button
                                variant="success"
                                style={{ boxShadow: "0px 7px #1a5928" }}
                                onClick={submit}>
                                Submit
                            </Button>
                            <br />
                            <br />
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default AddSkill;
