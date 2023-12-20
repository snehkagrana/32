import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'src/api/axios'
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
import { useAuth } from "src/hooks";

const AllCategories = () => {
    const { user } = useAuth()
    const { skill } = useParams();
    const navigate = useNavigate();
    const role = useRef("");
    const [categories, setCategories] = useState([]);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [showWarning, setShowWarning] = useState(false);
    const handleCloseWarning = () => setShowWarning(false);
    const handleShowWarning = () => setShowWarning(true);

    const handleSelect = (selectCategory) => {
        navigate(`/allsubcategories/${skill}/${selectCategory}`);
        // console.log('selected category', selectCategory)
    };

    const handleEdit = (editCategory) => {
        // console.log('edited category', editCategory);
        navigate(`/editcategory/${skill}/${editCategory}`);
    };

    const handleDeleteWarning = (deleteCategory) => {
        handleShowWarning();
        setCategoryToDelete(deleteCategory);
    };

    const handleDelete = (deleteCategory) => {
        // console.log('deleted category', deleteCategory);
        Axios({
            method: "POST",
            withCredentials: true,
            url: `/server/deletecategory/${skill}/${deleteCategory}`,
        }).then((res) => {
            var updatedCategories = categories.filter(
                (categoryElement) => categoryElement !== deleteCategory
            );
            setCategories(updatedCategories);
        });
    };

    const handleMovingUp = (index) => {
        // console.log('moving up categories', categories);
        var updatedCategories = categories;
        if (index) {
            var tempCategory = categories[index];
            updatedCategories[index] = categories[index - 1];
            updatedCategories[index - 1] = tempCategory;
        } else {
            var tempCategory = categories[index];
            var len = categories.length;
            updatedCategories[index] = categories[len - 1];
            updatedCategories[len - 1] = tempCategory;
        }
        // console.log('moving up categories', categories);
        Axios({
            method: "POST",
            data: {
                categories: updatedCategories,
            },
            withCredentials: true,
            url: `/server/editcategoryordering/${skill}`,
        }).then(() => {
            setCategories(updatedCategories);
            // console.log('changed');
            window.location.reload();
        });
    };

    const handleMovingDown = (index) => {
        var updatedCategories = categories;
        var len = categories.length;
        if (index != len - 1) {
            var tempCategory = categories[index];
            updatedCategories[index] = categories[index + 1];
            updatedCategories[index + 1] = tempCategory;
        } else {
            var tempCategory = categories[index];
            updatedCategories[index] = categories[0];
            updatedCategories[0] = tempCategory;
        }
        Axios({
            method: "POST",
            data: {
                categories: updatedCategories,
            },
            withCredentials: true,
            url: `/server/editcategoryordering/${skill}`,
        }).then(() => {
            setCategories(updatedCategories);
            // console.log('changed');
            window.location.reload();
        });
    };

    const getAllCategories = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/categories/${skill}`,
        }).then((res) => {
            setCategories(res.data.data);
        });
    };

    useEffect(() => {
        // console.log("in use effect");
        if (user.role === "basic") {
            navigate(`/accessdenied`);
        }
        getAllCategories();
    }, [user]);

    return (
        <>
            <Helmet>
                <title>{skill} Categories</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Container>
                <br />
                <h2 style={{ color: "#000" }} className="text-center">
                    <Badge pill bg="light">
                        Edit/Delete Category
                    </Badge>
                </h2>

                <Row xs={1} md={2} className="g-4 mt-5">
                    {categories.map((category, i) => (
                        <Col key={i}>
                            <Card className="mb-4">
                                <Card.Header as="h5">
                                    {category.split("_").join(" ")}
                                </Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>{category}</Card.Title> */}
                                    {/* <Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text> */}
                                    <Button
                                        onClick={() => handleSelect(category)}>
                                        Select
                                    </Button>{" "}
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEdit(category)}>
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteWarning(category)
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
                    {categoryToDelete != null && (
                        <Modal show={showWarning} onHide={handleCloseWarning}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Confirm Deleting{" "}
                                    {categoryToDelete.split("_").join(" ")}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You sure, you want to delete?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setCategoryToDelete(null);
                                        handleCloseWarning();
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        handleDelete(categoryToDelete);
                                        setCategoryToDelete(null);
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

export default AllCategories;
