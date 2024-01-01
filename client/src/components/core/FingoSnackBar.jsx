import React, { useMemo } from 'react'
import { ReactComponent as SuccessIcon } from 'src/assets/svg/seal-check-fill.svg'
import { ReactComponent as WarningIcon } from 'src/assets/svg/brightness-alert-rounded.svg'
import { ReactComponent as ErrorIcon } from 'src/assets/svg/error-fill.svg'

export const FingoSnackBar = ({
    severity,
    text,
    className,
    enableCloseButton,
}) => {
    const getClassName = useMemo(() => {
        if (severity === 'success') {
            return 'FingoSnackBarSuccess'
        } else if (severity === 'warning') {
            return 'FingoSnackBarWarning'
        } else {
            return 'FingoSnackBarError'
        }
    }, [severity])

    return (
        <div
            className={`FingoSnackBar FingoShapeRadius FingoBorders ${getClassName} ${
                className ?? ''
            }`}
        >
            {severity === 'success' && <SuccessIcon />}
            {severity === 'warning' && <WarningIcon />}
            {severity === 'error' && <ErrorIcon />}
            <p className='mb-0'>{text}</p>
            {enableCloseButton && (
                <button className='FingoSnackBarCloseBtn'>x</button>
            )}
        </div>
    )
}

FingoSnackBar.defaultProps = {
    enableCloseButton: true,
}
