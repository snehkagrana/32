import React from 'react'
import DraggableItem from './DraggableItem'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const StyledColumn = styled.div``
const StyledList = styled.div``

const DraggableSection = ({ col: { list, id } }) => {
    return (
        <Droppable droppableId={id}>
            {provided => (
                <StyledColumn>
                    <h2>{id}</h2>
                    <StyledList
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {list.map((text, index) => (
                            <DraggableItem key={text} text={text} index={index} />
                        ))}
                        {provided.placeholder}
                    </StyledList>
                </StyledColumn>
            )}
        </Droppable>
    )
}

export default DraggableSection
