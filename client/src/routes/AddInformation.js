import React, { Fragment, useState, useRef, useEffect } from "react";
import Axios from 'src/api/axios'
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import "../styles/file.css";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const AddInformation = (props) => {

    const { auth_syncAndGetUser, user, isAuthenticated } = useAuth();

    const [file, setFile] = useState("");
    const [heading, setHeading] = useState("");
    const [information, setInformation] = useState("");
    const [skills, setSkills] = useState([]);
    const [correspondingSkill, setCorrespondingSkill] =
        useState("Select Skill");
    const [categories, setCategories] = useState([]);
    const [correspondingCategory, setCorrespondingCategory] =
        useState("Select Skill First");
    const [subCategories, setSubCategories] = useState([]);
    const [correspondingSubCategory, setCorrespondingSubCategory] = useState(
        "Select Category First"
    );
    const role = useRef("");
    const tempCorrespondingSkill = useRef("");

    const handleCorrespondingSkillChange = (event) => {
        localStorage.removeItem("skill");
        localStorage.removeItem("category");
        localStorage.removeItem("sub_category");

        setCorrespondingSkill(event.target.value);
        tempCorrespondingSkill.current = event.target.value;
        // console.log('Selectd Skill', event.target.value);
        getCategories(event.target.value);
    };

    const handleCorrespondingCategoryChange = (event) => {
        // console.log('category se',event.target.value);
        setCorrespondingCategory(event.target.value);
        getSubCategories(event.target.value);
    };

    const handleCorrespondingSubCategoryChange = (event) => {
        // console.log('subCategory se',event.target.value);
        setCorrespondingSubCategory(event.target.value);
    };

    const setimgfile = (e) => {
        setFile(e.target.files[0]);
    };

    const navigate = useNavigate();

    const getSubCategories = (forCategory) => {
        // console.log('Category selected iss', forCategory);
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/subcategories/${tempCorrespondingSkill.current}/${forCategory}`,
        }).then((res) => {
            // console.log('subcategories', res.data);
            setSubCategories(res.data.data);
            if (localStorage.getItem("sub_category") != null)
                setCorrespondingSubCategory(
                    localStorage.getItem("sub_category")
                );
            else setCorrespondingSubCategory(res.data.data[0].sub_category);
        });
    };

    const getCategories = (forSkill) => {
        // console.log('skill selected iss', forSkill);
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/categories/${forSkill}`,
        }).then((res) => {
            // console.log('categories', res.data);
            setCategories(res.data.data);
            if (localStorage.getItem("category") != null) {
                setCorrespondingCategory(localStorage.getItem("category"));
                getSubCategories(localStorage.getItem("category"));
            } else {
                setCorrespondingCategory(res.data.data[0]);
                getSubCategories(res.data.data[0]);
            }
        });
    };

    const getSkills = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/skills",
        }).then((res) => {
            let skillsOptions = res.data.data;
            setSkills(skillsOptions);
            if (localStorage.getItem("skill") != null) {
                setCorrespondingSkill(localStorage.getItem("skill"));
                tempCorrespondingSkill.current = localStorage.getItem("skill");
                getCategories(localStorage.getItem("skill"));
            } else {
                setCorrespondingSkill(res.data.data[0].skill);
                tempCorrespondingSkill.current = res.data.data[0].skill;
                getCategories(res.data.data[0].skill);
            }
        });
    };

    const submit = () => {
        // // console.log('hist ', props);
        // console.log('info sent', information);
        // console.log('correspondingSkill sent', correspondingSkill);
        var formData = new FormData();
        if (file != "") formData.append("photo", file);
        formData.append("heading", heading);
        formData.append("information", information);
        formData.append("corresponding_skill", tempCorrespondingSkill.current);
        formData.append("corresponding_category", correspondingCategory);
        formData.append("corresponding_sub_category", correspondingSubCategory);

        localStorage.setItem("skill", tempCorrespondingSkill.current);
        localStorage.setItem("category", correspondingCategory);
        localStorage.setItem("sub_category", correspondingSubCategory);

        // console.log('formData', formData);

        Axios({
            method: "POST",
            data: formData,
            withCredentials: true,
            url: "/server/addinformation",
        }).then(function (response) {
            console.log("Success");
            // console.log('heading', heading);
            // setHeading("");
            // console.log('heading', heading);
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
            getSkills()
        } else {
            navigate(`/accessdenied`);
        }
    }, [user, isAuthenticated]);

    return (
        <>
            <Fragment>
                <Helmet>
                    <title>Add Information</title>
                </Helmet>
                <Navbar proprole={user?.role} />

                <Row>
                    <Col>
                        <div>
                            <Form
                                style={{
                                    width: "80%",
                                    marginLeft: "10%",
                                    marginTop: "5%",
                                }}>
                                <h1>Add Information</h1>
                                <Form.Group>
                                    <Form.Label>Enter Heading</Form.Label>
                                    <Form.Control
                                        type="string"
                                        placeholder="Type heading here ..."
                                        onChange={(e) =>
                                            setHeading(e.target.value)
                                        }
                                        style={{
                                            borderRadius: "10px",
                                            padding: "25px",
                                        }}
                                    />
                                </Form.Group>
                                <br></br>

                                <Form.Group>
                                    <Form.Label>Enter Information</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Type information here ..."
                                        onChange={(e) =>
                                            setInformation(e.target.value)
                                        }
                                        style={{
                                            borderRadius: "10px",
                                            padding: "25px",
                                        }}
                                    />
                                </Form.Group>
                                <br></br>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword">
                                    <Form.Label>Select Your Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={setimgfile}
                                        name="photo"
                                        style={{
                                            borderRadius: "10px",
                                            paddingBottom: "10px",
                                        }}
                                    />
                                </Form.Group>
                                <br></br>

                                <Form.Group>
                                    <Form.Label>
                                        Enter Corresponding Skill
                                    </Form.Label>
                                    <br></br>
                                    <Form.Select
                                        value={correspondingSkill}
                                        style={{
                                            borderRadius: "10px",
                                            padding: "13px",
                                            width: "100%",
                                        }}
                                        onChange={
                                            handleCorrespondingSkillChange
                                        }>
                                        {skills.map((option) => (
                                            <option
                                                key={option._id}
                                                value={option.skill}>
                                                {option.skill
                                                    .split("_")
                                                    .join(" ")}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br></br>

                                {categories !== undefined && (
                                    <Form.Group>
                                        <Form.Label>
                                            Enter Corresponding Category
                                        </Form.Label>
                                        <br></br>
                                        <Form.Select
                                            style={{
                                                borderRadius: "10px",
                                                padding: "13px",
                                                width: "100%",
                                            }}
                                            value={correspondingCategory}
                                            onChange={
                                                handleCorrespondingCategoryChange
                                            }>
                                            {categories.map((category, i) => (
                                                <option
                                                    key={i}
                                                    value={category}>
                                                    {category
                                                        .split("_")
                                                        .join(" ")}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                <br></br>

                                {subCategories !== undefined && (
                                    <Form.Group>
                                        <Form.Label>
                                            Enter Corresponding Sub Category
                                        </Form.Label>
                                        <br></br>
                                        <Form.Select
                                            style={{
                                                borderRadius: "10px",
                                                padding: "13px",
                                                width: "100%",
                                            }}
                                            value={correspondingSubCategory}
                                            onChange={
                                                handleCorrespondingSubCategoryChange
                                            }>
                                            {subCategories.map(
                                                (subcategory, i) => (
                                                    <option
                                                        key={i}
                                                        value={
                                                            subcategory.sub_category
                                                        }>
                                                        {subcategory.sub_category
                                                            .split("_")
                                                            .join(" ")}
                                                    </option>
                                                )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                <br></br>

                                <Button
                                    variant="success"
                                    style={{
                                        marginLeft: "30%",
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "40%",
                                        boxShadow: "0px 7px #1a5928",
                                    }}
                                    onClick={submit}>
                                    Submit
                                </Button>
                                <br />
                                <br />
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Fragment>
        </>
    );
};

export default AddInformation;
