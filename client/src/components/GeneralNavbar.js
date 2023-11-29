import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
//import logo from "../images/logo.jpeg";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"
import logo from "../images/fingo-logo.png";

const GeneralNavbar = ({ proprole }) => {
    const [showBasic, setShowBasic] = useState(false);

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // You can store the dark mode preference in local storage or a state management system like Redux
    };

    const navigate = useNavigate();

    return (
        <div className="glassBackground">
            <MDBNavbar expand="lg" dark className="glassNavbar" style={{ maxWidth: '80%', height: '60px', margin: '15px auto', display: 'flex', alignItems: 'center' }}>
                <MDBContainer fluid>
                    <MDBContainer onClick={() => navigate(`/`)} fluid style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={logo}
                            alt="Fingo Logo"
                            style={{ height: "50px", cursor: "" }}  // Adjust the height according to your preference
                        // className="zoomImage"
                        />
                    </MDBContainer>
                </MDBContainer>
            </MDBNavbar>
        </div>
    );


};
export default GeneralNavbar;