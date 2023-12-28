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

const FingoWidgetContainer = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('')
    const matchMobile = useMediaQuery('(max-width: 570px)')

    return (
        <>
            <FingoWidgetHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {!matchMobile && (
                <>
                    <HeartCard />
                    <FingoCardDayStreak />
                    <FingoCardDailyXP />
                    <FingoCardTotalXP />
                    <FingoCardGiftbox />
                </>
            )}

            {!location.pathname.includes('/skills/') && !matchMobile && (
                <FingoCardCompleteTopic />
            )}
        </>
    )
}

export default FingoWidgetContainer
