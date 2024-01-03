import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useApp } from 'src/hooks'
import styled from 'styled-components'
import { ReactComponent as CloseIcon } from 'src/assets/svg/close.svg'

const StyledItem = styled.div`
    position: relative;
    color: #0070ff;
    background-color: #d6e5ff;
    height: 34px;
    width: 100%;
    transition: background-color 0.8s ease-out;
    margin-bottom: 0.75rem;
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

    &.dark {
        background-color: #0d64f0;
        color: #fbfbfb;
        &:hover {
            background-color: #1f5bba;
        }
    }
`

const DeleteBtn = styled.div`
    border: none;
    outline: none;
    padding: 0;
    height: 22px;
    width: 22px;
    border-radius: 22px;
    background-color: red;
    color: white;
    position: absolute;
    top: -8px;
    right: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default !important;
    svg {
        width: 16px;
        height: auto;
    }
`

const DraggableItem = ({ text, id, index, onDelete }) => {
    const { app_isDarkTheme } = useApp()
    return (
        <Draggable draggableId={id ?? text} index={index}>
            {provided => (
                <StyledItem
                    className={`${app_isDarkTheme ? 'dark' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <DeleteBtn onClick={onDelete}>
                        <CloseIcon />
                    </DeleteBtn>
                    {text}
                </StyledItem>
            )}
        </Draggable>
    )
}

export default DraggableItem
