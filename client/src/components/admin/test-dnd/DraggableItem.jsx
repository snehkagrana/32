import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useApp } from 'src/hooks'
import styled from 'styled-components'
import { ReactComponent as CloseIcon } from 'src/assets/svg/close.svg'

const StyledItem = styled.div`
    position: relative;
    width: 100%;
    transition: background-color 0.5s ease-out;
    margin-bottom: 0.75rem;
    user-select: none;

    .StyledItemInner {
        color: #0070ff;
        background-color: #d6e5ff;
        height: 42px;
        text-align: center;
        font-weight: 700;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.4rem;
        border-color: rgb(10 127 255);
        box-shadow: rgb(162 195 229) 0px 3px 0px 1px;
        &:hover {
            background-color: #b0c5e9;
            transition: background-color 0.2s ease-in;
            .DeleteBtn {
                transform: scale(1);
            }
        }
        &.isDragging {
            background-color: #c1d8ff;
            transform: rotate(-2deg) !important;
            border-color: rgb(10 127 255);
            box-shadow: rgb(84 148 215) 0px 3px 0px 1px;
        }
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
    transition: all 0.2s;
    transform: scale(0);
    svg {
        width: 16px;
        height: auto;
    }
`

const DraggableItem = ({ text, id, index, onDelete }) => {
    const { app_isDarkTheme } = useApp()
    return (
        <Draggable draggableId={id ?? text} index={index}>
            {(provided, snapshot) => {
                // console.log('snapshot', snapshot)
                return (
                    <StyledItem
                        className={`${app_isDarkTheme ? 'dark' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div
                            className={`StyledItemInner ${
                                snapshot.isDragging ? 'isDragging' : ''
                            }`}
                        >
                            <DeleteBtn className='DeleteBtn' onClick={onDelete}>
                                <CloseIcon />
                            </DeleteBtn>
                            {text}
                        </div>
                    </StyledItem>
                )
            }}
        </Draggable>
    )
}

export default DraggableItem
