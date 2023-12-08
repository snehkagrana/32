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

    function scrollToTop(e) {
        if(rootElement?.current) {
            rootElement.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }

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
                    
                    <br />

                    <Row className="justify-content-md-center">
                        <Col xs={12} md={10} lg={5}>
                            <div className="sub_category_card_container">
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8.587 8.236l2.598-5.232a.911.911 0 0 1 1.63 0l2.598 5.232l5.808.844a.902.902 0 0 1 .503 1.542l-4.202 4.07l.992 5.75c.127.738-.653 1.3-1.32.952L12 18.678l-5.195 2.716c-.666.349-1.446-.214-1.319-.953l.992-5.75l-4.202-4.07a.902.902 0 0 1 .503-1.54l5.808-.845Z"/></svg>
                                                    </div>
                                                    <div className="sub_category_chapter_ic_circle" />
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

                                { subCategories.length > 0 && (
                                    <button onClick={scrollToTop} className="sub_category_back_to_top_btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122L13.06 3.283Z"/></g></svg>
                                    </button>
                                )}

                            </div>
                        </Col>
                    </Row>


                    <br></br>
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