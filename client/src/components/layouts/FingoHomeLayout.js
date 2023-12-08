import FingoSidebar from '../FingoSidebar'
import ModalLogin from '../auth/ModalLogin'
import ModalRegister from '../auth/ModalRegister'
import 'src/styles/FingoHomeLayout.styles.css'

const FingoHomeLayout = ({ children }) => {
    return (
        <div className='FingoHomeLayout'>
            <FingoSidebar />
            <div className='FingoHomeLayoutWrapper'>
                <div className='FingoHomeLayoutContainer'>{children}</div>
            </div>
            <ModalLogin />
            <ModalRegister />
        </div>
    )
}

export default FingoHomeLayout
