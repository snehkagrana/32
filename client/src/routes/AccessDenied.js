import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";

const AccessDenied = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/login",
        }).then(function (response) {
            if (response.data.redirect == "/login") {
                // console.log("Please log in");
                navigate(`/auth/login`);
            }
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>AccessDenied</title>
            </Helmet>
            <Navbar proprole={"basic"} />
            <div className="access-senied text-center">
                <br />
                <h2>Oops! Access Denied.</h2>
                {/* <div >
                <img src="https://www.maketecheasier.com/assets/uploads/2015/12/Creative-404-mte-01-Jonathan-Patterson.jpg" alt="404" />
            </div>
            <h4>We can't find the page you are looking for.</h4> */}
            </div>
        </>
    );
};

export default AccessDenied;
