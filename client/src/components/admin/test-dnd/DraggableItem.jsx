import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const StyledItem = styled.div`
    color: #0070ff;
    background-color: #d6e5ff;
    height: 34px;
    width: 100%;
    transition: background-color 0.8s ease-out;
    margin-bottom: 0.5rem;
    border-radius: 0.3rem;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: #b0c5e9;
        transition: background-color 0.1s ease-in;
    }
`

const DraggableItem = ({ text, index }) => {
    return (
        <Draggable draggableId={text} index={index}>
            {provided => (
                <StyledItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {text}
                </StyledItem>
            )}
        </Draggable>
    )
}

export default DraggableItem
