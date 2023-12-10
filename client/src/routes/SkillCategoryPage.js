import React, { useRef, useState, useEffect } from "react";
import {useParams, useSearchParams} from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Badge,
    Card,
    Button,
    Container,
    Row,
    Col,
    Image,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import  "../index.css";
import '../styles/SkillCategoryPage.styles.css'
import { FingoHomeLayout } from "src/components/layouts";
import CompleteIcon from 'src/assets/images/complete.png'
import UncompleteIcon from 'src/assets/images/uncomplete.png'
import FingoWidgetContainer from "src/components/FingoWidgetContainer";
import { FingoScrollToTop } from "src/components/layouts/FingoHomeLayout";

const SkillCategoryPage = () => {
    const { skillName } = useParams();
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const role = useRef("");
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const checkIsCompleted = useRef([]);
    const rootElement = useRef(null)

    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        navigate('/home');  
    };

    const getSkillBySkillName = (isNewUser) => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/skills/${skillName}`,
            params: {
                newUser: isNewUser,
            },
        }).then((res) => {
            // console.log("skill name", skillName);
            // console.log("skill is ", res.data.data[0]);
            // categories.current = res.data.data[0].categories;
            // console.log("categories - ", categories.current);
            setCategories(res.data.data[0].categories);
            var subCategoriesList = res.data.data[0].sub_categories.filter(
                function (el) {
                    return el.category === categoryName;
                }
            );
            // console.log('filtered sub categories', subCategoriesList);
            setSubCategories(subCategoriesList);
        });
    };

    const handleSubCategorySelection = (sub_category) => {
        // console.log("handleSubCategorySelection",sub_category);
        const newUser = searchParams.get("newUser");
        navigate(
            `/skills/${skillName}/${categoryName}/${sub_category}/information/${0}${newUser ? "?newUser=true" : ""}`
        );
    };

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        // console.log("in use effect");
        const newUser = searchParams.get("newUser");
        if (newUser === "true") {
            getSkillBySkillName(newUser);
            var tempCheckIsCompleted = [];

            // Retrieve scores from localStorage instead of the response object
            const storedScores = JSON.parse(sessionStorage.getItem('scores')) || [];

            // Loop through the scores from localStorage
            storedScores.forEach((score) => {
                if (
                    score.skill === skillName &&
                    score.category === categoryName
                )
                    tempCheckIsCompleted = tempCheckIsCompleted.concat(
                        score.sub_category
                    );
            });

            checkIsCompleted.current = tempCheckIsCompleted;
        } else {
            Axios({
                method: "GET",
                withCredentials: true,
                url: "/server/login",
            }).then(function (response) {
                if (response.data.redirect == "/login") {
                    // console.log("Please log in");
                    navigate(`/auth/login`);
                } else {
                    // console.log("Already logged in");
                    getSkillBySkillName();
                    role.current = response.data.user.role;
                    var tempCheckIsCompleted = [];
                    response.data.user.score.forEach((score) => {
                        if (
                            score.skill === skillName &&
                            score.category === categoryName
                        )
                            tempCheckIsCompleted = tempCheckIsCompleted.concat(
                                score.sub_category
                            );
                    });
                    checkIsCompleted.current = tempCheckIsCompleted;
                    // console.log('checkIsCompleted', checkIsCompleted.current);
                }
            });
        }
    }, [searchParams]);

    return (
        <FingoHomeLayout>
            <div className="sub_category_card_container_root" ref={rootElement}>
                <Helmet>
                    <title>
                        {skillName.split("_").join(" ")} {"->"}{" "}
                        {categoryName.split("_").join(" ")}
                    </title>
                </Helmet>
                <Container>
                    <div className="row h-auto">
                        <div className="col-lg-7 order-md-1 order-2">
                            <Row className="justify-content-md-center">
                                <Col>
                                    <div className="sub_category_card_container">
                                        <FingoScrollToTop />
                                        <button className="back-arrow" onClick={handleClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M5.841 5.28a.75.75 0 0 0-1.06-1.06L1.53 7.47L1 8l.53.53l3.25 3.25a.75.75 0 0 0 1.061-1.06l-1.97-1.97H14.25a.75.75 0 0 0 0-1.5H3.871l1.97-1.97Z" clip-rule="evenodd"/></svg>
                                        </button>
                                        <h2 className="text-center" style={{ color: "#000" }}>
                                            <Badge pill bg="light">
                                                {skillName.split("_").join(" ")} {":"}{" "}
                                                {categoryName.split("_").join(" ")}
                                            </Badge>
                                        </h2>
                                        <Row
                                            xs={1}
                                            className="g-4 mt-5"
                                            style={{
                                                width: "60%",
                                                marginLeft: "20%",
                                                borderRadius: "15px",
                                            }}>
                                            {subCategories.map((sub_category, i) => (
                                                <Col key={i}>
                                                    <div className="sub_category_card_item_container d-flex flex-column justify-center align-items-center">
                                                        <div className="sub_category_chapter_icon_container" onClick={() =>  handleSubCategorySelection(sub_category.sub_category)}>
                                                            <div className={`sub_category_chapter_icon-${checkIsCompleted.current.includes(
                                                                sub_category.sub_category
                                                            ) ? "complete": "incomplete"}`}>
                                                                <img src={checkIsCompleted.current.includes(
                                                                    sub_category.sub_category
                                                                ) ? CompleteIcon : UncompleteIcon} alt="icon" />
                                                            </div>
                                                            {/* <div className="sub_category_chapter_ic_circle" /> */}
                                                        </div>
                                                        <h3>{sub_category.sub_category.split("_").join(" ")}{" "}</h3>
                                                    </div>

                                                

                                                            {/* <Card.Title>{category}</Card.Title> */}
                                                            {/* <Card.Text>
                                            With supporting text below as a natural lead-in to additional content.
                                            </Card.Text> */}
                                                            {/* <Button
                                                                variant="success"
                                                                onClick={() =>
                                                                    handleSubCategorySelection(
                                                                        sub_category.sub_category
                                                                    )
                                                                }
                                                                style={{
                                                                    boxShadow: "0px 7px #1a5928",
                                                                }}
                                                                disabled={searchParams.get("newUser") === 'true' && i > 4}
                                                            >
                                                                Let's Go
                                                            </Button> */}
                                            
                                            
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="col-lg-5 order-1 mb-2">
                            <FingoWidgetContainer />
                        </div>
                    </div>
                </Container>
            </div>
        </FingoHomeLayout>
    );
};

export default SkillCategoryPage;

/**
 * var checkIsCompleted = response.data.user.score.filter(function (score){
					return (score.skill === skillName && score.category === category && score.sub_category === subcategory);
				})
 */