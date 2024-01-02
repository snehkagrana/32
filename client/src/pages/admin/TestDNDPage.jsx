import React, { useCallback, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import DraggableSection from 'src/components/admin/test-dnd/DraggableSection'
import styled from 'styled-components'
import { FingoButton, FingoInput } from 'src/components/core'
import { ReactComponent as AddSvg } from 'src/assets/svg/add.svg'
import DraggableItem from 'src/components/admin/test-dnd/DraggableItem'

const Container = styled.div`
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-wrap: nowrap;
`

const DraggableWrapper = styled.div`
    width: 440px;
    padding: 1.2rem;
`

const DraggableHeader = styled.div`
    margin-bottom: 1rem;
    h2 {
        font-size: 1.6rem;
        font-weight: 700;
    }
    h4 {
        font-size: 1.2rem;
        font-weight: 700;
    }
`

const DroppablePlaceContainer = styled.div`
    display: block;
    position: relative;

    .DroppablePlaceItem-1 {
        transform: translate(220px, -200px);
    }

    .DroppablePlaceItem-2 {
        transform: translate(0px, -180px);
    }

    .DroppablePlaceItem-3 {
        transform: translate(220px, -380px);
    }
`

const StyledDroppablePlaceItem = styled.div`
    padding: 1rem;
    width: 200px;
    min-height: 200px;
    border-radius: 0.3rem;
    background-color: #f6fff7;
    border: 1px solid #9ecfab;
`

const FormWrapper = styled.div`
    width: 320px;
    padding: 1.2rem;
`

const InputGroup = styled.div`
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 1.2rem;
`

const ItemContainer = styled.div`
    width: 170px;
`

const FormFooter = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
`

const Button = styled.button`
    position: absolute;
    top: 3px;
    right: 3px;
    border: none;
    outline: 0;
    padding: 0;
    width: 50px;
    height: 37px;
    background-color: #007bff;
    color: #fff;
    border-radius: 8px;
    svg {
        width: 22px;
        height: auto;
    }
`

const TITLE = 'Label The Candlestick'

function makeId(length) {
    let result = ''
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
        counter += 1
    }
    return result
}

const TestDNDPage = () => {
    const [inputValue, setInputValue] = useState('')
    const [values, setValues] = useState([])

    const [availableValues, setAvailableValues] = useState([
        {
            id: 'b8535264-ab2b-4a3e-96b3-30c0dbb95e39',
            label: 'Hight',
        },
        {
            id: 'aa0a3233-d95e-411a-a4d5-410331dc5670',
            label: 'Close',
        },
        {
            id: '26be1540-967e-4490-a8c8-cffab40d365f',
            label: 'Open',
        },
        {
            id: '56721605-682b-4b4e-94fa-5b22228109eb',
            label: 'Low',
        },
    ])

    const [draggablePlaces, setDraggablePlaces] = useState([
        {
            id: 'place1',
            items: [],
        },
        {
            id: 'place2',
            items: [],
        },
        {
            id: 'place3',
            items: [],
        },
        {
            id: 'place4',
            items: [],
        },
    ])

    console.log('draggablePlaces', draggablePlaces)

    const onChange = e => {
        setInputValue(e.target.value)
    }

    const onClickAdd = useCallback(() => {
        if (inputValue) {
            setAvailableValues([
                ...availableValues,
                {
                    id: makeId(5),
                    label: inputValue,
                },
            ])
            setInputValue('')
        }
    }, [inputValue, availableValues])

    // console.log('values ->', values)

    const initialColumns = {
        todo: {
            id: 'todo',
            list: ['item 1', 'item 2', 'item 3'],
        },
        doing: {
            id: 'doing',
            list: [],
        },
        done: {
            id: 'done',
            list: [],
        },
    }
    const [columns, setColumns] = useState(initialColumns)

    const onDragEnd = ({ source, destination }) => {
        // Make sure we have a valid destination
        if (destination === undefined || destination === null) return null

        // Make sure we're actually moving the item
        // prettier-ignore
        if (source.droppableId === destination.droppableId && destination.index === source.index) {
            return null
        }

        const movedIndex = source.index

        let movedItem = null

        if (source.droppableId === 'initialPlace') {
            movedItem = availableValues.find((_, index) => index === movedIndex)
            setAvailableValues(
                availableValues.filter((_, index) => index !== movedIndex)
            )
        } else if (source.droppableId) {
            const sourceArr = draggablePlaces.find(
                x => x.id === source.droppableId
            )
            if (sourceArr?.items?.length > 0) {
                movedItem = sourceArr.items.find(
                    (_, index) => index === movedIndex
                )
            }
        }

        console.log('movedItem', movedItem)
        console.log('destination', destination)

        if (destination.droppableId !== 'initialPlace') {
            const targetPlace = draggablePlaces.find(
                x => x.id === destination.droppableId
            )

            const draggablePlaceIndex = draggablePlaces.findIndex(
                x => x.id === destination.droppableId
            )

            const updatedTargetPlace = {
                ...targetPlace,
                items: [...targetPlace.items, movedItem],
            }
            console.log('movedIndex', movedIndex)
            console.log('targetPlace', targetPlace)
            console.log('updatedTargetPlace', updatedTargetPlace)

            // make final new array of objects by combining updated object.
            const updatedDraggablePlaces = [
                ...draggablePlaces.slice(0, draggablePlaceIndex),
                updatedTargetPlace,
                ...draggablePlaces.slice(draggablePlaceIndex + 1),
            ]

            // Set draggable places
            setDraggablePlaces(updatedDraggablePlaces)

            // Remove from source
        }

        // console.log('source.droppableId', source.droppableId)
        // console.log('destination.droppableId', destination.droppableId)

        // const _destination =
        // Set start and end variables
        // const start = columns[source.droppableId]
        // const end = columns[destination.droppableId]

        // If start is the same as end, we're in the same column
        // if (start === end) {
        //     // Move the item within the list
        //     // Start by making a new list without the dragged item
        //     const newList = start.list.filter((_, idx) => idx !== source.index)

        //     // Then insert the item at the right location
        //     newList.splice(destination.index, 0, start.list[source.index])

        //     // Then create a new copy of the column object
        //     const newCol = {
        //         id: start.id,
        //         list: newList,
        //     }

        //     // Update the state
        //     setColumns(state => ({ ...state, [newCol.id]: newCol }))
        //     return null
        // } else {
        //     // If start is different from end, we need to update multiple columns
        //     // Filter the start list like before
        //     const newStartList = start.list.filter(
        //         (_, idx) => idx !== source.index
        //     )

        //     // Create a new start column
        //     const newStartCol = {
        //         id: start.id,
        //         list: newStartList,
        //     }

        //     // Make a new end list array
        //     const newEndList = end.list

        //     // Insert the item into the end list
        //     newEndList.splice(destination.index, 0, start.list[source.index])

        //     // Create a new end column
        //     const newEndCol = {
        //         id: end.id,
        //         list: newEndList,
        //     }

        //     console.log("newStartCol,", newStartCol)
        //     console.log("newEndCol,", newEndCol)

        //     // Update the state
        //     // setColumns(state => ({
        //     //     ...state,
        //     //     [newStartCol.id]: newStartCol,
        //     //     [newEndCol.id]: newEndCol,
        //     // }))
        //     return null
        // }
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Reward</title>
            </Helmet>
            <DragDropContext onDragEnd={onDragEnd}>
                <Container>
                    <FormWrapper>
                        <InputGroup>
                            <FingoInput
                                size='lg'
                                name='value'
                                value={inputValue}
                                onChange={onChange}
                                placeholder='Input value...'
                            />
                            <Button onClick={onClickAdd} type='button'>
                                <AddSvg />
                                {/* <span>Add</span> */}
                            </Button>
                        </InputGroup>

                        <Droppable droppableId='initialPlace'>
                            {provided => (
                                <ItemContainer
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {availableValues.map((x, index) => (
                                        <DraggableItem
                                            key={x.id}
                                            text={x.label}
                                            index={index}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ItemContainer>
                            )}
                        </Droppable>

                        {availableValues.length === 0 && (
                            <FingoButton enableHoverEffect={false}>
                                Add More
                            </FingoButton>
                        )}
                    </FormWrapper>

                    <DraggableWrapper>
                        <DraggableHeader>
                            <h2 className='text-center mb-2'>{TITLE}</h2>
                            <h4 className='text-center mb-0'>Drag and Drop</h4>
                        </DraggableHeader>

                        <DroppablePlaceContainer>
                            {draggablePlaces.map((x, index) => (
                                <Droppable
                                    key={x.id + index}
                                    droppableId={x.id}
                                >
                                    {provided => (
                                        <StyledDroppablePlaceItem
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`DroppablePlaceItem-${index}`}
                                        >
                                            {x.items.length > 0 &&
                                                x.items.map((x, index) => (
                                                    <DraggableItem
                                                        key={x.id}
                                                        text={x.label}
                                                        index={index}
                                                    />
                                                ))}
                                            {provided.placeholder}
                                        </StyledDroppablePlaceItem>
                                    )}
                                </Droppable>
                            ))}
                        </DroppablePlaceContainer>
                    </DraggableWrapper>
                </Container>
            </DragDropContext>
            <FormFooter>
                {availableValues.length === 0 && (
                    <FingoButton enableHoverEffect={false}>Submit</FingoButton>
                )}
            </FormFooter>
        </FingoHomeLayout>
    )
}

export default TestDNDPage
