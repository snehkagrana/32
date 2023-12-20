import React from 'react'
import Select from 'react-select'
import 'src/styles/FingoSelect.styles.css'

export const FingoSelect = props => {
    return (
        <Select {...props} className={`FingoSelect ${props.className || ''}`} />
    )
}
