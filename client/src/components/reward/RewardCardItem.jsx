import Card from 'react-bootstrap/Card'

const RewardCardItem = props => {
    const { name } = props.data

    if (props.data) {
        return (
            <Card className='FingoShapeRadius overflow-hidden'>
                <Card.Img variant='top' src='' />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                </Card.Body>
            </Card>
        )
    }

    return null
}

export default RewardCardItem
