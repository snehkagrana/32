/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import 'src/styles/HeartCard.styles.css'
import { ReactComponent as HeartAnimatedIcon } from 'src/assets/svg/heart-filled-animated.svg'
import { ReactComponent as DiamondIcon } from 'src/assets/svg/diamond.svg'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import { ReactComponent as RefillHeartIcon } from 'src/assets/svg/refill-heart.svg'
import { AMOUNT_OF_GEMS_REDEEM_TO_HEARTS } from 'src/constants/app.constant'
import { useDispatch } from 'react-redux'

const HeartCard = () => {
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useAuth()
    const { guestState } = usePersistedGuest()
    const { app_setOpenModalConfirmRefill } = useApp()

    const renderHeartIcon = active => (
        <HeartAnimatedIcon className={active ? 'active' : ''} />
    )

    const getMessage = useMemo(() => {
        return 'You have full hearts'
    }, [user])

    const getSubMessage = useMemo(() => {
        return 'Keep on learning'
    }, [user])

    const isAbleToRefill = useMemo(() => {
        return Boolean(
            user?.heart === 0 &&
                user?.diamond >= AMOUNT_OF_GEMS_REDEEM_TO_HEARTS
        )
    }, [user])

    const hearts = useMemo(() => {
        if (isAuthenticated && user) {
            return user?.heart || 0
        } else {
            return guestState?.heart || 0
        }
    }, [isAuthenticated, user, guestState])

    const onClickRefillHearts = () => {
        dispatch(app_setOpenModalConfirmRefill(true))
    }

    return (
        <div className='HeartCard'>
            <div className='HeartCardHeader flex align-items-center flex-column mb-3'>
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
            </div>

            <div className='HeaderCardContent'>
                <button className='HeartCardBtn mb-3'>
                    <UnlimitedHeartIcon />
                    <span> Unlimited Hearts</span>
                    <div className='EndContent'></div>
                </button>
                <button
                    className='HeartCardBtn mb-3'
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
                    <p className='text-center text-sm mb-0'>
                        Your gems are not enough
                    </p>
                )}
            </div>
        </div>
    )
}

export default HeartCard
