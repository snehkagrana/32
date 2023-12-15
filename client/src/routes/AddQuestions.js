import React, { useRef, useState, useEffect } from "react";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const AddQuestion = (props) => {
    const { user, isAuthenticated } = useAuth()
    const [file, setFile] = useState("");
    const [question, setQuestion] = useState("");
    const [explaination, setExplaination] = useState("");
    const [optionsList, setOptionsList] = useState([{ option: "" }]);
    const answersList = useRef([]);
    const [skills, setSkills] = useState([]);
    const [correspondingSkill, setCorrespondingSkill] = useState("Database");
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
        getCategories(event.target.value);
    };

    const handleCorrespondingCategoryChange = (event) => {
        setCorrespondingCategory(event.target.value);
        getSubCategories(event.target.value);
    };

    const handleCorrespondingSubCategoryChange = (event) => {
        // console.log('subCategory se',event.target.value);
        setCorrespondingSubCategory(event.target.value);
    };

    const setimgfile = (e) => {
        // console.log('image up', e);
        // console.log('image up target', e.target);
        // console.log('image up target files', e.target.files);
        setFile(e.target.files[0]);
    };

    const navigate = useNavigate();

    const handleAnswer = (i) => {
        var tempAnswersList = answersList.current;
        if (answersList.current.includes(i))
            answersList.current = tempAnswersList.filter((j) => j != i);
        else answersList.current = tempAnswersList.concat(i);
        answersList.current.sort();
        // console.log('answersList.current', answersList.current);
    };

    const handleOptionInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...optionsList];
        list[index]["option"] = value;
        setOptionsList(list);
        // console.log('optionsList', optionsList);
    };

    const handleRemove = (index) => {
        // console.log('optionList', optionsList);
        const list = [...optionsList];
        list.splice(index, 1);
        setOptionsList(list);
        // console.log('optionList', optionsList);

        var tempAnswersList = answersList.current;
        if (answersList.current.includes(index))
            answersList.current = tempAnswersList.filter((j) => j != index);
        answersList.current.sort();
        // console.log('answersList.current', answersList.current);
    };

    const handleAddNewOptionClick = () => {
        setOptionsList([...optionsList, { option: "" }]);
    };

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
            setSkills(res.data.data);
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
        var options = [];
        optionsList.forEach((element) => {
            options.push(element.option);
        });

        var formData = new FormData();
        if (file != "") formData.append("photo", file);
        formData.append("question", question);
        formData.append("options", options);
        formData.append("correct_answers", answersList.current);
        formData.append("explaination", explaination);
        formData.append("corresponding_skill", tempCorrespondingSkill.current);
        formData.append("corresponding_category", correspondingCategory);
        formData.append("corresponding_sub_category", correspondingSubCategory);

        localStorage.setItem("skill", tempCorrespondingSkill.current);
        localStorage.setItem("category", correspondingCategory);
        localStorage.setItem("sub_category", correspondingSubCategory);
        // console.log('optionsList', optionsList);
        // console.log('formData', formData);

        // console.log('optionsList', options);

        Axios({
            method: "POST",
            data: formData,
            withCredentials: true,
            url: "/server/addquestions",
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    ////when a user requests for the login , we check if he is already logged in
    ////If user is already logged in redirect him to home page else
    ////send the login page to enter credentials

    useEffect(() => {
        if(isAuthenticated) {
            if (user.role === "basic") {
                navigate(`/accessdenied`);
            }
            getSkills()
        } else {
            navigate(`/accessdenied`);
        }
        // console.log("in use effect");
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>Add Question</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Row>
                <Col>
                    <div>
                        <Form
                            style={{
                                width: "80%",
                                marginLeft: "10%",
                                marginTop: "3%",
                            }}>
                            <h1>Add Question</h1>
                            <Form.Group>
                                <Form.Label>Enter Question</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Type question here ..."
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
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
                                    placeholder=""
                                    style={{
                                        borderRadius: "10px",
                                        padding: "",
                                    }}
                                />
                            </Form.Group>
                            <br></br>

                            <div>
                                Enter Options
                                <br></br>
                                {optionsList.map((x, i) => {
                                    return (
                                        <div className="row mb-3">
                                            <div class="form-group col-sm-6 col-md-6">
                                                <Form.Group>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onClick={() =>
                                                            handleAnswer(i)
                                                        }
                                                    />
                                                    <Form.Control
                                                        type="string"
                                                        placeholder="Type option here ..."
                                                        onChange={(e) =>
                                                            handleOptionInput(
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
                                            <div class="form-group col-sm-6 col-md-6">
                                                {optionsList.length !== 1 && (
                                                    <button
                                                        className="btn btn-danger mx-1"
                                                        style={{
                                                            borderRadius:
                                                                "10px",
                                                            padding: "13px",
                                                            width: "45%",
                                                            boxShadow:
                                                                "0px 7px #1a5928",
                                                        }}
                                                        onClick={() =>
                                                            handleRemove(i)
                                                        }>
                                                        Remove
                                                    </button>
                                                )}
                                                {optionsList.length - 1 ===
                                                    i && (
                                                    <button
                                                        className="btn btn-success"
                                                        style={{
                                                            borderRadius:
                                                                "10px",
                                                            padding: "13px",
                                                            width: "45%",
                                                            boxShadow:
                                                                "0px 7px #1a5928",
                                                        }}
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

                            <Form.Group>
                                <Form.Label>Enter Explaination</Form.Label>
                                <Form.Control
                                    type="string"
                                    placeholder="Type explaination here ..."
                                    onChange={(e) =>
                                        setExplaination(e.target.value)
                                    }
                                    style={{
                                        borderRadius: "10px",
                                        padding: "25px",
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
                                    style={{
                                        borderRadius: "10px",
                                        padding: "13px",
                                        width: "100%",
                                    }}
                                    value={correspondingSkill}
                                    onChange={handleCorrespondingSkillChange}>
                                    {skills.map((option) => (
                                        <option
                                            key={option._id}
                                            value={option.skill}>
                                            {option.skill.split("_").join(" ")}
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
                                            <option key={i} value={category}>
                                                {category.split("_").join(" ")}
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
                                        {subCategories.map((subcategory, i) => (
                                            <option
                                                key={i}
                                                value={
                                                    subcategory.sub_category
                                                }>
                                                {subcategory.sub_category
                                                    .split("_")
                                                    .join(" ")}
                                            </option>
                                        ))}
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
        </>
    );
};

export default AddQuestion;
