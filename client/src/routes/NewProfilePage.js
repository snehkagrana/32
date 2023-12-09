import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import FingoUserInfo from 'src/components/FingoUserInfo'

const NewProfilePage = props => {
    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <div className='row'>
                <div className='col-12 col-md-6'>
                    <FingoUserInfo />
                </div>
            </div>
        </FingoHomeLayout>
    )
}

export default NewProfilePage
