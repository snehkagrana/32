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

const AllInformation = () => {
    const { user } = useAuth();
    const { skill, category, subcategory } = useParams();
    const navigate = useNavigate();
    const [informationList, setInformationList] = useState([]);
    const [infoToDelete, setInfoToDelete] = useState(null);
    const role = useRef("");

    const [showWarning, setShowWarning] = useState(false);

    const handleCloseWarning = () => setShowWarning(false);
    const handleShowWarning = () => setShowWarning(true);

    const getAllInformation = () => {
        // console.log(skill, category, subcategory);
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/allinformation/${skill}/${category}/${subcategory}`,
        }).then((res) => {
            // console.log("information data are:", res.data.data);
            setInformationList(res.data.data);
        });
    };

    const handleEdit = (editInfo) => {
        // console.log('edited skill', editInfo);
        navigate(
            `/editinformation/${skill}/${category}/${subcategory}/${editInfo._id}`
        );
    };

    const handleDeleteWarning = (deleteInfo) => {
        handleShowWarning();
        setInfoToDelete(deleteInfo);
    };

    const handleDelete = (deleteInfo) => {
        // console.log('deleted info', deleteInfo);
        Axios({
            method: "POST",
            data: {
                skill: skill,
                category: category,
                subcategory: subcategory,
            },
            withCredentials: true,
            url: `/server/deleteinformation/${deleteInfo._id}`,
        }).then((res) => {
            var updatedInformationList = informationList.filter(
                (information) => information._id !== deleteInfo._id
            );
            setInformationList(updatedInformationList);
        });
    };

    useEffect(() => {
        getAllInformation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <>
            <Helmet>
                <title>All Information</title>
            </Helmet>
            <Navbar proprole={user?.role} />
            <Container>
                <br />
                <h2 style={{ color: "#000" }} className="text-center">
                    <Badge pill bg="light">
                        Edit/Delete Information
                    </Badge>
                </h2>

                <Row xs={1} md={2} className="g-4 mt-5">
                    {informationList.map((information, i) => (
                        <Col key={i}>
                            <Card className="mb-4">
                                <Card.Header as="h5">
                                    {information.heading}
                                </Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>{category}</Card.Title> */}
                                    <Card.Text>
                                        {/* {information.information} */}
                                    </Card.Text>
                                    <Button
                                        onClick={() => handleEdit(information)}>
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        onClick={() =>
                                            handleDeleteWarning(information)
                                        }>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {infoToDelete != null && (
                        <Modal show={showWarning} onHide={handleCloseWarning}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Confirm Deleting {infoToDelete.heading}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                You sure, you want to delete?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setInfoToDelete(null);
                                        handleCloseWarning();
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        handleDelete(infoToDelete);
                                        setInfoToDelete(null);
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

export default AllInformation;

///TODO: change hard coded value 5
