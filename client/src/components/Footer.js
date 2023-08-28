import React, { useState } from "react";
import flag from "../images/flag.png";
import { useNavigate } from "react-router-dom";
import "../DarkMode.css";

const Footer = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState({contact: false, terms: false, privacy: false});

    return (
        <div style={{ padding: "30px", position: "relative", marginTop: "75px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px", flexWrap: "wrap" }}>
                <span
                    className="dark-mode-link" 
                    onMouseEnter={() => setHovered({...hovered, contact: true})}
                    onMouseLeave={() => setHovered({...hovered, contact: false})}
                    onClick={() => navigate(`/contactus`)} 
                    style={{ fontWeight: "normal", color: hovered.contact ? "blue" : "#000", cursor: "pointer", fontSize: "16px", margin: "0 10px", textDecoration: "none" }}
                >
                    Contact Us
                </span>
                <span 
                    className="dark-mode-link"
                    onMouseEnter={() => setHovered({...hovered, terms: true})}
                    onMouseLeave={() => setHovered({...hovered, terms: false})}
                    onClick={() => navigate(`/terms`)} 
                    style={{ fontWeight: "normal", color: hovered.terms ? "blue" : "#000", cursor: "pointer", fontSize: "16px", margin: "0 10px", textDecoration: "none" }}
                >
                    Terms
                </span>
                <span 
                    className="dark-mode-link"
                    onMouseEnter={() => setHovered({...hovered, privacy: true})}
                    onMouseLeave={() => setHovered({...hovered, privacy: false})}
                    onClick={() => navigate(`/privacypolicy`)} 
                    style={{ fontWeight: "normal", color: hovered.privacy ? "blue" : "#000", cursor: "pointer", fontSize: "16px", margin: "0 10px", textDecoration: "none" }}
                >
                    Privacy Policy
                </span>
            </div>
            <div style={{ width: "50%", margin: "0 auto", borderTop: "1px solid #000", marginBottom: "5px" }}></div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Made with ❤️ in <img src={flag} style={{ width: "30px" }} alt="flag" /></span>
            </div>
        </div>
    );
};

export default Footer;

