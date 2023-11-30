import React, { useState } from "react";
import flag from "../images/flag.png";
import { useNavigate } from "react-router-dom";
import "../DarkMode.css";
import '../globals.css'

const Footer = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState({ contact: false, terms: false, privacy: false });

    return (
        <div className="flex justify-between mt-10">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px", flexWrap: "wrap" }}>

                <span
                    className="dark-mode-link"
                    onMouseEnter={() => setHovered({ ...hovered, terms: true })}
                    onMouseLeave={() => setHovered({ ...hovered, terms: false })}
                    onClick={() => navigate(`/terms`)}
                    style={{ fontWeight: "bold", color: hovered.terms ? "blue" : "#000", cursor: "pointer", fontSize: "16px", margin: "0 10px", textDecoration: "none" }}
                >
                    Terms
                </span>
                <span
                    className="dark-mode-link"
                    onMouseEnter={() => setHovered({ ...hovered, privacy: true })}
                    onMouseLeave={() => setHovered({ ...hovered, privacy: false })}
                    onClick={() => navigate(`/privacypolicy`)}
                    style={{ fontWeight: "bold", color: hovered.privacy ? "blue" : "#000", cursor: "pointer", fontSize: "16px", margin: "0 10px", textDecoration: "none" }}
                >
                    Privacy
                </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <span className="font-bold" >Made with ❤️ in</span>
                <img src={flag} width={20} height={20} alt="flag" />
            </div>
        </div>
    );
};

export default Footer;

