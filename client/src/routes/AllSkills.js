import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from 'src/api/axios'
import {
    Modal,
    Container,
    Badge,
    Card,
    Button,
    Row,
    Col,
    Image,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const AllSkills = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const role = useRef("");
    const [skills, setSkills] = useState([]);
    const [skillToDelete, setSkillToDelete] = useState(null);

    const [showWarning, setShowWarning] = useState(false);
    const handleCloseWarning = () => setShowWarning(false);
    const handleShowWarning = () => setShowWarning(true);

    const handleSelect = (selectSkill) => {
        navigate(`/allcategories/${selectSkill.skill}`);
    };

    const handleEdit = (editSkill) => {
        navigate(`/editskill/${editSkill.skill}/`);
    };

    const handleDeleteWarning = (deleteSkill) => {
        handleShowWarning();
        setSkillToDelete(deleteSkill);
    };

    const handleDelete = (deleteSkill) => {
        Axios({
            method: "POST",
            withCredentials: true,
            url: `/server/deleteskill/${deleteSkill.skill}`,
        }).then((res) => {
            var updatedSkills = skills.filter(
                (skillElement) => skillElement.skill !== deleteSkill.skill
            );
            setSkills(updatedSkills);
        });
    };

    const editOrdering = (editedSkill, index) => {
        Axios({
            method: "POST",
            data: {
                skill: editedSkill,
                order: index,
            },
            withCredentials: true,
            url: `/server/editskillordering/${editedSkill}/`,
        }).then(function (response) {
            // console.log('Success');
        });
    };

    const handleMovingUp = (index) => {
        if (index) {
            editOrdering(skills[index].skill, index);
            editOrdering(skills[index - 1].skill, index + 1);
        } else {
            var len = skills.length;
            editOrdering(skills[index].skill, len);
            editOrdering(skills[len - 1].skill, index + 1);
        }
        window.location.reload();
    };

    const handleMovingDown = (index) => {
        var len = skills.length;
        if (index !== len - 1) {
            editOrdering(skills[index].skill, index + 2);
            editOrdering(skills[index + 1].skill, index + 1);
        } else {
            editOrdering(skills[index].skill, 1);
            editOrdering(skills[0].skill, len);
        }
        window.location.reload();
    };

    const getAllSkills = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/skills",
        }).then((res) => {
            setSkills(res.data.data);
        });
    };

    useEffect(() => {
        if(isAuthenticated) {
            if (user.role === "basic") {
                navigate(`/accessdenied`);
            }
        } else {
            navigate(`/accessdenied`);
        }
        getAllSkills();
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>All Skills</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Container>
                <br />
                <h2 style={{ color: "#000" }} className="text-center">
                    <Badge pill bg="light">
                        Edit/Delete Skill
                    </Badge>
                </h2>

                <Row xs={1} md={2} className="g-4 mt-5">
                    {skills.map((skill, i) => (
                        <Col key={i}>
                            <Card className="mb-4">
                                <Card.Header as="h5">
                                    {skill.skill.split("_").join(" ")}
                                </Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>{category}</Card.Title> */}
                                    {/* <Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text> */}
                                    <Button onClick={() => handleSelect(skill)}>
                                        Select
                                    </Button>{" "}
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEdit(skill)}>
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteWarning(skill)
                                        }>
                                        Delete
                                    </Button>{" "}
                                    <Button
                                        variant="light"
                                        onClick={() => handleMovingUp(i)}>
                                        Move Up
                                    </Button>{" "}
                                    <Button
                                        variant="dark"
                                        onClick={() => handleMovingDown(i)}>
                                        Move Down
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <br></br>
            </Container>
        </>
    );
};

export default AllSkills;
