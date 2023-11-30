import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Footer from "../components/Footer";
import '../App.css';
import '../index.css';
import '../startpage.css';
import '../globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    MDBContainer,
} from "mdb-react-ui-kit";
import Slider from "react-slick";
import fingoLogo from '../images/fingo-logo.png';
import fingoSectionTwo from '../images/fingo-landing-page-section-2.png';
import fingoSectionThree from '../images/fingo-landing-page-section-3.png';
import fingoSectionFiveOne from '../images/fingo-landing-page-5-1.png'
import fingoSectionFiveTwo from '../images/fingo-landing-page-5-2.png'
import fingoSectionFiveThree from '../images/fingo-landing-page-5-3.png'
import fingoSectionFiveFour from '../images/fingo-landing-page-5-4.png'
import fingoSectionFiveFive from '../images/fingo-landing-page-5-5.png'
import arrow from '../images/arrow.svg'
import arrow2 from '../images/arrow-2.svg'
import Reveal from "../components/Reveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion, useMotionValue, useScroll } from 'framer-motion';

const skills = [
    { skill: 'Investment', color: 'red' },
    { skill: 'Fixed Income', color: 'blue' },
    { skill: 'Economics', color: 'green' },
    { skill: 'Personal Finance', color: 'orange' },
    { skill: 'Trading', color: 'red' },
    { skill: 'Sector Analysis', color: 'cyan' },
    { skill: 'Cryptocurrency', color: 'yellow' },
    { skill: 'Insurance', color: 'orange' },
    { skill: 'Behavioral Finance', color: 'blue' },
];

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={className} style={{ ...style, right: '5px', zIndex: '1' }} onClick={onClick}>
            <FontAwesomeIcon
                icon={faArrowRight}
                style={{ fontSize: '24px', color: '#28a745' }}  // Set the color to green (#28a745)
            />
        </div>
    );
}

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={className} style={{ ...style, left: '5px', zIndex: '1' }} onClick={onClick}>
            <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ fontSize: '24px', color: '#28a745' }}  // Set the color to green (#28a745)
            />
        </div>
    );
}


const StartPage = () => {
    const navigate = useNavigate();
    const [currentWord, setCurrentWord] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const words = ['finance', 'investing', 'mutual funds', 'personal finance', 'economics', 'crypto', 'insurance'];
    const darkMode = localStorage.getItem("theme") === "dark";

    const CustomArrow = ({ className, onClick, icon }) => (
        <div className={className} onClick={onClick}>
            <FontAwesomeIcon icon={icon} style={{ fontSize: '24px', color: '#28a745' }} />
        </div>
    );

    const settings = {
        dots: true,
        autoplay: false,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        customPaging: function (i) {
            return <div style={{ display: 'none' }}></div>;
        },
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [{
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
            }
        }]
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prevWord) => {
                const currentWordToType = words[currentWordIndex];
                const targetLength = isTyping ? currentWordToType.length : 0;

                if (prevWord.length !== targetLength) {
                    const delta = isTyping ? 1 : -1;
                    return currentWordToType.substring(0, prevWord.length + delta);
                } else {
                    setIsTyping(!isTyping);

                    if (!isTyping) {
                        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                    }
                    return prevWord;
                }
            });
        }, 150);

        return () => clearInterval(interval);
    }, [currentWordIndex, isTyping]);

    const { scrollY } = useScroll()
    const height = useMotionValue(80)

    useEffect(() => {
        return scrollY.onChange((current) => {
            const previous = scrollY.getPrevious()
            const diff = current - previous
            const newHeight = height.get() - diff

            height.set(Math.min(Math.max(newHeight, 50), 80))
        })
    }, [height, scrollY])

    return (
        <div className={`flex justify-center px-3 dottedBackground ${darkMode ? 'dark-mode' : 'light-mode'} overflow-hidden`}>

            <div className="w-full max-w-7xl">
                <div className="md:pb-16 ">
                    <div
                        className={
                            'flex flex-1 overflow-hidden text-slate-600 '
                        }>
                        <div className='z-10 flex-1 '>
                            <motion.header
                                style={{ height }}
                                className='fixed inset-x-0 flex h-20 py-12 bg-white/30 backdrop-blur-lg'>
                                <div className='flex items-center justify-between w-full max-w-5xl px-8 mx-auto'>
                                    <MDBContainer onClick={() => navigate(`/`)} fluid >
                                        <img
                                            src={fingoLogo}
                                            alt="Fingo Logo"
                                            className="h-10 md:h-12"
                                        />
                                    </MDBContainer>
                                    <div className="flex justify-between w-full">
                                        <span className={`flex items-center justify-end lg:text-lg text-sm font-bold whitespace-nowrap flex-1 mr-4 ${darkMode ? 'text-gray-100' : 'text-gray-950'} cursor-pointer`} onClick={() => navigate(`/contactus`)}>Contact Us</span>
                                        <Button
                                            style={{

                                                backgroundColor: "#28a745",
                                                borderColor: "#28a745",
                                                margin: "0 auto",
                                                display: "block",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                boxShadow: "0px 7px #1a5928",
                                                transition: "0.2s ease",
                                                fontWeight: "800",
                                                marginBottom: "10px"
                                            }}
                                            className="text-sm sm:w-52 whitespace-nowrap md:w-48 getStarted "
                                            onClick={() => navigate("/home")}
                                        >
                                            Try Now!
                                        </Button>
                                    </div>
                                </div>
                            </motion.header>
                        </div>
                    </div>

                    <div className="pt-40 mx-auto lg:pt-64 lg:pb-28 ">
                        <Reveal motionType={'zoom'}>

                            <div className="flex items-center justify-center">
                                <h1 className={`scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-6xl ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>find learning finance boring?</h1>
                            </div>

                            <h1 className={`text-background-${darkMode ? 'dark' : 'light'} flex justify-center items-center scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl py-5`}>
                                <span className="font-bold text-[#2cb74c]">
                                    learn finance the fun way😎!!
                                </span>
                            </h1>
                        </Reveal>

                        <Reveal motionType={'zoom'}>
                            <div className="flex items-center justify-center max-w-md px-3 mx-auto space-x-3 py-8">
                                <div className="flex flex-col" style={{ width: '50%' }}>
                                    <h6
                                        className={`${darkMode ? 'text-gray-100' : 'text-gray-500'} text-center py-1`}
                                    >
                                        (No signup required.)
                                    </h6>
                                    <Button
                                        style={{
                                            padding: '10px',
                                            backgroundColor: "#28a745",
                                            borderColor: "#28a745",
                                            display: "block",
                                            borderRadius: "10px",
                                            boxShadow: "0px 7px #1a5928",
                                            transition: "0.2s ease",
                                            fontWeight: "800",
                                            marginBottom: "32px"
                                        }}
                                        className="getStarted"
                                        onClick={() => navigate("/home")}
                                    >
                                        Try Now!
                                    </Button>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <Button
                                        style={{
                                            padding: '10px',
                                            backgroundColor: "#FFFFFF",
                                            borderColor: "#808080",
                                            borderRadius: "10px",
                                            boxShadow: "0px 7px #818589",
                                            transition: "0.2s ease",
                                            fontWeight: "800",
                                            color: "#4285F4",
                                            width: '100%',
                                            marginTop: '3px'
                                        }}
                                        className="haveAccount"
                                        onClick={() => navigate("/auth/login")}
                                    >
                                        LOGIN
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    size="3x"  // Adjust the size as needed
                                    style={{ color: "#28a745" }}
                                    className="mt-2 cursor-pointer bounce"
                                />
                            </div>
                        </Reveal>
                    </div>

                    <section className="lg:py-0">

                        <div className="flex flex-col justify-between space-y-0 ">
                            <Reveal motionType={'rightToLeft'}>

                                <div className="flex flex-col py-5 overflow-hidden rounded-md lg:flex-row ">
                                    <img src={fingoSectionTwo} alt="" className="object-cover sm:mx-auto sm:max-w-lg aspect-auto" />
                                    <div className="items-end justify-end hidden lg:ml-20 xl:ml-28 lg:flex ">
                                        <img
                                            src={arrow2}
                                            alt=""
                                            className="text-end lg:w-32 lg:h-32 xl:w-36 xl:h-36 lg:flex"

                                        />
                                    </div>
                                    <div className="flex-col items-start justify-center flex-1 hidden mx-auto md:flex sm:py-10 lg:py-0 ">
                                        <h2 className="text-3xl font-bold text-[#2cb74c]">short, easy-to-read chapters</h2>
                                        <h3 className={`my-6 text-xl font-bold w-96 ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>choose from over 600 chapters, each only 3-4 minutes long</h3>

                                    </div>
                                    <div className="flex flex-col items-center justify-center mx-auto mt-5 lg:py-0 md:hidden">
                                    <h2 className="text-3xl font-bold text-[#2cb74c] w-60">short, easy-to-read chapters</h2>
                                    <h3 className={`my-6 text-base md:text-xl font-bold w-60 ${darkMode ? 'text-gray-100' : 'text-gray-950 w-60'}`}>choose from over 600 chapters, each only 3-4 minutes long</h3>

                                    </div>


                                </div>
                            </Reveal>
                            <Reveal motionType={"leftToRight"}>
                                <div className="flex flex-col w-full py-5 rounded-md lg:flex-row-reverse">
                                    <img src={fingoSectionThree} alt="" className="object-cover sm:mx-auto sm:max-w-lg aspect-auto" />





                                    <div className="flex-col items-center justify-start flex-1 hidden mx-auto lg:flex sm:py-10 lg:py-0">
                                        <div className="flex flex-col items-start justify-start">
                                            <div className="flex items-center justify-center space-x-28">
                                                <h2 className="text-3xl font-bold text-[#2cb74c] ">fun quizzes</h2>
                                                <img
                                                    src={arrow}
                                                    alt=""
                                                    className="w-64 h-64"

                                                />
                                            </div>
                                            <h3 className={`-mt-20 text-xl font-bold w-96 ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>
                                                complete quizzes, earn XP points, and increase your daily streak
                                            </h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center w-3/4 pb-5 mx-auto my-auto mt-5 lg:hidden ">
                                    <h2 className="text-3xl font-bold text-[#2cb74c] w-60 text-start">fun quizzes</h2>
                                    <h3 className={`my-1 text-base md:text-xl font-bold  ${darkMode ? 'text-gray-100' : 'text-gray-950 w-60'}`}>
                                        complete quizzes, earn XP points, and increase your daily streak
                                    </h3>
                                </div>



                            </Reveal>

                        </div>
                    </section>


                    <Reveal motionType={'zoom'}>
                        <div className="py-10 lg:py-12">

                            <div className="flex items-center justify-center pb-4 md:pb-10">
                                <h1 className="font-bold lg:text-4xl text-xl text-[#2cb74c]">choose from a wide range of topics</h1>
                            </div>

                            <div className="flex w-3/4 p-2 mx-auto space-x-5 overflow-x-auto border border-gray-300 border-solid rounded-md">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center">
                                        <button className="relative p-2 border rounded-md whitespace-nowrap text-gray-950">
                                            <span
                                                className={`absolute inset-0 rounded-md ${darkMode ? 'opacity-60' : 'opacity-20'}  `}
                                                style={{ backgroundColor: skill.color }}
                                            ></span>
                                            <span className={`relative  font-semibold ${darkMode ? ' text-gray-100' : 'text-gray-950'}`}>{skill.skill}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </Reveal>
                    <Reveal motionType={'zoom'}>
                        <div className="flex items-center justify-center pt-20 md:pb-7">
                            <h1 className="text-2xl font-bold lg:text-4xl">
                                <span className="text-[#BF5700] font-mono">WARNING:</span> <span className={`${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>You will hate</span>  <span className="text-[#2cb74c]">fingo</span> <span className={`${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>if...</span>
                            </h1>
                        </div>
                        <div style={{ height: '500px', overflowX: 'scroll', overflowY: 'hidden', display: 'flex' }}>
    <img src={fingoSectionFiveOne} alt="" className="object-cover px-4 py-5 transform aspect-auto -rotate-6" />
    <img src={fingoSectionFiveTwo} alt="" className="object-cover px-4 py-5 transform aspect-auto rotate-6" />
    <img src={fingoSectionFiveThree} alt="" className="object-cover px-4 py-5 transform aspect-auto -rotate-6" />
    <img src={fingoSectionFiveFour} alt="" className="object-cover px-4 py-5 transform aspect-auto rotate-6" />
    <img src={fingoSectionFiveFive} alt="" className="object-cover px-4 py-5 transform aspect-auto -rotate-6" />
</div>
                    </Reveal>

                    <Footer />
                </div>
            </div >
        </div >
    );
};

export default StartPage;





