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


import { motion, useMotionValue, useScroll } from 'framer-motion'

const skills = [
    { skill: 'Investment', color: 'red' },
    { skill: 'Fixed Income', color: 'blue' },
    { skill: 'Economics', color: 'green' },
    { skill: 'Personal Finance', color: 'orange' },
    { skill: 'Trading', color: 'purple' },
    { skill: 'Forex', color: 'yellow' },
    { skill: 'Real Estate', color: 'violet' },
    { skill: 'Stock Market Analysis', color: 'cyan' },
    { skill: 'Cryptocurrency', color: 'teal' },
    { skill: 'Risk Management', color: 'pink' },
    { skill: 'Financial Planning', color: 'brown' },
    { skill: 'Wealth Management', color: 'indigo' },
    { skill: 'Portfolio Management', color: 'lime' },
    { skill: 'Asset Allocation', color: 'magenta' },
    { skill: 'Retirement Planning', color: 'slate' },
    { skill: 'Hedge Funds', color: 'crimson' },
    { skill: 'Behavioral Finance', color: 'navy' },
    { skill: 'Derivatives Trading', color: 'sky' },
    { skill: 'Credit Analysis', color: 'orchid' },
    { skill: 'Valuation', color: 'maroon' },
    { skill: 'Financial Modeling', color: 'olive' },
];


const logo = require("../images/teach.png");

const words = ['finance', 'investing', 'mutual funds', 'personal finance', 'economics', 'crypto', 'insurance'];
const intervalDuration = 2000;

const StartPage = (props) => {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const updateCurrentWord = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    };

    useEffect(() => {
        const interval = setInterval(updateCurrentWord, intervalDuration);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const darkMode = localStorage.getItem("theme") === "dark";

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
                <div className="pb-16 ">
                    <div
                        className={
                            'flex flex-1 overflow-hidden text-slate-600 '
                        }>
                        <div className='z-10 flex-1 '>
                            <motion.header
                                style={{ height }}
                                className='fixed inset-x-0 flex h-40 py-20 bg-white/30 backdrop-blur-lg'>
                                <div className='flex items-center justify-between w-full max-w-5xl px-8 mx-auto'>
                                    <MDBContainer onClick={() => navigate(`/`)} fluid >
                                        <img
                                            src={fingoLogo}
                                            alt="Fingo Logo"
                                            style={{ height: "50px", cursor: "" }}
                                        />
                                    </MDBContainer>
                                    <div className="flex justify-between w-full">
                                        <span className={`flex items-center justify-end lg:text-lg text-sm font-bold whitespace-nowrap flex-1 mr-4 ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>Contact Us</span>
                                        <Button
                                            style={{
                                                width: "45%",
                                                backgroundColor: "#28a745",
                                                borderColor: "#28a745",
                                                margin: "0 auto",
                                                display: "block",
                                                padding: "12px",
                                                borderRadius: "10px",
                                                boxShadow: "0px 7px #1a5928",
                                                transition: "0.2s ease",
                                                fontWeight: "800",
                                                marginBottom: "20px"
                                            }}
                                            className="getStarted"
                                            onClick={() => navigate("/home")}
                                        >
                                            Try Now!
                                        </Button>
                                    </div>
                                </div>
                            </motion.header>
                        </div>
                    </div>

                    <div className="pt-64 mx-auto pb-28 ">
                        <Reveal motionType={'zoom'}>

                            <div className="flex items-center justify-center">
                                <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>find learning finace boring?</h1>
                            </div>

                            <h1 className={`text-background-${darkMode ? 'dark' : 'light'} flex justify-center items-center scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl py-5`}>
                                <span className="font-bold text-[#2cb74c]">
                                    learn finance the fun way😎!!
                                </span>
                            </h1>
                        </Reveal>

                        <Reveal motionType={'zoom'}>
                            <div className="flex items-center justify-center mx-auto space-x-3 w-96 py-14">
                                <div className="flex flex-col w-1/2">

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
                                            marginBottom: "20px"
                                        }}
                                        className="getStarted"
                                        onClick={() => navigate("/home")}
                                    >
                                        Try Now!
                                    </Button>
                                </div>
                                <Button
                                    style={{
                                        width: "50%",
                                        padding: '10px',
                                        backgroundColor: "#FFFFFF",
                                        borderColor: "#808080",
                                        borderRadius: "10px",
                                        boxShadow: "0px 7px #818589",
                                        transition: "0.2s ease",
                                        fontWeight: "800",
                                        color: "#4285F4"
                                    }}
                                    className="haveAccount"
                                    onClick={() => navigate("/auth/login")}
                                >
                                    LOGIN
                                </Button>
                            </div>
                        </Reveal>
                    </div>

                    <section className="py-36 ">

                        <div className="flex flex-col justify-between space-y-16 ">
                            <Reveal motionType={'rightToLeft'}>

                                <div className="flex flex-col py-5 overflow-hidden rounded-md lg:flex-row ">
                                    <img src={fingoSectionTwo} alt="" className="object-cover max-w-xl mx-auto aspect-auto" />
                                    <div className="items-end justify-end hidden ml-28 lg:flex">
                                        <img
                                            src={arrow2}
                                            alt=""
                                            className="text-end lg:w-32 lg:h-32 xl:w-36 xl:h-36 lg:flex"

                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-center flex-1 mx-auto sm:py-10 lg:py-0">
                                        <h2 className="text-3xl font-bold text-[#2cb74c]">short, easy-to-read chapters</h2>
                                        <h3 className={`my-6 text-xl font-bold w-96 ${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>choose from over 600 chapters, each only 3-4 minutes long</h3>

                                    </div>

                                </div>
                            </Reveal>
                            <Reveal motionType={"leftToRight"}>
                                <div className="flex flex-col w-full py-5 rounded-md lg:flex-row-reverse">
                                    <img src={fingoSectionThree} alt="" className="object-cover max-w-xl mx-auto aspect-auto" />
                                    <div className="flex flex-col items-center justify-start flex-1 sm:py-10 lg:py-0 ">
                                        <div className="flex items-center justify-center">
                                            <h2 className="text-3xl font-bold text-[#2cb74c]">fun quizzes</h2>
                                            <div className="flex items-center justify-center ">
                                                <img src={arrow} alt="" className="hidden ml-20 lg:w-44 lg:h-44 xl:w-60 xl:h-60 lg:flex" />
                                            </div>
                                        </div>
                                        <h3 className={`text-xl font-bold text-gray-900 lg:-mt-16 w-96 ${darkMode ? 'text-gray-100' : 'text-gray-950 lg:mr-24 '}`} > complete quizzes, earn XP points, and increase your daily streak</h3>
                                    </div>
                                </div>
                            </Reveal>

                        </div>
                    </section>


                    <Reveal motionType={'zoom'}>
                        <div className="py-12">

                            <div className="flex items-center justify-center py-10">
                                <h1 className="font-bold lg:text-4xl text-2xl text-[#2cb74c]">choose from a wide range of topics</h1>
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
                        <div className="flex items-center justify-center py-20">
                            <h1 className="text-2xl font-bold lg:text-4xl">
                                <span className="text-[#BF5700] font-mono">WARNING:</span> <span className={`${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>you will hate</span>  <span className="text-[#2cb74c]">fingo</span> <span className={`${darkMode ? 'text-gray-100' : 'text-gray-950'}`}>if...</span>
                            </h1>
                        </div>

                        <Slider slidesToScroll={3} slidesToShow={3} dots className="sm:p-0 md:p-10" autoplay autoplaySpeed={7000} speed={7000}>
                            <img src={fingoSectionFiveOne} alt="" className="object-cover py-5 transform sm:px-0 md:px-10 aspect-auto -rotate-6" />
                            <img src={fingoSectionFiveTwo} alt="" className="object-cover py-5 transform sm:px-0 md:px-10 aspect-auto rotate-6" />
                            <img src={fingoSectionFiveThree} alt="" className="object-cover py-5 transform sm:px-0 md:px-10 aspect-auto -rotate-6" />
                            <img src={fingoSectionFiveFour} alt="" className="object-cover py-5 transform sm:px-0 md:px-10 aspect-auto rotate-6" />
                            <img src={fingoSectionFiveFive} alt="" className="object-cover py-5 transform sm:px-0 md:px-10 aspect-auto -rotate-6" />
                        </Slider>
                    </Reveal>

                    <Footer />
                </div>
            </div >
        </div >
    );
};

export default StartPage;


