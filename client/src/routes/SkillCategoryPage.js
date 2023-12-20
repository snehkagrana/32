import React, { useRef, useState, useEffect } from "react";
import {useParams, useSearchParams} from "react-router-dom";
import Axios from 'src/api/axios'
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
import FingoWidgetContainer from "src/components/FingoWidgetContainer";
import { FingoScrollToTop } from "src/components/layouts/FingoHomeLayout";
import FingoModalLevelUp from "src/components/FingoModalLevelUp";
import { useAuth } from "src/hooks";
import ModalListReward from "src/components/reward/ModalListReward";
import ModalRewardDetail from "src/components/reward/ModalRewardDetail";
import { ModalFormReward } from "src/components/reward";
import { ModalVerifyAction } from "src/components/admin";
import ModalInfoEarnDiamond from "src/components/reward/ModalInfoEarnDiamond";
import ModalListMyReward from "src/components/reward/ModalListMyReward";

const SkillCategoryPage = () => {
    const { isAuthenticated, user } = useAuth()
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
        const newUser = searchParams.get("newUser");
        setTimeout(() => {
            navigate(
                `/skills/${skillName}/${categoryName}/${sub_category}/information/${0}${newUser ? "?newUser=true" : ""}`
            );
        }, 300);
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
            if(isAuthenticated && user) {
                getSkillBySkillName();
                role.current = user?.role;
                var tempCheckIsCompleted = [];
                user?.score && user.score.forEach((score) => {
                    if (
                        score.skill === skillName &&
                        score.category === categoryName
                    )
                        tempCheckIsCompleted = tempCheckIsCompleted.concat(
                            score.sub_category
                        );
                });
                checkIsCompleted.current = tempCheckIsCompleted;
            }
        }
    }, [searchParams, isAuthenticated, user, skillName, categoryName]);

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
                        <div className="col-md-8 order-md-1 order-2">
                            <Row className="justify-content-md-center">
                                <Col>
                                    <div className="sub_category_card_container">
                                        <div className="sub_category_card_header">
                                            <button className="back-arrow" onClick={handleClick}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M5.841 5.28a.75.75 0 0 0-1.06-1.06L1.53 7.47L1 8l.53.53l3.25 3.25a.75.75 0 0 0 1.061-1.06l-1.97-1.97H14.25a.75.75 0 0 0 0-1.5H3.871l1.97-1.97Z" clip-rule="evenodd"/></svg>
                                            </button>
                                            <h2 className="text-center">
                                                {skillName.split("_").join(" ")} {":"}{" "}
                                                {categoryName.split("_").join(" ")}
                                            </h2>
                                        </div>
                                        <Row className="sub_category_card_content_row">
                                            {subCategories.map((sub_category, i) => (
                                                <div className="sub_category_card_content_item" key={i}>
                                                    <div className="sub_category_card_item_container d-flex flex-column justify-center align-items-center">
                                                        <div className={`sub_category_chapter_icon_container ${checkIsCompleted.current.includes(
                                                                sub_category.sub_category
                                                            ) ? "complete": "incomplete"}`} onClick={() =>  handleSubCategorySelection(sub_category.sub_category)}>
                                                            <div className={`sub_category_chapter_icon-`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"/></svg>
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
                                            
                                            
                                                </div>
                                            ))}
                                        </Row>
                                        <FingoScrollToTop />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="col-md-4 order-1 mb-2">
                            <FingoWidgetContainer />
                        </div>
                    </div>
                </Container>
            </div>
            <ModalFormReward />
            <FingoModalLevelUp />
            <ModalListReward />
            <ModalRewardDetail />
            <ModalVerifyAction />
            <ModalInfoEarnDiamond />
            <ModalListMyReward />
        </FingoHomeLayout>
    );
};

export default SkillCategoryPage;

/**
 * var checkIsCompleted = response.data.user.score.filter(function (score){
					return (score.skill === skillName && score.category === category && score.sub_category === subcategory);
				})
 */