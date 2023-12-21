/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useApp } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import { ReactComponent as QuestionCircleSvg } from 'src/assets/svg/question-circle.svg'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import 'src/styles/ModalInfoEarnDiamond.styles.css'

const ITEMS = [
    'Learn more lessons.',
    'Answer the quizzes correctly.',
    'Complete daily quests.',
]

const ModalInfoEarnDiamond = () => {
    const dispatch = useDispatch()

    const { openModalHowToEarnDiamond, app_setOpenModalHowToEarnDiamond } =
        useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalHowToEarnDiamond(false))
    }

    return (
        <FingoModal
            open={openModalHowToEarnDiamond}
            onClose={handleCloseModal}
            centered
            className='ModalInfoEarnDiamond'
        >
            <div className='InfoEarnDiamondContainer FingoShapeRadius'>
                <div className='HowToEarnDiamondHeader'>
                    <QuestionCircleSvg className='questionIcon' />
                    <div>
                        <h6 className='mb-0'>
                            How to earn more <DiamondSvg /> ?
                        </h6>
                    </div>
                </div>
                <div className='mb-2'>
                    <div className='HowToEarnDiamondContent mt-2'>
                        {ITEMS.map((x, index) => (
                            <div
                                className='item relative mb-4'
                                key={String(index)}
                            >
                                <div className='num'>{index + 1}</div>
                                <p className='mb-0'>{x}</p>
                            </div>
                        ))}
                        <FingoButton color='primary' className='w-100 mb-2' onClick={handleCloseModal}>
                            Continue
                        </FingoButton>
                    </div>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalInfoEarnDiamond
