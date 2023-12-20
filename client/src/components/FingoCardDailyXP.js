/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useMemo } from 'react'
import { useApp, useAuth, useReward } from 'src/hooks'
import 'src/styles/FingoCardDailyXP.styles.css'
import { ReactComponent as LightningIcon } from 'src/assets/svg/lightning-fill2.svg'
import TreasureImg from 'src/assets/images/ic_treasure.png'

import ImageLevel1 from 'src/assets/images/levels/1.png'
import ImageLevel2 from 'src/assets/images/levels/2.png'
import ImageLevel3 from 'src/assets/images/levels/3.png'
import ImageLevel4 from 'src/assets/images/levels/4.png'
import ImageLevel5 from 'src/assets/images/levels/5.png'
import ImageLevel6 from 'src/assets/images/levels/6.png'
import ImageLevel7 from 'src/assets/images/levels/7.png'
import ImageLevel8 from 'src/assets/images/levels/8.png'
import ImageLevel9 from 'src/assets/images/levels/9.png'
import ImageLevel10 from 'src/assets/images/levels/10.png'

import { useDispatch } from 'react-redux'
import { RewardApi } from 'src/api'

const FingoCardDailyXP = () => {
    const dispatch = useDispatch()
    const { dailyXP } = useApp()
    const { openModalClaimReward, reward_setOpenModalClaimReward } = useReward()
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

    const getLevelImage = level => {
        if (level) {
            switch (level) {
                case 1:
                    return ImageLevel1
                case 2:
                    return ImageLevel2
                case 3:
                    return ImageLevel3
                case 4:
                    return ImageLevel4
                case 5:
                    return ImageLevel5
                case 6:
                    return ImageLevel6
                case 7:
                    return ImageLevel7
                case 8:
                    return ImageLevel8
                case 9:
                    return ImageLevel9
                case 10:
                    return ImageLevel10
                default:
                    return ImageLevel1
            }
        }
        return ImageLevel1
    }

    const onClickClaimReward = useCallback(
        async e => {
            e.preventDefault()
            try {
                const response = await RewardApi.claimReward({
                    type: 'daily quest',
                })
                if (response?.data?.value) {
                    dispatch(
                        reward_setOpenModalClaimReward({
                            open: true,
                            data: {
                                type: 'daily quest',
                                value: response?.data?.value,
                            },
                        })
                    )
                }
            } catch (e) {
                console.log('e', e)
            }
        },
        [openModalClaimReward]
    )

    return (
        <div className={`mb-3 FingoCardDailyXP FingoShapeRadius`}>
            <div
                className='FingoCardDailyXPImg'
                style={{
                    backgroundImage: `url('${getLevelImage(
                        user?.xp?.level ? parseInt(user.xp.level) : 0
                    )}')`,
                }}
            />
            <div className='FingoCardDailyXPHeader'>
                <h2 className='title mb-0'>Daily Quests</h2>
                {getDailyXp > 0 && !user.claimedGemsDailyQuest && (
                    <a href='#' onClick={onClickClaimReward} alt='claim reward'>
                        Claim Reward
                    </a>
                )}
            </div>
            <div className='FingoCardDailyXPInner'>
                <div className='left'>
                    <LightningIcon />
                </div>
                <div className='right'>
                    <div>
                        <p>Earn {getDailyXp} XP</p>
                    </div>
                    <div className='FingoCardDailyXPContent'>
                        <div className='progress'>
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
                                className='progress-bar bg-warning'
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
