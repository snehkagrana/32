import React, { useRef, useState, useEffect } from "react";
import Axios from 'src/api/axios'
import { useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useAuth } from "src/hooks";

const AddChapters = (props) => {
    const { user, isAuthenticated } = useAuth()
    const [subCategoriesList, setSubCategoriesList] = useState([
        { sub_category: "" },
    ]);
    const [categoriesList, setCategoriesList] = useState([{ category: "" }]);
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [correspondingSkillForCategory, setCorrespondingSkillForCategory] =
        useState("Select Skill");
    const [
        correspondingSkillForSubCategory,
        setCorrespondingSkillForSubCategory,
    ] = useState("Select Skill");
    const [
        correspondingCategoryForSubCategory,
        setCorrespondingCategoryForSubCategory,
    ] = useState("Select Skill First");
    const role = useRef("");

    const handleCategoryInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...categoriesList];
        list[index]["category"] = value;
        setCategoriesList(list);
        // console.log('categoriesList', categoriesList);
    };

    const handleCategoryRemove = (index) => {
        const list = [...categoriesList];
        list.splice(index, 1);
        setCategoriesList(list);
    };

    const handleCategoryAddNew = () => {
        setCategoriesList([...categoriesList, { category: "" }]);
    };

    const handleSubCategoryInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...subCategoriesList];
        list[index]["sub_category"] = value;
        setSubCategoriesList(list);
        // console.log('sub_categoriesList', subCategoriesList);
    };

    const handleSubCategoryRemove = (index) => {
        const list = [...subCategoriesList];
        list.splice(index, 1);
        setSubCategoriesList(list);
    };

    const handleSubCategoryAddNew = () => {
        setSubCategoriesList([...subCategoriesList, { sub_category: "" }]);
    };

    const handleCorrespondingSkillForCategoryChange = (event) => {
        setCorrespondingSkillForCategory(event.target.value);
        // console.log('Selectd Skill', event.target.value);
    };

    const handleCorrespondingSkillForSubCategoryChange = (event) => {
        setCorrespondingSkillForSubCategory(event.target.value);
        // console.log('Selectd Skill', event.target.value);
        getCategories(event.target.value);
    };

    const handleCorrespondingCategoryForSubCategoryChange = (event) => {
        setCorrespondingCategoryForSubCategory(event.target.value);
    };
    const navigate = useNavigate();

    const getCategories = (forSkill) => {
        // console.log('skill selected iss', forSkill);
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/categories/${forSkill}`,
        }).then((res) => {
            // console.log('categories', res.data);
            setCategories(res.data.data);
            setCorrespondingCategoryForSubCategory(res.data.data[0]);
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
            setCorrespondingSkillForCategory(res.data.data[0].skill);
            setCorrespondingSkillForSubCategory(res.data.data[0].skill);
            getCategories(res.data.data[0].skill);
        });
    };

    const submitForSubCategories = () => {
        // // console.log('hist ', props);
        // console.log("correspondingSkillForSubCategory", correspondingSkillForSubCategory);
        // console.log("correspondingCategoryForSubCategory", correspondingCategoryForSubCategory);
        // console.log("subCategoriesList", subCategoriesList);
        Axios({
            method: "POST",
            data: {
                skill: correspondingSkillForSubCategory,
                category: correspondingCategoryForSubCategory,
                sub_categories: subCategoriesList,
            },
            withCredentials: true,
            url: "/server/addsubcategories",
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    const submitForCategories = () => {
        // // console.log('hist ', props);
        // console.log("correspondingSkillForCategory", correspondingSkillForCategory);
        // console.log("categoriesList", categoriesList);
        Axios({
            method: "POST",
            data: {
                skill: correspondingSkillForCategory,
                categories: categoriesList,
            },
            withCredentials: true,
            url: "/server/addcategories",
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    const submitForSkill = () => {
        Axios({
            method: "POST",
            data: {
                skill: skill,
                order: skills.length + 1,
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
        if(isAuthenticated && user.role === "basic") {
            navigate(`/accessdenied`);
        }
        getSkills();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>Add Chapters</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Row>
                <Col>
                    <br></br>
                    <Tabs
                        style={{
                            display: "flex",
                            width: "80%",
                            marginLeft: "10%",
                            marginRight: "10%",
                            borderRadius: "10px",
                            padding: "50px",
                        }}
                        defaultActiveKey="skill"
                        className="mb-3"
                        id="fill-tab-example"
                        fill>
                        <Tab style={{}} eventKey="skill" title="Add Skill">
                            <Form
                                style={{
                                    width: "70%",
                                    marginLeft: "15%",
                                    marginTop: "3%",
                                }}>
                                <h1>Add Skill</h1>
                                <br></br>

                                <Form.Group>
                                    <Form.Label>Enter Skill</Form.Label>
                                    <Form.Control
                                        type="string"
                                        placeholder="Type skill here ..."
                                        onChange={(e) =>
                                            setSkill(e.target.value)
                                        }
                                        style={{
                                            borderRadius: "10px",
                                            padding: "25px",
                                        }}
                                    />
                                </Form.Group>
                                <br></br>
                                <Button
                                    variant="success"
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "10%",
                                        boxShadow: "0px 7px #1a5928",
                                    }}
                                    onClick={submitForSkill}>
                                    Submit
                                </Button>
                            </Form>
                        </Tab>
                        <Tab eventKey="category" title="Add Category">
                            <Form
                                style={{
                                    width: "70%",
                                    marginLeft: "15%",
                                    marginTop: "3%",
                                }}>
                                <h1>Add Category</h1>
                                <br></br>

                                <Form.Group>
                                    <Form.Label>
                                        Enter Corresponding Skill
                                    </Form.Label>
                                    <br></br>
                                    <Form.Select
                                        style={{
                                            borderRadius: "10px",
                                            padding: "13px",
                                            width: "100%",
                                        }}
                                        value={correspondingSkillForCategory}
                                        onChange={
                                            handleCorrespondingSkillForCategoryChange
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

                                <div>
                                    Enter Categories
                                    <br></br>
                                    {categoriesList.map((x, i) => {
                                        return (
                                            <div className="row mb-3">
                                                <div classNme="form-group col-sm-6 col-md-6">
                                                    <Form.Group>
                                                        <Form.Control
                                                            type="string"
                                                            placeholder="Type category here ..."
                                                            onChange={(e) =>
                                                                handleCategoryInput(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "25px",
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div classNme="form-group col-sm-6 col-md-6">
                                                    {categoriesList.length !==
                                                        1 && (
                                                        <button
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "13px",
                                                                width: "100%",
                                                                marginBottom: '8px',
                                                                marginLeft: '8px'
                                                            }}
                                                            className="btn btn-danger mx-1"
                                                            onClick={() =>
                                                                handleCategoryRemove(
                                                                    i
                                                                )
                                                            }>
                                                            Remove
                                                        </button>
                                                    )}
                                                    {categoriesList.length -
                                                        1 ===
                                                        i && (
                                                        <button
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "13px",
                                                                width: "100%",
                                                                marginLeft: '8px'
                                                            }}
                                                            className="btn btn-success"
                                                            onClick={
                                                                handleCategoryAddNew
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
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "40%",
                                        boxShadow: "0px 7px #1a5928",
                                    }}
                                    onClick={submitForCategories}>
                                    Submit
                                </Button>
                            </Form>
                        </Tab>
                        <Tab
                            eventKey="subCategories"
                            title="Add Sub Categories">
                            <Form
                                style={{
                                    width: "70%",
                                    marginLeft: "15%",
                                    marginTop: "3%",
                                }}>
                                <h1>Add Sub Categories</h1>
                                <br></br>

                                <Form.Group>
                                    <Form.Label>
                                        Enter Corresponding Skill
                                    </Form.Label>
                                    <br></br>
                                    <Form.Select
                                        style={{
                                            borderRadius: "10px",
                                            padding: "13px",
                                            width: "100%",
                                        }}
                                        value={correspondingSkillForSubCategory}
                                        onChange={
                                            handleCorrespondingSkillForSubCategoryChange
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
                                            value={
                                                correspondingCategoryForSubCategory
                                            }
                                            onChange={
                                                handleCorrespondingCategoryForSubCategoryChange
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

                                <div>
                                    Enter Sub Categories
                                    <br></br>
                                    {subCategoriesList.map((x, i) => {
                                        return (
                                            <div className="row mb-3">
                                                <div classNme="form-group col-sm-6 col-md-6">
                                                    <Form.Group>
                                                        <Form.Control
                                                            type="string"
                                                            placeholder="Type sub category here ..."
                                                            onChange={(e) =>
                                                                handleSubCategoryInput(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "25px",
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div classNme="form-group col-sm-6 col-md-6">
                                                    {subCategoriesList.length !==
                                                        1 && (
                                                        <button
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "13px",
                                                                width: "100%",
                                                                marginBottom: '8px',
                                                                marginLeft: '8px'
                                                            }}
                                                            className="btn btn-danger mx-1"
                                                            onClick={() =>
                                                                handleSubCategoryRemove(
                                                                    i
                                                                )
                                                            }>
                                                            Remove
                                                        </button>
                                                    )}
                                                    {subCategoriesList.length -
                                                        1 ===
                                                        i && (
                                                        <button
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "13px",
                                                                width: "100%",
                                                                marginLeft: '8px'
                                                            }}
                                                            className="btn btn-success"
                                                            onClick={
                                                                handleSubCategoryAddNew
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
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "40%",
                                        boxShadow: "0px 7px #1a5928",
                                    }}
                                    onClick={submitForSubCategories}>
                                    Submit
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    );
};

export default AddChapters;
/**
 * return (
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title="Home">
        <Sonnet />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Sonnet />
      </Tab>
      <Tab eventKey="contact" title="Contact" disabled>
        <Sonnet />
      </Tab>
    </Tabs>
  );
 */
