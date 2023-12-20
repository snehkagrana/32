/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useMemo } from 'react'
import { useApp, useAuth, useReward } from 'src/hooks'
import { useDispatch } from 'react-redux'
import { ReactComponent as InfoIcon } from 'src/assets/svg/outline-history.svg'
import { ReactComponent as QuestionSvg } from 'src/assets/svg/question-circle.svg'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import GiftboxImg from 'src/assets/images/giftbox.png'
import 'src/styles/FingoCardGiftbox.styles.css'

const FingoCardGiftbox = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()
    const { app_setOpenModalHowToEarnDiamond } = useApp()
    const {
        reward_setOpenModalListReward,
        openModalListReward,
        reward_setOpenModalListMyReward,
    } = useReward()

    const onClickCard = useCallback(() => {
        dispatch(reward_setOpenModalListReward(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListReward])

    const onClickMyRedeemHistory = e => {
        e.stopPropagation()
        dispatch(reward_setOpenModalListMyReward(true))
    }

    const onClickQuestionBtn = e => {
        e.stopPropagation()
        dispatch(app_setOpenModalHowToEarnDiamond(true))
    }

    return (
        <div
            className={`mb-3 FingoCardGiftbox FingoShapeRadius`}
            onClick={onClickCard}
        >
            <div className='HeaderBtn'>
                <button className='QuestionBtn' onClick={onClickQuestionBtn}>
                    <QuestionSvg />
                </button>
                <button className='HistoryBtn' onClick={onClickMyRedeemHistory}>
                    <InfoIcon />
                    <p>My Rewards</p>
                </button>
            </div>
            <div className='FingoCardGiftboxImg'>
                <img src={GiftboxImg} alt='giftbox img' />
            </div>
            <div className='FingoCardGiftboxContent'>
                {user?.diamond >= 50 ? (
                    <a href='#' className='font-bold'>
                        Claim your Gift Card
                    </a>
                ) : (
                    <div className='text-center'>
                        {user?.diamond < 50 ? (
                            <p className='mb-0 text-center'>
                                Earn {50 - user.diamond} more <DiamondSvg /> to
                                claim your Gift
                            </p>
                        ) : (
                            <p className='mb-0 text-center'>
                                Earn 50 <DiamondSvg /> to claim your gift
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FingoCardGiftbox
