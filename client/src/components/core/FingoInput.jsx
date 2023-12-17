import React from 'react'
import { Form } from 'react-bootstrap'
import 'src/styles/FingoInput.styles.css'

export const FingoInput = props => {
    return (
        <Form.Control
            {...props}
            className={`FingoInput ${props.className || ''}`}
        />
    )
}
