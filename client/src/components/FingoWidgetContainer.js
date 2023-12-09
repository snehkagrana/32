import { useState } from 'react'
import FingoCardCompleteTopic from './FingoCardCompleteTopic'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'
import FingoWidgetHeader from './FingoWidgetHeader'

const FingoWidgetContainer = () => {
    const [activeTab, setActiveTab] = useState('streak')

    return (
        <>
            <FingoWidgetHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {activeTab === 'streak' && <FingoCardDayStreak />}
            {activeTab === 'diamond' && <FingoCardTotalXP />}
            <FingoCardCompleteTopic />
            <FingoCardDailyXP />
        </>
    )
}

export default FingoWidgetContainer
