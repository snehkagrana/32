import React from 'react'
import 'src/styles/FingoButton.styles.css'
import { Button } from 'react-bootstrap'

/**
 *
 * Color
 * 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'white' | 'muted';
 */

const renderLoadingIcon = size => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
    >
        <path
            fill='none'
            stroke='currentColor'
            stroke-dasharray='15'
            stroke-dashoffset='15'
            stroke-linecap='round'
            stroke-width='2'
            d='M12 3C16.9706 3 21 7.02944 21 12'
        >
            <animate
                fill='freeze'
                attributeName='stroke-dashoffset'
                dur='0.2s'
                values='15;0'
            />
            <animateTransform
                attributeName='transform'
                dur='1s'
                repeatCount='indefinite'
                type='rotate'
                values='0 12 12;360 12 12'
            />
        </path>
    </svg>
)

export const FingoButton = props => {
    const { isLoading, color, className, enableHoverEffect } = props
    return (
        <Button
            {...props}
            className={`FingoButton ${color ?? 'primary'} ${className || ''} ${
                enableHoverEffect ? 'HoverEffect' : ''
            }`}
            onClick={props.onClick}
        >
            {isLoading ? (
                <div className='BtnLoadingWrapper'>{renderLoadingIcon(24)}</div>
            ) : (
                props.children
            )}
        </Button>
    )
}

FingoButton.defaultProps = {
    color: 'primary',
    enableHoverEffect: true,
}
