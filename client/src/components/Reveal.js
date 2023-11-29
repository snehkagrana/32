import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

function Reveal({ children, motionType }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                mainControls.start('visible');
            }, 100);
        }
    }, [isInView, mainControls]);

    const getVariants = () => {
        switch (motionType) {
            case 'leftToRight':
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'rightToLeft':
                return {
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'zoom':
                return {
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { opacity: 1, scale: 1 }
                };
            default:
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
        }
    };

    return (
        <div ref={ref} className="relative">
            <motion.div
                variants={getVariants()}
                initial='hidden'
                animate={mainControls}
                transition={{
                    duration: 1,
                    delay: 0.25
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default Reveal;
