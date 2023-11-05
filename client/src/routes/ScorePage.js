import React, { useRef, useState, useEffect } from "react";
import {useParams, useLocation, useSearchParams} from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Card, Button, Col, Image } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Confetti from "react-dom-confetti";

const ScorePage = (props) => {
    const { skillName, category, subcategory } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [skillDetails, setSkillDetails] = useState({});
    const role = useRef("");
    const allSubCategories = useRef([]);
    const totalSubCategories = useRef(-1);
    const subCategoryIndex = useRef(-1);

    // console.log('location', location);
    const data = location.state?.data;
    // console.log('data', data);
    // console.log('data score', data.score.current);
    // console.log('data points', data.points.current);

    var total_score = 0;
    const [points, setPoints] = useState(0);

    const [xp, setXP] = useState(0);
    const [celebrate, setCelebrate] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [newUserLimit, setNewUserLimit] = useState(false);

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 30,
        elementCount: 100,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
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
            // console.log("skill is ", res.data.data);
            setSkillDetails(res.data.data[0]);
            allSubCategories.current = res.data.data[0].sub_categories.filter(
                function (sub_category) {
                    return sub_category.category === category;
                }
            );
            // console.log('allSubCategories', allSubCategories.current);
            totalSubCategories.current = allSubCategories.current.length;
            for (var i = 0; i < totalSubCategories.current; i++) {
                // console.log('allSubCategories.current[i].sub_category', allSubCategories.current[i].sub_category);
                // console.log('subcategory', subcategory);
                // console.log('(allSubCategories.current[i].sub_category === subcategory)', (allSubCategories.current[i].sub_category === subcategory));
                if (allSubCategories.current[i].sub_category === subcategory) {
                    subCategoryIndex.current = i;
                    break;
                }
            }
            // console.log('totalSubCategories', totalSubCategories.current);
            // console.log('subCategoryIndex', subCategoryIndex.current);
        });
    };

    const getAllScores = (isNewUser) => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `/server/allscores`,
            params: {
                newUser: isNewUser,
            },
        }).then((res) => {
            // console.log("all scores ", res.data);
        });
    };

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        // console.log("in use effect");
        const newUser = searchParams.get("newUser");
        if (newUser === "true") {
            // Retrieve the scores array from localStorage and parse it
            const storedScores = JSON.parse(sessionStorage.getItem("scores")) || [];

            // Filter scores by skillName and category
            const matchingScores = storedScores.filter(scoreItem =>
                scoreItem.skill === skillName && scoreItem.category === category
            );

            // Check if there are 5 items with the same skillName and category
            if (matchingScores.length >= 5) {
                const score = matchingScores.reduce((acc, item) => acc + item.score, 0); // Sum of scores as an example
                const points = matchingScores.reduce((acc, item) => acc + item.points, 0); // Sum of points as an example

                setNewUserLimit(true);
            } else {
                setCelebrate(true);
                getSkillBySkillName(newUser);
                getAllScores(newUser);

                // Retrieve XP from localStorage, if present
                const storedXp = sessionStorage.getItem('xp');
                if (storedXp) {
                    setXP(parseInt(storedXp, 10));
                }
            }
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
                    setCelebrate(true);
                    getSkillBySkillName();
                    getAllScores();
                    setPoints(data.points.current);
                    setXP(response.data.user.xp.current);
                    role.current = response.data.user.role;
                }
            });
        }
    }, [searchParams]);

    return (
        <>
            <Helmet>
                <title>Score page</title>
            </Helmet>
            <Navbar proprole={role} newUser={!!searchParams.get("newUser")}/>
            <div>
                <h2 className="text-center">
                    <Badge pill bg="light">
                        {skillName.split("_").join(" ")} {"->"}{" "}
                        {category.split("_").join(" ")} {"->"}{" "}
                        {subcategory.split("_").join(" ")}
                    </Badge>
                </h2>
                <br></br>
                {data ? (
                    <Card
                        className="d-flex flex-column congratulation-card"
                        style={{
                            width: "80%",
                            margin: "0 auto",
                            borderRadius: "15px",
                        }}>
                        {
                            newUserLimit ? (
                                <>
                                    <Card.Header className="congratulation-card-header">If you want to continue please Register</Card.Header>
                                    <Card.Body>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <Link to="/auth/register">
                                                <Button
                                                    variant="success"
                                                >
                                                    Register
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </>
                            ) : (
                                <>
                                    <Card.Header className="congratulation-card-header">Congratulations! You earned:</Card.Header>
                                    <Card.Body>
                                        <div className="confetti-container">
                                            <Confetti active={celebrate} config={confettiConfig} />
                                        </div>
                                        <div className="card-circle-xp">
                                            <Card.Text className="text-center">{xp} XP</Card.Text>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            {subCategoryIndex.current + 1 <
                                                totalSubCategories.current && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            onClick={() => {
                                                                const newUserQueryParam = searchParams.get('newUser') ? '?newUser=true' : '';
                                                                navigate(
                                                                    `/skills/${skillName}/${category}/${
                                                                        allSubCategories
                                                                            .current[
                                                                        subCategoryIndex.current +
                                                                        1
                                                                            ].sub_category
                                                                    }/information/${0}${newUserQueryParam}`
                                                                );
                                                            }}>
                                                            Next: Start with{" "}
                                                            {allSubCategories.current[
                                                            subCategoryIndex.current + 1
                                                                ].sub_category
                                                                .split("_")
                                                                .join(" ")}
                                                        </Button>{" "}
                                                    </>
                                                )}
                                            {subCategoryIndex.current + 1 ===
                                                totalSubCategories.current && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            onClick={() => {
                                                                navigate(
                                                                    `/skills/${skillName}/${category}`
                                                                );
                                                            }}>
                                                            Go Back!!
                                                        </Button>{" "}
                                                    </>
                                                )}
                                        </div>
                                    </Card.Body>
                                </>
                            )
                        }
                    </Card>
                ) : (
                    "Loading"
                )}
                <br />
                <br />
            </div>
        </>
    );
};

export default ScorePage;
