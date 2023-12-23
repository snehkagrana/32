/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import NetflixLogo from 'src/assets/images/logos/netflix-logo.png'
import AmazonPrimeLogo from 'src/assets/images/logos/amazon-prime-logo.png'
import YoutubeLogo from 'src/assets/images/logos/youtube-logo.png'
import './ThrustedBySection.styles.css'

const ITEMS = [
    {
        name: 'Netflix',
        imageUrl: NetflixLogo,
    },
    {
        name: 'Amazon Prime',
        imageUrl: AmazonPrimeLogo,
    },
    {
        name: 'Youtube',
        imageUrl: YoutubeLogo,
    },
]

const variants = {
    hidden: { opacity: 0, y: 200, scale: 0.5 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5 },
    },
}

const ThrustedBySection = () => {
    const control = useAnimation()

    const { inView, ref } = useInView({
        threshold: 0,
        rootMargin: '-220px',
    })

    useEffect(() => {
        if (inView) {
            control.start('visible')
        } else {
            control.start('hidden')
        }
    }, [control, inView])

    return (
        <div className='ThrustedBySection' ref={ref}>
            <motion.h2 animate={control} variants={variants} initial='hidden'>
                TRUSTED BY PEOPLE WHO WATCH
            </motion.h2>
            <motion.div
                animate={control}
                variants={variants}
                initial='hidden'
                className='ThrustedBySectionLogoContainer'
            >
                {ITEMS.map((x, index) => (
                    <div className='ThrustedBySectionItem'>
                        <img src={x.imageUrl} alt={x.name} />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default ThrustedBySection
