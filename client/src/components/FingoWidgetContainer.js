import { useState } from 'react'
import FingoCardCompleteTopic from './FingoCardCompleteTopic'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import FingoWidgetHeader from './FingoWidgetHeader'
import { useMediaQuery } from 'src/hooks'
import { useLocation } from 'react-router-dom'
import FingoCardGiftbox from './FingoCardGiftbox'
import HeartCard from './hearts/HeartCard'
import { FingoCard } from './core'

const FingoWidgetContainer = () => {
    const location = useLocation()
    const matchMobile = useMediaQuery('(max-width: 570px)')

    return (
        <>
            <FingoWidgetHeader />
            {!matchMobile && (
                <>
                    <FingoCard className='mb-3'>
                        <HeartCard />
                    </FingoCard>
                    <FingoCard className='mb-3'>
                        <FingoCardDayStreak />
                    </FingoCard>
                    <FingoCard className='mb-3'>
                        <FingoCardDailyXP />
                    </FingoCard>
                    <FingoCard className='mb-3'>
                        <FingoCardTotalXP />
                    </FingoCard>
                    <FingoCard className='mb-3'>
                        <FingoCardGiftbox />
                    </FingoCard>
                </>
            )}

            {!location.pathname.includes('/skills/') && !matchMobile && (
                <FingoCardCompleteTopic />
            )}
        </>
    )
}

export default FingoWidgetContainer
