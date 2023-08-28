import React, { useRef, useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NotFound.css";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
////404 page of our website

const NotFound = () => {
    const role = useRef("");
    const navigate = useNavigate();

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
            } else {
                role.current = response.data.user.role;
            }
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>404 Not Found</title>
            </Helmet>
            <Navbar proprole={role} />
            <div className="not-found text-center">
                <h2>Oops! Page not found.</h2>
                <div>
                    <img
                        src="https://www.maketecheasier.com/assets/uploads/2015/12/Creative-404-mte-01-Jonathan-Patterson.jpg"
                        alt="404"
                    />
                </div>
                <h4>We can't find the page you are looking for.</h4>
                <Link to="/">
                    <button className="main-btn">Back to Homepage...</button>
                </Link>
            </div>
        </>
    );
};

export default NotFound;
