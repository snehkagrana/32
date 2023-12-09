import FingoCardCompleteTopic from './FingoCardCompleteTopic'
import FingoCardDailyXP from './FingoCardDailyXP'
import FingoCardDayStreak from './FingoCardDayStreak'
import FingoCardTotalXP from './FingoCardTotalXP'

const FingoWidgetContainer = () => {
    return (
        <>
            <FingoCardDayStreak />
            <FingoCardCompleteTopic />
            <FingoCardDailyXP />
            <FingoCardTotalXP />
        </>
    )
}

export default FingoWidgetContainer
