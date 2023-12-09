/* eslint-disable jsx-a11y/anchor-is-valid */
import 'src/styles/FingoWidgetHeader.styles.css'
import { useAuth } from 'src/hooks'

import EnglishIcon from 'src/assets/images/united-kingdom.png'
import JewelsIcon from 'src/assets/images/jewels.png'
import HeartIcon from 'src/assets/images/heart.png'
import StreakIcon from 'src/assets/images/fire-on.png'

const MENU_ITEMS = [
    {
        icon: EnglishIcon,
        name: 'language',
        color: '#ff9600',
    },
    {
        icon: StreakIcon,
        name: 'streak',
        color: '#ff9600',
    },
    {
        icon: JewelsIcon,
        name: 'diamond',
        color: '#1cb0f6',
    },
    {
        icon: HeartIcon,
        name: 'heart',
        color: '#ef5350',
    },
]

const FingoWidgetHeader = ({ activeTab, setActiveTab }) => {
    const { user } = useAuth()

    const onClickSidebarItem = (e, name) => {
        e.preventDefault()
        switch (name) {
            case 'language':
                // do something
                break
            case 'heart':
                // do something
                break
            default:
                setActiveTab(name)
                break
        }
    }

    const getTabLabel = name => {
        switch (name) {
            case 'streak':
                return user?.streak ? String(user.streak) ?? '0' : undefined

            case 'diamond':
                return user?.xp?.total
                    ? String(user.xp.total) ?? '0'
                    : undefined

            default:
                return undefined
        }
    }

    return (
        <div className='FingoWidgetHeader'>
            <div className='FingoWidgetHeaderInner'>
                <ul>
                    {MENU_ITEMS.map((i, index) => (
                        <li key={String(index)}>
                            <a
                                href='#'
                                onClick={e => onClickSidebarItem(e, i.name)}
                                className={activeTab === i.name ? 'active' : ''}
                            >
                                <img src={i.icon} alt='footer icon' />
                                {getTabLabel(i.name) && (
                                    <span style={{ color: i.color }}>
                                        {getTabLabel(i.name)}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FingoWidgetHeader
