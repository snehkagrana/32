import { Helmet } from 'react-helmet'
import FingoCardDailyXP from 'src/components/FingoCardDailyXP'
import { FingoHomeLayout } from 'src/components/layouts'

const DailyQuestPage = props => {
    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Daily Quest</title>
            </Helmet>
            <div className='row'>
                <div className='col-12 col-md-6'>
                    <FingoCardDailyXP />
                </div>
            </div>
        </FingoHomeLayout>
    )
}

export default DailyQuestPage
