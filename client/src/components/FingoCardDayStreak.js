/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo } from 'react'
import { useAuth } from 'src/hooks'

import Fire from 'src/assets/images/fire.png'
import FireOn from 'src/assets/images/fire-on.png'

import 'src/styles/FingoCardDayStreak.styles.css'

const FingoCardDayStreak = () => {
    const { user, newUser } = useAuth()

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]

    const now = new Date()
    const todayDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    const year = todayDate.getUTCFullYear()
    const month = todayDate.getUTCMonth()
    const day = todayDate.getUTCDate()

    const today = new Date(Date.UTC(year, month, day))

    const dayOfWeek = (today.getDay() + 6) % 7

    const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - dayOfWeek
    )

    const getStreakMessage = useMemo(() => {
        if (user?.streak > 0) {
            if (user.streak > 1) {
                return 'You extended your streak before 50.54% of all learners yesterday!'
            } else {
                return 'Keep going. Complete one more lesson!'
            }
        } else return 'Do a lesson today to start a new steaks!'
    }, [user])

    const onClick = e => {
        e.preventDefault()
        // do nothing
    }

    const renderSvg = () => (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='#fff'
        >
            <path
                fill='#fff'
                d='M7.3 14.2L.2 9l1.7-2.4l4.8 3.5l6.6-8.5l2.3 1.8z'
            />
        </svg>
    )

    return (
        <div
            className={`mb-3 FingoCardDayStreak FingoShapeRadius ${
                user?.streak > 0 ? 'highlight' : ''
            }`}
        >
            <div className='col-12 FingoCardDayStreakInner'>
                <div className='left FingoCardDayStreakImg'>
                    <img
                        src={user?.streak > 0 ? FireOn : Fire}
                        alt='Fire icon'
                    />
                </div>
                <div className='right'>
                    <h4>{user?.streak ?? 0} day streak</h4>
                    <p>{getStreakMessage}</p>
                </div>
            </div>
            <div className='FingoCardDayStreakCalendar FingoShapeRadius'>
                <ul>
                    {days.map((day, index) => (
                        <li key={String(index)}>
                            <p className={index === dayOfWeek ? 'active' : ''}>
                                {day[0]}
                            </p>
                            <a
                                className={
                                    index === dayOfWeek
                                        ? 'active'
                                        : index === dayOfWeek &&
                                            newUser &&
                                            parseInt(
                                                sessionStorage.getItem(
                                                    'streak'
                                                ),
                                                10
                                            )
                                          ? 'active'
                                          : user &&
                                              user?.completedDays &&
                                              user?.completedDays?.[index] &&
                                              new Date(
                                                  user.completedDays[index]
                                              ) >= startOfWeek &&
                                              new Date(
                                                  user.completedDays[index]
                                              ) <= today
                                            ? 'active'
                                            : ' '
                                }
                                href='#'
                                onClick={onClick}
                            >
                                {index === dayOfWeek && renderSvg()}
                                {Boolean(index === dayOfWeek &&
                                    newUser &&
                                    parseInt(
                                        sessionStorage.getItem('streak'),
                                        10
                                    )) &&
                                    renderSvg()}
                                {!newUser &&
                                user &&
                                user?.completedDays &&
                                user?.completedDays?.[index] &&
                                new Date(user.completedDays[index]) >=
                                    startOfWeek &&
                                new Date(user.completedDays[index]) <= today
                                    ? renderSvg()
                                    : ' '}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FingoCardDayStreak
