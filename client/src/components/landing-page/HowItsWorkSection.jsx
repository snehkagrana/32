/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './HowItsWorkSection.styles.css'

import { Element, Events, scrollSpy, scroller } from 'react-scroll'

import Img1 from 'src/assets/images/img1.png'

const ITEMS = [
    {
        title: 'Learn new topic',
        content:
            'Short, easy-to-read chapters. Choose from over 600 chapters, each only 3-4 minutes long.',
        imageUrl: Img1,
        position: 'left',
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
        position: 'right',
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
        position: 'left',
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
        position: 'right',
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
        position: 'left',
    },
]

const animationVariantImage = {
    hidden: { opacity: 0, y: 200, scale: 0.5 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5 },
    },
}

const Item = ({ data, index, activeIndex, setActiveIndex, isLastItem }) => {
    const screenHeight = window.innerHeight

    const control = useAnimation()
    const [isScrollClickable, setIsScrollClickable] = useState(false)
    const [lastScroll, setLastScroll] = useState(0)

    const { ref, inView, entry } = useInView({
        threshold: 0,
        rootMargin: `-${screenHeight / 2.5}px`,
    })

    useEffect(() => {
        if (inView) {
            control.start('visible')
        } else if (activeIndex > index) {
            control.start('visible')
        } else {
            control.start('hidden')
        }
    }, [control, inView, index, activeIndex, isScrollClickable])

    useEffect(() => {
        if (inView) {
            setActiveIndex(index)
        }
    }, [inView, index])

    const onClickIcon = paramsIndex => {
        scroller.scrollTo(`scroll-to-element-${paramsIndex}`, {
            duration: 650,
            delay: 0,
            offset: -screenHeight / 3.5,
            smooth: 'easeInOutQuart',
        })
    }

    // useEffect is used to perform side effects in functional components.
    // Here, it's used to register scroll events and update scrollSpy when the component mounts.
    useEffect(() => {
        // Registering the 'begin' event and logging it to the console when triggered.
        Events.scrollEvent.register('begin', (to, element) => {
            console.log('begin', to, element)
        })

        // Registering the 'end' event and logging it to the console when triggered.
        Events.scrollEvent.register('end', (to, element) => {
            console.log('end', to, element)
            setActiveIndex(parseInt(to.substr(-1, 1), 10))
            setIsScrollClickable(true)
        })

        // Updating scrollSpy when the component mounts.
        scrollSpy.update()

        // Returning a cleanup function to remove the registered events when the component unmounts.
        return () => {
            Events.scrollEvent.remove('begin')
            Events.scrollEvent.remove('end')
        }
    }, [])

    console.log('activeIndex', activeIndex)

    return (
        <Element name={`scroll-to-element-${index}`}>
            <div
                className={`HowItsWorkItemContainer ${data.position}`}
                ref={ref}
            >
                <motion.div
                    className={`HowItsWorkItemImage ${
                        activeIndex === index ? 'active' : ''
                    } ${data.position}`}
                    variants={animationVariantImage}
                    initial='hidden'
                    animate={control}
                >
                    <img src={data.imageUrl} alt='img' />
                </motion.div>
                <div className='HowItsWorkItemIcon relative'>
                    <div
                        className={`FirstLine ${
                            activeIndex === index || activeIndex > index
                                ? 'active'
                                : 'inactive'
                        }`}
                    />
                    {!isLastItem && (
                        <div
                            className={`SecondLine ${
                                activeIndex - 1 >= index ? 'active' : 'inactive'
                            }`}
                        />
                    )}
                    <div
                        onClick={() => onClickIcon(index)}
                        className={`MarkerIcon  ${
                            activeIndex === index || activeIndex > index
                                ? 'active'
                                : 'inactive'
                        }`}
                    >
                        <div className={`HowItsWorkIcon-`}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fill='currentColor'
                                    d='m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z'
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <motion.div
                    className={`HowItsWorkTextContainer ${data.position}`}
                    variants={animationVariantImage}
                    initial='hidden'
                    animate={control}
                >
                    <h2>{data.title}</h2>
                    <h6>{data.content}</h6>
                </motion.div>
            </div>
        </Element>
    )
}

const HowItsWorkSection = () => {
    const screenHeight = window.innerHeight
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className='HowItsWorkSection'>
            {ITEMS.map((x, index) => (
                <Item
                    data={x}
                    index={index}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    isLastItem={ITEMS.length - 1 === index}
                />
            ))}
        </div>
    )
}

export default HowItsWorkSection
