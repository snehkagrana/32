import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const EditInformation = (props) => {
    const { user, isAuthenticated } = useAuth();
    const { skill, category, subcategory, id } = useParams();
    const [information, setInformation] = useState("");
    const [heading, setHeading] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [file, setFile] = useState("");

    const role = useRef("");

    const navigate = useNavigate();

    const setimgfile = (e) => {
        setFile(e.target.files[0]);
    };

    const getInformation = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/informationById/${id}`,
        }).then((res) => {
            // console.log('info rec',res.data.data);
            setInformation(res.data.data.information);
            setHeading(res.data.data.heading);
            if (res.data.url !== undefined) {
                // console.log('url',res.data.url);
                setImageURL(res.data.url);
            }
        });
    };

    const submit = () => {
        var formData = new FormData();
        if (file != "") formData.append("photo", file);
        formData.append("heading", heading);
        formData.append("information", information);

        Axios({
            method: "POST",
            data: formData,
            withCredentials: true,
            url: `/server/editinformation/${id}`,
        }).then(function (response) {
            console.log("Success");
            window.location.reload();
        });
    };

    useEffect(() => {
        if(isAuthenticated && user.role === "basic") {
            navigate(`/accessdenied`);
        }
        getInformation();
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>Edit Information</title>
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
                            <h1>Edit Information</h1>
                            <Form.Group>
                                <Form.Label>Edit Heading</Form.Label>
                                <Form.Control
                                    type="string"
                                    defaultValue={heading}
                                    onChange={(e) => setHeading(e.target.value)}
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
                                />
                            </Form.Group>
                            <br></br>

                            {
                                <Form.Group>
                                    <Form.Label>Edit Information</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        defaultValue={information}
                                        onChange={(e) =>
                                            setInformation(e.target.value)
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

export default EditInformation;
