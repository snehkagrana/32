import { useApp, useAuth } from 'src/hooks'
import { FingoButton, FingoModal } from './core'
import { useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import Assets from 'src/assets'
import 'src/styles/FingoModalLevelUp.styles.css'
import { getLevelColor } from 'src/utils'
import Confetti from 'react-dom-confetti'
import { XP_LEVEL_COLORS_DEFAULT } from 'src/constants'
import { Howl } from 'howler'
import Sound from 'src/sounds/game-level-complete.mp3'

const confettiConfig = {
    angle: 10,
    spread: 360,
    startVelocity: 30,
    elementCount: 150,
    dragFriction: 0.12,
    duration: 2000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '420px',
    colors: XP_LEVEL_COLORS_DEFAULT,
}

const FingoModalLevelUp = ({ isFormScorePage }) => {
    const dispatch = useDispatch()
    const [celebrate, setCelebrate] = useState(false)
    const { modalLevelUp, app_setModalLevelUp } = useApp()
    const { newUser, user } = useAuth()

    const sound = new Howl({
        src: [Sound], // Replace with the path to your sound file
    })

    const onClose = useCallback(() => {
        dispatch(app_setModalLevelUp({ ...modalLevelUp, open: false }))
        setTimeout(() => {
            dispatch(app_setModalLevelUp({ open: false, data: null }))
        }, 300)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalLevelUp])

    useEffect(() => {
        if (modalLevelUp?.open && modalLevelUp?.data) {
            setTimeout(() => {
                setCelebrate(true)
            }, 300)
        } else {
            setCelebrate(false)
        }
    }, [modalLevelUp])

    useEffect(() => {
        if (isFormScorePage) {
            sound.once('load', () => {
                if (celebrate) {
                    sound.play()
                }
            })
            sound.load()
            return () => {
                sound.unload()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [celebrate, isFormScorePage])

    const getLevelImage = level => {
        if (level) {
            if (level > 10) {
                return Assets.ImageLevel10
            } 
            switch (level) {
                case 1:
                    return Assets.ImageLevel1
                case 2:
                    return Assets.ImageLevel2
                case 3:
                    return Assets.ImageLevel3
                case 4:
                    return Assets.ImageLevel4
                case 5:
                    return Assets.ImageLevel5
                case 6:
                    return Assets.ImageLevel6
                case 7:
                    return Assets.ImageLevel7
                case 8:
                    return Assets.ImageLevel8
                case 9:
                    return Assets.ImageLevel9
                case 10:
                    return Assets.ImageLevel10
                default:
                    return Assets.ImageLevel1
            }
        }
        return Assets.ImageLevel1
    }

    return (
        <FingoModal open={modalLevelUp.open} onClose={onClose}>
            <div
                className='FingoModalLevelUp'
                style={{
                    background: getLevelColor(
                        'default',
                        modalLevelUp?.data?.level ?? 1
                    ),
                }}
            >
                <div
                    className='FingoModalLevelCelebrate'
                    style={{
                        backgroundImage: `url('${Assets.CelebrateBadge2}')`,
                    }}
                />
                <img
                    className='relative'
                    src={getLevelImage(modalLevelUp?.data?.level ?? 1)}
                    alt='Level'
                />

                <div className='relative mb-3 text-center'>
                    {isFormScorePage ? (
                        <>
                            <h2>Congratulations!</h2>
                            <h6>
                                You reached Level{' '}
                                {modalLevelUp?.data?.level
                                    ? modalLevelUp.data.level
                                    : ''}
                            </h6>
                        </>
                    ) : (
                        <>
                            <h2>
                                Level{' '}
                                {modalLevelUp?.data?.level
                                    ? modalLevelUp.data.level
                                    : '1'}
                            </h2>
                            <h6>
                                You have earned 🍌{' '}
                                {modalLevelUp?.data?.total
                                    ? modalLevelUp.data.total
                                    : '0'}
                                .
                            </h6>
                            <h6>
                                Keep learning to go from being a monkey to a
                                human.
                            </h6>
                        </>
                    )}
                </div>
                <FingoButton color='white' style={{borderRadius: '12px'}} onClick={onClose}>
                    Continue
                </FingoButton>
            </div>
            <div className='confetti-container'>
                <Confetti active={celebrate} config={confettiConfig} />
            </div>
        </FingoModal>
    )
}

export default FingoModalLevelUp
