import React from 'react'
import { useCountdown } from 'src/hooks'
import 'src/styles/CountdownTimer.styles.css'

const CountdownCounterTime = ({ value }) => {
    return (
        <div className='CountdownCounterTime'>
            <span>{value}</span>
        </div>
    )
}

const CountdownCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className='CountdownCounter'>
            <div className='CountdownCounterItem'>
                <CountdownCounterTime
                    value={String(days).length === 1 ? String(0) + days : days}
                />
                <p className='CountdownCounterItemLabel'>days</p>
            </div>
            <span className='CountdownCounterSeparator'>:</span>
            <div className='CountdownCounterItem'>
                <CountdownCounterTime value={hours} />
                <p className='CountdownCounterItemLabel'>hours</p>
            </div>
            <span className='CountdownCounterSeparator'>:</span>
            <div className='CountdownCounterItem'>
                <CountdownCounterTime value={minutes} />
                <p className='CountdownCounterItemLabel'>minutes</p>
            </div>
            <span className='CountdownCounterSeparator'>:</span>
            <div className='CountdownCounterItem'>
                <CountdownCounterTime value={seconds} />
                <p className='CountdownCounterItemLabel'>seconds</p>
            </div>
        </div>
    )
}

const CountdownTimer = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate)
    if (days + hours + minutes + seconds <= 0) {
        return null // expire
    } else {
        return (
            <CountdownCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        )
    }
}

export default CountdownTimer
