/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import 'src/styles/HeartCard.styles.css'
import { ReactComponent as HeartIcon } from 'src/assets/svg/heart.svg'
import { ReactComponent as DiamondIcon } from 'src/assets/svg/diamond.svg'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import { ReactComponent as RefillHeartIcon } from 'src/assets/svg/refill-heart.svg'
import { AMOUNT_OF_GEMS_REDEEM_TO_HEARTS } from 'src/constants/app.constant'
import UnlimitedHeartImg from 'src/assets/images/unlimited-hearts.png'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import CountdownTimer from '../CountdownTimer'

const HeartCard = () => {
    const today = new Date()
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useAuth()
    const { guest } = usePersistedGuest()
    const { app_setOpenModalConfirmRefill, app_setOpenModalUnlimitedHearts } =
        useApp()

    const renderHeartIcon = active => (
        <HeartIcon className={active ? 'active' : ''} />
    )

    const getMessage = useMemo(() => {
        const message1 = 'You have full hearts'
        const message2 = 'Next heart in 1 hours'
        if (isAuthenticated) {
            if (user?.heart === 5) {
                return message1
            } else if (user?.heart < 5) {
                return message2
            }
            return message1
        } else {
            if (guest?.heart === 5) {
                return message1
            } else if (guest?.heart < 5) {
                return message2
            }
        }
    }, [isAuthenticated, user, guest])

    const getSubMessage = useMemo(() => {
        const subMessage1 = 'Keep on learning'
        const subMessage2 = 'You still have hearts left! Keep on learning'
        const subMessage3 = 'You have no hearts left! Try an option below'
        if (isAuthenticated) {
            if (user?.heart === 5) {
                return subMessage1
            } else if (user?.heart < 5 && user?.heart !== 0) {
                return subMessage2
            } else {
                return subMessage3
            }
        } else {
            if (guest?.heart === 5) {
                return subMessage1
            } else if (guest?.heart < 5 && guest?.heart !== 0) {
                return subMessage2
            } else {
                return subMessage3
            }
        }
    }, [isAuthenticated, user, guest])

    const isAbleToRefill = useMemo(() => {
        // prettier-ignore
        return Boolean(user?.heart === 0 && user?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS) || Boolean(guest?.heart === 0 && guest?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS)
    }, [isAuthenticated, user, guest])

    const isAbleToGetUnlimitedHearts = useMemo(() => {
        // logic here
        return true
    }, [isAuthenticated, user, guest])

    const hearts = useMemo(() => {
        if (isAuthenticated && user) {
            return user?.heart || 0
        } else {
            return guest?.heart || 0
        }
    }, [isAuthenticated, user, guest])

    const onClickRefillHearts = () => {
        dispatch(app_setOpenModalConfirmRefill(true))
    }

    const onClickUnlimitedHearts = () => {
        dispatch(app_setOpenModalUnlimitedHearts(true))
    }

    // prettier-ignore
    const isActiveUnlimitedHearts = useMemo(() => {
        return isAuthenticated && user?.unlimitedHeart && dayjs(user.unlimitedHeart).isAfter(dayjs(today).toISOString(), 'minute')
    }, [user, isAuthenticated])

    return (
        <div className='HeartCard'>
            <div className='HeartCardHeader flex align-items-center flex-column'>
                {isActiveUnlimitedHearts ? (
                    <div className='UnlimitedHearts'>
                        <h2 className='mb-3'>Unlimited Hearts</h2>
                        <img
                            src={UnlimitedHeartImg}
                            alt='UnlimitedHeartImg'
                            className='UnlimitedHeartImg'
                        />

                        <CountdownTimer targetDate={user.unlimitedHeart} />
                    </div>
                ) : (
                    <>
                        <h2 className='mb-2'>Hearts</h2>
                        <ul className='flex align-items-center mb-3'>
                            {Array.from({ length: 5 }, (_, index) => (
                                <li className='mx-1'>
                                    {renderHeartIcon(
                                        hearts >= index + 1 ? true : false
                                    )}
                                </li>
                            ))}
                        </ul>
                        <h4 className='mb-1'>{getMessage}</h4>
                        <h6>{getSubMessage}</h6>
                    </>
                )}
            </div>

            {!isActiveUnlimitedHearts && (
                <div className='HeaderCardContent mt-3'>
                    <button
                        className='HeartCardBtn mb-3'
                        onClick={onClickUnlimitedHearts}
                        disabled={!isAbleToGetUnlimitedHearts}
                    >
                        <UnlimitedHeartIcon />
                        <span> Unlimited Hearts</span>
                        <div className='EndContent'></div>
                    </button>
                    <button
                        className='HeartCardBtn'
                        disabled={!isAbleToRefill}
                        onClick={onClickRefillHearts}
                    >
                        <RefillHeartIcon />
                        <span> Refill Hearts</span>
                        <div className='EndContent'>
                            <DiamondIcon />
                            <span>{AMOUNT_OF_GEMS_REDEEM_TO_HEARTS}</span>
                        </div>
                    </button>
                    {user?.diamond < AMOUNT_OF_GEMS_REDEEM_TO_HEARTS && (
                        <p className='text-center text-sm mb-0 mt-2'>
                            You do not have enough gems.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default HeartCard
