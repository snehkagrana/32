import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Modal,
    Badge,
    Card,
    Button,
    Col,
    Image,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";

const AllSubCategories = () => {
    const { skill, category } = useParams();
    const navigate = useNavigate();
    const role = useRef("");
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

    const [showWarning, setShowWarning] = useState(false);
    const handleCloseWarning = () => setShowWarning(false);
    const handleShowWarning = () => setShowWarning(true);

    const handleViewInformation = (selectSubCategory) => {
        navigate(
            `/allinformation/${skill}/${category}/${selectSubCategory.sub_category}`
        );
    };

    const handleViewQuestions = (selectSubCategory) => {
        navigate(
            `/allquestions/${skill}/${category}/${selectSubCategory.sub_category}`
        );
    };

    const handleEdit = (editSubCategory) => {
        // console.log('edited sub category', editSubCategory);
        navigate(
            `/editsubcategory/${skill}/${category}/${editSubCategory.sub_category}`
        );
    };

    const handleDeleteWarning = (deleteSubCategory) => {
        handleShowWarning();
        setSubCategoryToDelete(deleteSubCategory);
    };

    const handleDelete = (deleteSubCategory) => {
        // console.log('deleted sub category', deleteSubCategory);
        Axios({
            method: "POST",
            withCredentials: true,
            url: `/server/deletesubcategory/${skill}/${category}/${deleteSubCategory._id}`,
        }).then((res) => {
            var updatedSubCategories = subCategories.filter(
                (subcategory) =>
                    subcategory.sub_category !== deleteSubCategory.sub_category
            );
            setSubCategories(updatedSubCategories);
        });
    };

    const handleMovingUp = (index) => {
        // console.log('moving up sub categories', subCategories);
        var updatedSubCategories = subCategories;
        if (index) {
            var tempSubCategory = subCategories[index];
            updatedSubCategories[index] = subCategories[index - 1];
            updatedSubCategories[index - 1] = tempSubCategory;
        } else {
            var tempSubCategory = subCategories[index];
            var len = subCategories.length;
            updatedSubCategories[index] = subCategories[len - 1];
            updatedSubCategories[len - 1] = tempSubCategory;
        }
        // console.log('moving up sub categories', subCategories);
        Axios({
            method: "POST",
            data: {
                sub_categories: updatedSubCategories,
            },
            withCredentials: true,
            url: `/server/editsubcategoryordering/${skill}/${category}`,
        }).then(() => {
            setSubCategories(updatedSubCategories);
            // console.log('changed');
            window.location.reload();
        });
    };

    const handleMovingDown = (index) => {
        var updatedSubCategories = subCategories;
        var len = subCategories.length;
        if (index != len - 1) {
            var tempSubCategory = subCategories[index];
            updatedSubCategories[index] = subCategories[index + 1];
            updatedSubCategories[index + 1] = tempSubCategory;
        } else {
            var tempSubCategory = subCategories[index];
            updatedSubCategories[index] = subCategories[0];
            updatedSubCategories[0] = tempSubCategory;
        }
        Axios({
            method: "POST",
            data: {
                sub_categories: updatedSubCategories,
            },
            withCredentials: true,
            url: `/server/editsubcategoryordering/${skill}/${category}`,
        }).then(() => {
            setSubCategories(updatedSubCategories);
            // console.log('changed');
            window.location.reload();
        });
    };

    const getAllSubCategories = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/subcategories/${skill}/${category}`,
        }).then((res) => {
            // console.log('all sub categories', res.data.data);
            setSubCategories(res.data.data);
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
                // console.log("Already logged in");
                getAllSubCategories();
                role.current = response.data.user.role;
            }
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>
                    {skill} {category} SubCategories
                </title>
            </Helmet>
            <Navbar proprole={role} />
            <Container>
                <br />
                <h2 style={{ color: "#000" }} className="text-center">
                    <Badge pill bg="light">
                        Edit/Delete Sub Category
                    </Badge>
                </h2>

                <Row xs={1} md={1} className="g-4 mt-5">
                    {subCategories.map((subcategory, i) => (
                        <Col key={i}>
                            <Card className="mb-4">
                                <Card.Header as="h5">
                                    {subcategory.sub_category
                                        .split("_")
                                        .join(" ")}
                                </Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>{category}</Card.Title> */}
                                    {/* <Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text> */}
                                    <Button
                                        onClick={() =>
                                            handleViewQuestions(subcategory)
                                        }>
                                        View Questions
                                    </Button>{" "}
                                    <Button
                                        onClick={() =>
                                            handleViewInformation(subcategory)
                                        }>
                                        View Information
                                    </Button>{" "}
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEdit(subcategory)}>
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteWarning(subcategory)
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
                    {subCategoryToDelete != null && (
                        <Modal show={showWarning} onHide={handleCloseWarning}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Confirm Deleting{" "}
                                    {subCategoryToDelete.sub_category
                                        .split("_")
                                        .join(" ")}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You sure, you want to delete?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setSubCategoryToDelete(null);
                                        handleCloseWarning();
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        handleDelete(subCategoryToDelete);
                                        setSubCategoryToDelete(null);
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

export default AllSubCategories;
