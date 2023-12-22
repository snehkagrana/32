import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './HowItsWorkSection.styles.css'

import Img1 from 'src/assets/images/img1.png'

const ITEMS = [
    {
        title: 'Learn new topic',
        content:
            'Short, easy-to-read chapters. Choose from over 600 chapters, each only 3-4 minutes long.',
        imageUrl: Img1,
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
    },
    {
        title: 'Answer Quizzes',
        content:
            'Practice what to learned and challenge yourself with fun quizzes.',
        imageUrl: Img1,
    },
]

const boxVariant = {
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hidden: { opacity: 0, scale: 0 },
}

const Box = ({ data, index }) => {
    const control = useAnimation()
    const [ref, inView] = useInView()

    useEffect(() => {
        if (inView) {
            control.start('visible')
        } else {
            control.start('hidden')
        }
    }, [control, inView])

    return (
        <motion.div
            className='HowItsWorkItemContainer'
            ref={ref}
            variants={boxVariant}
            // initial='hidden'
            initial='visible'
            animate={control}
        >
            <div className='HowItsWorkItemImage'>
                <img src={data.imageUrl} alt='img' />
            </div>
            <div className='HowItsWorkItemIcon relative'>
                <div className='HowItsWorkLine active' />
                <div className='HowItsWorkLine2' />
                <div className={`MarkerIcon complete`}>
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
                    {/* <div className="sub_category_chapter_ic_circle" /> */}
                </div>
            </div>
            <div className='HowItsWorkTextContainer'>
                <h2>{data.title}</h2>
                <h6>{data.content}</h6>
            </div>
        </motion.div>
    )
}

const Icon = () => (
    <div className={`MarkerIcon complete`}>
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
        {/* <div className="sub_category_chapter_ic_circle" /> */}
    </div>
)
const HowItsWorkSection = () => {

    return (
        <div className='HowItsWorkSection'>
            {ITEMS.map((x, index) => (
                <Box data={x} index={index} />
            ))}
        </div>
    )
}

export default HowItsWorkSection
