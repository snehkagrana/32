import React from 'react'
import 'src/styles/FingoSwitch.styles.css'

export const FingoSwitch = props => {
    const { label, id, checked, onChange, className } = props
    return (
        <div className={`FingoSwitch ${className ? className : ''}`}>
            <input
                id={id}
                type='checkbox'
                checked={checked}
                onChange={onChange}
            />
            <label onClick={onChange} for={id}>
                {label}
            </label>
            <p onClick={onChange}>{label}</p>
        </div>
    )
}
