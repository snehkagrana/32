import React from 'react'

export const FingoCard = ({ children, className }) => {
    return (
        <div
            className={`FingoShapeRadius FingoBorders overflow-hidden ${
                className ?? ''
            }`}
        >
            {children}
        </div>
    )
}
