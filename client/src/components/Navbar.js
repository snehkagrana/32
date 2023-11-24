import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBCollapse,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import logo from "../images/logo.jpeg";
import DarkMode from "./DarkMode";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const Navbar = ({ proprole, newUser = false }) => {
    const [showBasic, setShowBasic] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const skills = useRef([]);
    const [filteredQueries, setFilteredQueries] = useState([]);
    const [role, setRole] = useState("");

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // You can store the dark mode preference in local storage or a state management system like Redux
    };

    const handleLogOut = () => {
        // console.log('logging Out!!');
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/logout",
        }).then((res) => {
            // console.log("Redirect back to Home");
            navigate(`/`);
        });
    };

    const onChangeSearchValue = (event) => {
        setSearchValue(event.target.value);
        var tempFilteredQueries = [];

        skills.current.forEach((skill) => {
            const searchTerm = event.target.value.toLowerCase();
            const skillName = skill.skill.toLowerCase();

            if (searchTerm && skillName.includes(searchTerm)) {
                tempFilteredQueries.push({
                    type: "skill",
                    skill: skill.skill,
                    name: skill.skill,
                });
            }

            // console.log('categories', skill.categories);
            // (skill.categories).forEach((category) => {
            //   if(searchTerm && category.includes(searchTerm)){
            //     tempFilteredQueries.push(category);
            //   }
            // })

            for (var i = 0; i < skill.categories.length; i++) {
                var category = skill.categories[i];
                if (searchTerm && category.toLowerCase().includes(searchTerm)) {
                    tempFilteredQueries.push({
                        type: "category",
                        skill: skill.skill,
                        category: category,
                        name: category,
                    });
                }
            }

            skill.sub_categories.forEach((subCategory) => {
                const subCategoryName = subCategory.sub_category;
                if (
                    searchTerm &&
                    subCategoryName.toLowerCase().includes(searchTerm)
                ) {
                    tempFilteredQueries.push({
                        type: "subcategory",
                        skill: skill.skill,
                        category: subCategory.category,
                        sub_category: subCategoryName,
                        name: subCategoryName,
                    });
                }
            });
        });

        setFilteredQueries(tempFilteredQueries.slice(0, 10));
        // console.log('tempFilteredQueries', tempFilteredQueries);
    };

    const onSearch = (searchTerm) => {
        setSearchValue(searchTerm);
        // our api to fetch the search result
        // console.log("search ", searchTerm);
        if (searchTerm.type === "skill")
            navigate(`/skills/${searchTerm.skill}`);
        else if (searchTerm.type === "category")
            navigate(`/skills/${searchTerm.skill}/${searchTerm.category}`);
        else
            navigate(
                `/skills/${searchTerm.skill}/${searchTerm.category}/${searchTerm.sub_category}/information/0`
            );
        window.location.reload();
    };

    useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "/server/skills",
            params: {
                newUser: newUser,
            },
        }).then((res) => {
            // console.log('skills = ', res.data.data);
            skills.current = res.data.data;
            setRole(proprole.current);
        });
    }, [newUser]);

    return (
        <MDBNavbar expand="lg" dark style={{ backgroundColor: "#28a745" }}>
            <MDBContainer
                fluid
                bg={darkMode ? "dark" : "light"}
                variant={darkMode ? "dark" : "light"}>
                <MDBNavbarBrand onClick={() => navigate(`/home`)}>
                    <span className = "zoomText" style={{ cursor: 'pointer',fontWeight: "bold" }}>fingo</span>
                </MDBNavbarBrand>

                <MDBNavbarToggler
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => setShowBasic(!showBasic)}>
                    <MDBIcon icon="bars" fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showBasic}>
                    <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                        <MDBNavbarItem>
                            <MDBNavbarLink
                                onClick={() => navigate("/home")}
                                style={{
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                    cursor: "pointer",
                                }}>
                                Home
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        {/*<MDBNavbarItem>
                            <MDBNavbarLink
                                onClick={() => navigate(`/profilepage`)}
                                style={{
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                    cursor: "pointer",
                                }}>
                                View Profile
                            </MDBNavbarLink>
                            </MDBNavbarItem>*/}
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    onClick={newUser ? () => navigate("/auth/login") : handleLogOut}
                                    style={{
                                    fontWeight: "bold",
                                    color: "#28a745", // Set the text color to black
                                    cursor: "pointer",
                                    backgroundColor: "#fff", // Set the background color to white
                                    borderRadius: "7px", // Adjust the border-radius as needed
                                    padding: "7px 13px", // Add padding to control the button size
                                    display: "inline-block",
                                    marginRight: "10px",
                                    marginBottom: "3px"
                                    
                                    }}
                                >
                                    {newUser ? "Login" : "Logout"}
                                </MDBNavbarLink>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                {newUser ? (
                                    <MDBNavbarLink
                                    onClick={() => navigate("/auth/register")}
                                    style={{
                                        fontWeight: "bold",
                                        color: "#28a745",
                                        cursor: "pointer",
                                        backgroundColor: "#fff",
                                        borderRadius: "7px",
                                        padding: "7px 13px",
                                        display: "inline-block",
                                        
                                        
                                    }}
                                    >
                                    Register
                                    </MDBNavbarLink>
                                ) : null}
                            </MDBNavbarItem>



                        {role === "admin" ? (
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    onClick={() => navigate(`/addchapters`)}
                                    style={{
                                        fontWeight: "bold",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                    }}>
                                    Add Chapters
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        ) : null}

                        {role === "admin" ? (
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    onClick={() => navigate(`/addinformation`)}
                                    style={{
                                        fontWeight: "bold",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                    }}>
                                    Add Information
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        ) : null}

                        {role === "admin" ? (
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    onClick={() => navigate(`/addquestions`)}
                                    style={{
                                        fontWeight: "bold",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                    }}>
                                    Add Questions
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        ) : null}

                        {role === "admin" ? (
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    onClick={() => navigate(`/allskills`)}
                                    style={{
                                        fontWeight: "bold",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                    }}>
                                    Edit/Delete
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        ) : null}
                    </MDBNavbarNav>

                    {/* <Button variant={darkMode ? 'light' : 'dark'} onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button> */}

                    <DarkMode />

                    {/* <div className="search-container">
          <form className='d-flex input-group w-auto'>
            <input type='search' value={searchValue} onChange={onChangeSearchValue} className='form-control mr-4' placeholder='Type query' aria-label='Search' />
            <MDBBtn color='primary' onClick={() => onSearch(searchValue)}>Search</MDBBtn>
            
            <Dropdown.Menu show={searchValue!=""}>
            {filteredQueries.map((item, i) => (						
            <Dropdown.Item key={i} onClick={() => onSearch(item)}>{item.name.split("_").join(" ")}</Dropdown.Item>
						))}
            </Dropdown.Menu>
          </form>
          </div> */}
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    );
};

export default Navbar;
