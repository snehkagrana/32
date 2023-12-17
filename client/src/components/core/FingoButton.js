import React from 'react'
import 'src/styles/FingoButton.styles.css'
import { Button } from 'react-bootstrap'

/**
 *
 * Color
 * 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'white' | 'muted';
 */

export const FingoButton = props => {
    return (
        <Button
            {...props}
            className={`FingoButton ${props.color} ${props.className || ''}`}
            onClick={props.onClick}
        >
            {props.children}
        </Button>
    )
}

FingoButton.defaultProps = {
    color: 'primary',
}
