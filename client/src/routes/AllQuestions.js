import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import {
    Modal,
    Badge,
    Row,
    Form,
    Button,
    Col,
    Image,
    Container,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Card from "react-bootstrap/Card";
import { useAuth } from "src/hooks";

const AllQuestions = () => {
    const { user, isAuthenticated } = useAuth();
    const { skill, category, subcategory } = useParams();
    const navigate = useNavigate();
    const [questionsList, setQuestionsList] = useState([]);
    const role = useRef("");
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const [showWarning, setShowWarning] = useState(false);
    const handleCloseWarning = () => setShowWarning(false);
    const handleShowWarning = () => setShowWarning(true);

    const getAllQuestions = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/questions/${skill}/${category}/${subcategory}`,
        }).then((res) => {
            setQuestionsList(res.data.data);
        });
    };

    const handleEdit = (editQuestion) => {
        // console.log('edited Question', editQuestion)
        navigate(
            `/editquestion/${skill}/${category}/${subcategory}/${editQuestion._id}`
        );
    };

    const handleDeleteWarning = (deleteQuestion) => {
        handleShowWarning();
        setQuestionToDelete(deleteQuestion);
    };

    const handleDelete = (deleteQuestion) => {
        // console.log('deleted Question', deleteQuestion);
        Axios({
            method: "POST",
            data: {
                skill: skill,
                category: category,
                subcategory: subcategory,
            },
            withCredentials: true,
            url: `/server/deletequestion/${deleteQuestion._id}`,
        }).then((res) => {
            var updatedQuestionsList = questionsList.filter(
                (question) => question._id !== deleteQuestion._id
            );
            setQuestionsList(updatedQuestionsList);
        });
    };

    useEffect(() => {
        if(isAuthenticated && user.role === "basic") {
            navigate(`/accessdenied`);
        }
        getAllQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>All Questions</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Container>
                <br />
                <h2 style={{ color: "#000" }} className="text-center">
                    <Badge pill bg="light">
                        Edit/Delete Questions
                    </Badge>
                </h2>

                <Row xs={1} md={2} className="g-4 mt-5">
                    {questionsList.map((question, i) => (
                        <Col key={i}>
                            <Card className="mb-4">
                                {/* <Card.Header as="h5">{question.question}</Card.Header> */}
                                <Card.Body>
                                    {/* <Card.Title>{category}</Card.Title> */}
                                    <Card.Text>{question.question}</Card.Text>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEdit(question)}>
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteWarning(question)
                                        }>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {questionToDelete != null && (
                        <Modal show={showWarning} onHide={handleCloseWarning}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Confirm Deleting {questionToDelete.question}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You sure, you want to delete?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setQuestionToDelete(null);
                                        handleCloseWarning();
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        handleDelete(questionToDelete);
                                        setQuestionToDelete(null);
                                        handleCloseWarning();
                                    }}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default AllQuestions;

///TODO: change hard coded value 5
