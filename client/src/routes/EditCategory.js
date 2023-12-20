import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'src/api/axios'
import { Link, useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import { useAuth } from "src/hooks";

const EditCategory = (props) => {
    const { user, isAuthenticated } = useAuth();
    const { skill, category } = useParams();
    const [editedCategory, setEditedCategory] = useState(category);
    const role = useRef("");

    const navigate = useNavigate();

    const submit = () => {
        Axios({
            method: "POST",
            data: {
                newCategory: editedCategory,
            },
            withCredentials: true,
            url: `/server/editcategory/${skill}/${category}`,
        }).then(function (response) {
            console.log("Success");
            navigate(`/allcategories/${skill}`);
        });
    };

    useEffect(() => {
        if(isAuthenticated && user.role === "basic") {
            navigate(`/accessdenied`);
        }
    }, [user, isAuthenticated]);

    return (
        <>
            <Helmet>
                <title>Edit Category</title>
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
                            <h1>Edit Category</h1>
                            <Form.Group>
                                <Form.Label>Edit</Form.Label>
                                <Form.Control
                                    type="string"
                                    defaultValue={category.split("_").join(" ")}
                                    onChange={(e) =>
                                        setEditedCategory(e.target.value)
                                    }
                                />
                            </Form.Group>
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

export default EditCategory;
