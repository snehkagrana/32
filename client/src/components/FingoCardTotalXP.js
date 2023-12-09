import { useMemo } from 'react'
import { useApp, useAuth } from 'src/hooks'
import 'src/styles/FingoCardTotalXP.styles.css'
import { ReactComponent as LightningIcon } from 'src/assets/svg/lightning-fill.svg'
import TreasureImg from 'src/assets/images/ic_treasure.png'

const FingoCardTotalXP = () => {
    const { totalXP } = useApp()
    const { newUser } = useAuth()

    const getTotalXP = useMemo(() => {
        return newUser
            ? parseInt(sessionStorage.getItem('xp'), 10) || 0
            : totalXP
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser])

    return (
        <div className={`mb-6 FingoCardTotalXP FingoShapeRadius`}>
            <h2 className='title'>Total XP</h2>
            <div className='FingoCardTotalXPInner'>
                <div className='left'>
                    <div className='FingoCardTotalXPLevel text-center'>
                        <h4>Lvl</h4>
                        <h4>1</h4>
                    </div>
                </div>
                <div className='right'>
                    <div className='xp-header'>
                        <p>Total XP / Next Target</p>
                    </div>
                    <div className='FingoCardTotalXPContent'>
                        <div class='progress'>
                            <div
                                class='progress-bar bg-success'
                                role='progressbar'
                                aria-valuenow={getTotalXP || 0}
                                aria-valuemin='0'
                                aria-valuemax='1000'
                                style={{width: '50%'}}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FingoCardTotalXP
