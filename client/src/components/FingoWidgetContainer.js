import { useState } from 'react'
import FingoCardCompleteTopic from './FingoCardCompleteTopic'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import FingoWidgetHeader from './FingoWidgetHeader'
import { useMediaQuery } from 'src/hooks'
import { useLocation } from 'react-router-dom'

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
                    <FingoCardDayStreak />
                    <FingoCardTotalXP />
                    <FingoCardDailyXP />
                </>
            )}

            {!location.pathname.includes('/skills/') && (
                <FingoCardCompleteTopic />
            )}
        </>
    )
}

export default FingoWidgetContainer
