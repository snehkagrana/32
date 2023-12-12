import { useApp } from 'src/hooks'
import { FingoModal } from './core'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import Assets from 'src/assets'

const FingoModalLevelUp = () => {
    const dispatch = useDispatch()
    const { modalLevelUp, app_setModalLevelUp } = useApp()

    const onClose = useCallback(() => {
        dispatch(app_setModalLevelUp({ open: false, data: null }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalLevelUp])

    const getLevelImage = level => {
        if (level) {
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

    return (
        <FingoModal open={modalLevelUp.open} onClose={onClose}>
            <img
                src={getLevelImage(modalLevelUp?.data?.level ?? 0)}
                alt='Level'
            />
        </FingoModal>
    )
}

export default FingoModalLevelUp
