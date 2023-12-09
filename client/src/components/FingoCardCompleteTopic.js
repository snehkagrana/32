import { useApp, useAuth } from 'src/hooks'
import { Card } from 'react-bootstrap'
import 'src/styles/FingoCardCompleteTopic.styles.css'

const FingoCardCompleteTopic = () => {
    const { skills } = useApp()
    const { user, newUser } = useAuth()

    const storedScores = newUser
        ? JSON.parse(sessionStorage.getItem('scores')) || []
        : user
          ? user.score
          : []

    const chapterCompleted = storedScores.length
    const storedLastPlayed = newUser
        ? JSON.parse(sessionStorage.getItem('lastPlayed')) || null
        : null

    let subTopicsCompleted = 0
    let lastSkillPercent = 0

    if (newUser && skills.length) {
        skills.forEach(skill => {
            skill.categories.forEach(category => {
                const chaptersCount = skill.sub_categories.filter(
                    s => s.category === category
                ).length
                const userChaptersCount = storedScores.filter(
                    i => i.skill === skill.skill && i.category === category
                ).length

                if (
                    chaptersCount === userChaptersCount &&
                    chaptersCount !== 0
                ) {
                    subTopicsCompleted++
                }
            })
        })

        if (storedLastPlayed && storedLastPlayed.skill) {
            const lastAllSubCategories = skills.find(
                s => s.skill === storedLastPlayed.skill
            ).sub_categories.length
            const userLastSubCategories = storedScores.filter(
                s => s.skill === storedLastPlayed.skill
            ).length
            lastSkillPercent = Math.round(
                (userLastSubCategories / lastAllSubCategories) * 100
            )
        }
    } else if (user && skills.length) {
        skills.forEach(skill => {
            skill.categories.forEach(category => {
                const chaptersCount = skill.sub_categories.filter(
                    s => s.category === category
                ).length
                const userChaptersCount = user.score.filter(
                    i => i.skill === skill.skill && i.category === category
                ).length

                if (
                    chaptersCount === userChaptersCount &&
                    chaptersCount !== 0
                ) {
                    subTopicsCompleted++
                }
            })
        })

        if (user?.last_played && user?.last_played?.skill) {
            const lastAllSubCategories = skills.find(
                s => s.skill === user.last_played.skill
            ).sub_categories.length
            const userLastSubCategories = user.score.filter(
                s => s.skill === user.last_played.skill
            ).length
            lastSkillPercent = Math.round(
                (userLastSubCategories / lastAllSubCategories) * 100
            )
        }
    }

    return (
        <div className={`mb-6 FingoCardCompleteTopic FingoShapeRadius`}>
            <Card.Body className='d-flex flex-row align-items-center justify-content-around p-0'>
                <div className='xp-completed completed-1'>
                    <div className='xp-header'>
                        <span className='xp-name'>Chapter completed</span>
                    </div>
                    <div className='xp-count'>{chapterCompleted}</div>
                </div>
                <div className='divider-v' />
                <div className='xp-completed completed-2'>
                    <div className='xp-header'>
                        <span className='xp-name'>Sub-Topic completed</span>
                    </div>
                    <div className='xp-count'>{subTopicsCompleted}</div>
                </div>
            </Card.Body>
        </div>
    )
}

export default FingoCardCompleteTopic
