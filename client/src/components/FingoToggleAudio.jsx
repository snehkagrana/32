import React from 'react'
import { ReactComponent as VolumeMute } from 'src/assets/svg/volume-off-fill.svg'
import { ReactComponent as VolumeOn } from 'src/assets/svg/volume-up-fill.svg'
import 'src/styles/FingoToggleAudio.styles.css'

export const FingoToggleAudio = props => {
    const { label, active, onChange, className } = props
    return (
        <div className={`FingoToggleAudio ${className ? className : ''}`}>
            <button onClick={onChange}>
                {active ? <VolumeOn /> : <VolumeMute />}
            </button>
            {/* <p onClick={onChange}>{label}</p> */}
        </div>
    )
}
