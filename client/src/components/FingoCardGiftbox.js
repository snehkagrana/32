/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useMemo } from 'react'
import { useApp, useAuth, useReward } from 'src/hooks'
import { useDispatch } from 'react-redux'
import { ReactComponent as InfoIcon } from 'src/assets/svg/outline-history.svg'
import { ReactComponent as QuestionSvg } from 'src/assets/svg/question-circle.svg'
import GiftboxImg from 'src/assets/images/giftbox.png'
import toast from 'react-hot-toast'
import 'src/styles/FingoCardGiftbox.styles.css'

const FingoCardGiftbox = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()
    const { app_setOpenModalHowToEarnDiamond } = useApp()
    const { reward_setOpenModalListReward, openModalListReward } = useReward()

    const getText = useMemo(() => {
        if (user?.diamond) {
            if (user?.diamond < 50) {
                return `Earn ${50 - user.diamond} more Gems to claim your Gift`
            } else {
                return ''
            }
        } else return 'Earn 50 Gems to claim your gift'
    }, [user])

    const onClickCard = useCallback(() => {
        dispatch(reward_setOpenModalListReward(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListReward])

    const notify = () => toast.success('Comming soon.')

    const onClickMyRedeem = e => {
        e.stopPropagation()
        notify()
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
                <button className='HistoryBtn' onClick={onClickMyRedeem}>
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
                        <p className='mb-0 text-center'>{getText}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FingoCardGiftbox
