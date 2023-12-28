/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import { useAuth } from 'src/hooks'
import 'src/styles/HeartCard.styles.css'
import { ReactComponent as HeartAnimatedIcon } from 'src/assets/svg/heart-filled-animated.svg'
import { ReactComponent as DiamondIcon } from 'src/assets/svg/diamond.svg'
import { ReactComponent as UnlimitedHeartIcon } from 'src/assets/svg/unlimited-hearts.svg'
import { ReactComponent as RefillHeartIcon } from 'src/assets/svg/refill-heart.svg'
import { AMOUNT_OF_GEMS_REDEEM_TO_HEARTS } from 'src/constants/app.constant'

const HeartCard = () => {
    const { user } = useAuth()

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
        return user.heart === 0
    }, [user])

    return (
        <div className='HeartCard FingoShapeRadius mb-3'>
            <div className='HeartCardContainer'>
                <div className='HeartCardHeader flex align-items-center flex-column mb-3'>
                    <h2 className='mb-2'>Hearts</h2>
                    <ul className='flex align-items-center mb-3'>
                        {Array.from({ length: 5 }, (_, index) => (
                            <li className='mx-1'>
                                {renderHeartIcon(
                                    user.heart >= index + 1 ? true : false
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
                    >
                        <RefillHeartIcon />
                        <span> Refill Hearts</span>
                        <div className='EndContent'>
                            <DiamondIcon />
                            <span>{AMOUNT_OF_GEMS_REDEEM_TO_HEARTS}</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeartCard
