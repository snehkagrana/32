import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "src/api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const EditQuestion = (props) => {
    const { user, isAuthenticated } = useAuth();
    const { skill, category, subcategory, id } = useParams();
    const [questionObject, setQuestionObject] = useState({});
    const [question, setQuestion] = useState("");
    const [explaination, setExplaination] = useState("");
    const [optionsList, setOptionsList] = useState([]);
    const [imageURL, setImageURL] = useState("");
    const [file, setFile] = useState("");
    const answersList = useRef([]);
    const role = useRef("");

    const navigate = useNavigate();

    const setimgfile = (e) => {
        setFile(e.target.files[0]);
    };

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
        const list = [...optionsList];
        list.splice(index, 1);
        setOptionsList(list);

        var tempAnswersList = answersList.current;
        if (answersList.current.includes(index))
            answersList.current = tempAnswersList.filter((j) => j != index);
        answersList.current.sort();
        // console.log('answersList.current', answersList.current);
    };

    const handleAddNewOptionClick = () => {
        setOptionsList([...optionsList, { option: "" }]);
    };

    const getQuestion = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/question/${id}`,
        }).then((res) => {
            // console.log('question full data', res.data);
            // console.log('question ',res.data.data);
            setQuestionObject(res.data.data);
            setQuestion(String(res.data.data.question));

            res.data.data.correct_answers.forEach((element) => {
                answersList.current.push(Number(element));
            });

            // console.log('question', String(res.data.data.question));
            var tempOptionsList = [];
            res.data.data.options.forEach((element) => {
                tempOptionsList.push({ option: element });
            });
            // console.log('optionsList', tempOptionsList);
            setOptionsList(tempOptionsList);
            setExplaination(res.data.data.explaination);
            if (res.data.url !== undefined) {
                // console.log('url',res.data.url);
                setImageURL(res.data.url);
            }
            // console.log('correctOption', res.data.data.correct_answer);
        });
    };

    const submit = () => {
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

        // console.log('posted');
        Axios({
            method: "POST",
            data: formData,
            withCredentials: true,
            url: `/server/editquestion/${id}`,
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    useEffect(() => {
        // console.log("in use effect");
        if(isAuthenticated && user.role === "basic") {
            navigate(`/accessdenied`);
        }
        getQuestion();
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>Edit Question</title>
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
                            <h1>Edit Question</h1>
                            {
                                <Form.Group>
                                    <Form.Label>Enter Question</Form.Label>
                                    <Form.Control
                                        type="string"
                                        defaultValue={question}
                                        onChange={(e) =>
                                            setQuestion(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            }
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
                                />
                            </Form.Group>
                            <br></br>

                            <div>
                                Edit Options
                                <br></br>
                                {optionsList.map((x, i) => {
                                    return (
                                        <div className="row mb-3">
                                            <div className="form-group col-md-4">
                                                <Form.Group>
                                                    <Form.Check
                                                        type="checkbox"
                                                        onClick={() =>
                                                            handleAnswer(i)
                                                        }
                                                        defaultChecked={answersList.current.includes(
                                                            i
                                                        )}
                                                    />
                                                    <Form.Control
                                                        type="string"
                                                        defaultValue={
                                                            optionsList[i]
                                                                .option
                                                        }
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
                                                {optionsList.length !== 1 && (
                                                    <button
                                                        className="btn btn-danger mx-1"
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

                            {
                                <Form.Group>
                                    <Form.Label>Enter Explaination</Form.Label>
                                    <Form.Control
                                        type="string"
                                        defaultValue={explaination}
                                        onChange={(e) =>
                                            setExplaination(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            }
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

export default EditQuestion;
