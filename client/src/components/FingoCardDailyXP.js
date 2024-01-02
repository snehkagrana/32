/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useMemo } from 'react'
import { useAuth, usePersistedGuest, useReward } from 'src/hooks'
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
import dayjs from 'dayjs'

import { useDispatch } from 'react-redux'
import { RewardApi } from 'src/api'
import { DAILY_XP_TARGET } from 'src/constants'

const FingoCardDailyXP = () => {
    const today = new Date()
    const dispatch = useDispatch()
    const { openModalClaimReward, reward_setOpenModalClaimReward } = useReward()
    const { newUser, user, isAuthenticated } = useAuth()
    const { guest } = usePersistedGuest()

    const getDailyXp = useMemo(() => {
        if (isAuthenticated && user) {
            return user?.xp?.daily > 60 ? 60 : user?.xp?.daily || 0
        } else {
            return guest?.xp?.daily > 60 ? 60 : guest?.xp?.daily || 0
        }
    }, [isAuthenticated, guest, user])

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

    // prettier-ignore
    const isAbleToClaimDailyReward = useMemo(() => {
        if(isAuthenticated && user) {
            if(user?.xp?.daily >= DAILY_XP_TARGET) {
                if (!user?.lastClaimedGemsDailyQuest) {
                    return true
                } else if (dayjs(user.lastClaimedGemsDailyQuest).isBefore(dayjs(today).toISOString(), 'day') ) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
        else if(guest?._id) {
            if(guest?.xp?.daily >= DAILY_XP_TARGET) {
                if (!guest?.lastClaimedGemsDailyQuest) {
                    return true
                } else if (dayjs(guest.lastClaimedGemsDailyQuest).isBefore(dayjs(today).toISOString(), 'day') ) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
        else {
            return false;
        }
    }, [today, user, isAuthenticated, guest])

    // console.log("user?.lastClaimedGemsDailyQuest",user?.lastClaimedGemsDailyQuest)

    return (
        <div className={`FingoCardDailyXP FingoShapeRadius`}>
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
                {isAbleToClaimDailyReward && (
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
                        <p>Earn 60 bananas</p>
                    </div>
                    <div className='FingoCardDailyXPContent'>
                        <div className='progress'>
                            {newUser ? (
                                <div className='xp-count'>
                                    {Math.min(getDailyXp, 60) || 0}/60
                                </div>
                            ) : (
                                <div className='xp-count'>
                                    {Math.min(getDailyXp, 60) || 0}/60
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
