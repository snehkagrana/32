import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Card, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Confetti from "react-dom-confetti";
import { Howl } from "howler";
import Sound from '../sounds/success-1.mp3';

const ScorePage = () => {
  const { skillName, category, subcategory } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [skillDetails, setSkillDetails] = useState({});
  const role = useRef("");
  const allSubCategories = useRef([]);
  const totalSubCategories = useRef(-1);
  const subCategoryIndex = useRef(-1);

  const data = location.state?.data;

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
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const sound = new Howl({
    src: [Sound], // Replace with the path to your sound file
  });

  useEffect(() => {
    // Log to check if the sound file is loaded
    console.log('Sound loaded:', sound.state());
  
    // Ensure that the sound is loaded before playing
    sound.once('load', () => {
      console.log('Sound loaded:', sound.state());
  
      if (celebrate) {
        // Play the sound when celebrate state changes to true
        sound.play();
      }
    });
  
    // Load the sound
    sound.load();
  
    // Clean up the Howler.js sound object when the component is unmounted
    return () => {
      sound.unload();
    };
  }, [celebrate]);
  

  const getSkillBySkillName = (isNewUser) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `/server/skills/${skillName}`,
      params: {
        newUser: isNewUser,
      },
    }).then((res) => {
      setSkillDetails(res.data.data[0]);
      allSubCategories.current = res.data.data[0].sub_categories.filter(
        function (sub_category) {
          return sub_category.category === category;
        }
      );
      totalSubCategories.current = allSubCategories.current.length;
      for (var i = 0; i < totalSubCategories.current; i++) {
        if (allSubCategories.current[i].sub_category === subcategory) {
          subCategoryIndex.current = i;
          break;
        }
      }
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

  useEffect(() => {
    const newUser = searchParams.get("newUser");
    if (newUser === "true") {
      const storedScores =
        JSON.parse(sessionStorage.getItem("scores")) || [];

      const matchingScores = storedScores.filter(
        (scoreItem) =>
          scoreItem.skill === skillName && scoreItem.category === category
      );

      if (matchingScores.length >= 5) {
        const score = matchingScores.reduce(
          (acc, item) => acc + item.score,
          0
        );
        const points = matchingScores.reduce(
          (acc, item) => acc + item.points,
          0
        );

        setNewUserLimit(true);
      } else {
        setCelebrate(true);
        getSkillBySkillName(newUser);
        getAllScores(newUser);

        const storedXp = sessionStorage.getItem("xp");
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
          navigate(`/auth/login`);
        } else {
          setCelebrate(true);
          getSkillBySkillName();
          getAllScores();
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
      <Navbar proprole={role} newUser={!!searchParams.get("newUser")} />
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
            }}
          >
            {newUserLimit ? (
              <>
                <Card.Header className="congratulation-card-header">
                  If you want to continue please Register
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link to="/auth/register">
                      <Button variant="success">Register</Button>
                    </Link>
                  </div>
                </Card.Body>
              </>
            ) : (
              <>
                <Card.Header className="congratulation-card-header">
                  Congratulations! You earned:
                </Card.Header>
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
                    }}
                  >
                    {subCategoryIndex.current + 1 <
                      totalSubCategories.current && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => {
                            const newUserQueryParam = searchParams.get(
                              "newUser"
                            )
                              ? "?newUser=true"
                              : "";
                            navigate(
                              `/skills/${skillName}/${category}/${
                                allSubCategories.current[
                                  subCategoryIndex.current + 1
                                ].sub_category
                              }/information/${0}${newUserQueryParam}`
                            );
                          }}
                        >
                          Next: Start with{" "}
                          {allSubCategories.current[
                            subCategoryIndex.current + 1
                          ].sub_category.split("_").join(" ")}
                        </Button>{" "}
                      </>
                    )}
                    {subCategoryIndex.current + 1 ===
                      totalSubCategories.current && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => {
                            navigate(`/skills/${skillName}/${category}`);
                          }}
                        >
                          Go Back!!
                        </Button>{" "}
                      </>
                    )}
                  </div>
                </Card.Body>
              </>
            )}
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

