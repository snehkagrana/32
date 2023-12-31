import { useCallback, useMemo } from 'react'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import 'src/styles/FingoCardTotalXP.styles.css'
import { ReactComponent as InfoIcon } from 'src/assets/svg/info.svg'
import { useDispatch } from 'react-redux'
import Assets from 'src/assets'
import { ReactComponent as BananaIcon } from 'src/assets/svg/banana-icon.svg'
import { getLevelColor, getProgressCurrentLevel } from 'src/utils'
import { LEVEL_THRESHOLDS } from 'src/constants'

const FingoCardTotalXP = () => {
    const { totalXP } = useApp()
    const { newUser, user, isAuthenticated } = useAuth()
    const { guest } = usePersistedGuest()
    const dispatch = useDispatch()

    const { openModalLevelUp, app_setModalLevelUp } = useApp()

    const getTotalXP = useMemo(() => {
        return newUser
            ? parseInt(sessionStorage.getItem('xp'), 10) || 0
            : totalXP
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser])

    const getLevelImage = level => {
        if (level) {
            if (level > 10) {
                return Assets.ImageLevel10
            }
            switch (level) {
                case 1:
                    return Assets.ImageLevel1
                case 2:
                    return Assets.ImageLevel2
                case 3:
                    return Assets.ImageLevel3
                case 4:
                    return Assets.ImageLevel4
                case 5:
                    return Assets.ImageLevel5
                case 6:
                    return Assets.ImageLevel6
                case 7:
                    return Assets.ImageLevel7
                case 8:
                    return Assets.ImageLevel8
                case 9:
                    return Assets.ImageLevel9
                case 10:
                    return Assets.ImageLevel10
                default:
                    return Assets.ImageLevel1
            }
        }
        return Assets.ImageLevel1
    }

    const onClickLevelInfo = useCallback(() => {
        dispatch(
            app_setModalLevelUp({
                open: true,
                data: isAuthenticated && user ? user?.xp : guest?.xp,
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalLevelUp, isAuthenticated, user, guest])

    const getNextTargetXp = useMemo(() => {
        if (isAuthenticated && user?.xp?.total) {
            const filteredLevels = LEVEL_THRESHOLDS.filter(
                x => x > parseInt(user.xp.total, 10)
            )
            return filteredLevels.length > 0 ? filteredLevels[0] : 0
        } else {
            const filteredLevels = LEVEL_THRESHOLDS.filter(
                x => x > parseInt(guest?.xp?.total, 10)
            )
            return filteredLevels.length > 0 ? filteredLevels[0] : 0
        }
    }, [isAuthenticated, user, guest])

    return (
        <div
            className={`FingoCardTotalXP FingoShapeRadius Level-${user?.xp?.level}`}
        >
            <div
                className='FingoCardTotalXPImg'
                style={{
                    backgroundImage: `url('${getLevelImage(
                        user?.xp?.level ? parseInt(user.xp.level) : 0
                    )}')`,
                }}
            />
            {/* <h2 className='title'>Total XP</h2> */}
            <div className='FingoCardTotalXPHeaderLevelContainer'>
                {!newUser && Boolean(user) ? (
                    <div
                        className='FingoCardTotalXPHeaderLevel'
                        style={{
                            backgroundColor: getLevelColor(
                                'default',
                                user?.xp?.level
                            ),
                        }}
                    >
                        <span>LEVEL {user?.xp?.level}</span>
                    </div>
                ) : (
                    <div
                        className='FingoCardTotalXPHeaderLevel'
                        style={{
                            backgroundColor: getLevelColor('default', 1),
                        }}
                    >
                        <span>LEVEL 1</span>
                    </div>
                )}
            </div>
            <div className='FingoCardTotalXPInner'>
                <div className='left'>
                    <BananaIcon />
                </div>
                <div className='right'>
                    <div className='xp-header'>
                        {isAuthenticated && Boolean(user) ? (
                            <p>
                                {user?.xp?.total} / {getNextTargetXp}{' '}
                            </p>
                        ) : (
                            <p>
                                {guest?.xp?.total} / {getNextTargetXp}{' '}
                            </p>
                        )}
                    </div>
                    <div className='FingoCardTotalXPContent'>
                        <div className='progress'>
                            {isAuthenticated && Boolean(user) ? (
                                <div
                                    className='progress-bar'
                                    role='progressbar'
                                    aria-valuenow={getTotalXP || 0}
                                    aria-valuemin='0'
                                    aria-valuemax='1000'
                                    style={{
                                        width: `${getProgressCurrentLevel(
                                            user?.xp?.total
                                                ? parseInt(user.xp.total)
                                                : 0
                                        )}%`,
                                        backgroundColor: getLevelColor(
                                            'default',
                                            user?.xp?.level
                                        ),
                                    }}
                                />
                            ) : (
                                <div
                                    className='progress-bar'
                                    role='progressbar'
                                    aria-valuenow={getTotalXP || 0}
                                    aria-valuemin='0'
                                    aria-valuemax='1000'
                                    style={{
                                        width: `${getProgressCurrentLevel(
                                            guest?.xp?.total
                                                ? parseInt(guest.xp.total)
                                                : 0
                                        )}%`,
                                        backgroundColor: getLevelColor(
                                            'default',
                                            1
                                        ),
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button className='FingoIconButton' onClick={onClickLevelInfo}>
                <InfoIcon />
            </button>
        </div>
    )
}

export default FingoCardTotalXP
