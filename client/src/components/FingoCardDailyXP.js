import { useMemo } from 'react'
import { useApp, useAuth } from 'src/hooks'
import 'src/styles/FingoCardDailyXP.styles.css'
import { ReactComponent as LightningIcon } from 'src/assets/svg/lightning-fill.svg'
import TreasureImg from 'src/assets/images/ic_treasure.png'

const FingoCardDailyXP = () => {
    const { dailyXP } = useApp()
    const { newUser, user } = useAuth()

    const getDailyXp = useMemo(() => {
        if (user) {
            return user?.xp?.daily > 60 ? 60 : user?.xp?.daily || 0
        } else {
            return newUser
                ? parseInt(sessionStorage.getItem('xp'), 10) || 0
                : dailyXP > 60
                  ? 60
                  : dailyXP
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser, dailyXP, user])

    return (
        <div className={`mb-6 FingoCardDailyXP FingoShapeRadius`}>
            <h2 className='title'>Daily Quests</h2>
            <div className='FingoCardDailyXPInner'>
                <div className='left'>
                    <LightningIcon />
                </div>
                <div className='right'>
                    <div className='xp-header'>
                        <p>Earn {getDailyXp} XP</p>
                    </div>
                    <div className='FingoCardDailyXPContent'>
                        <div class='progress'>
                            {newUser ? (
                                <div className='xp-count'>
                                    {getDailyXp || 0}/60
                                </div>
                            ) : (
                                <div className='xp-count'>
                                    {getDailyXp || 0}/60
                                </div>
                            )}
                            <div
                                class='progress-bar bg-warning'
                                role='progressbar'
                                aria-valuenow={getDailyXp}
                                aria-valuemin='0'
                                aria-valuemax='60'
                                style={{
                                    width: `${(getDailyXp / 60) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <div className='icImg'>
                            <img src={TreasureImg} alt='ic' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FingoCardDailyXP
