/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo } from 'react'
import { ArrowContainer, Popover as ReactTinyPopover } from 'react-tiny-popover'
import { useApp, useMediaQuery } from 'src/hooks'

export const Popover = props => {
    const { renderContent, children, ...rest } = props
    const { app_isDarkTheme } = useApp()
    const matchMobile = useMediaQuery('(max-width: 576px)')

    const width = useMemo(() => {
        return matchMobile ? window.innerWidth - 20 : 'auto'
    }, [matchMobile])

    const arrowColor = useMemo(() => {
        return app_isDarkTheme ? '#616161' : '#e8e8e8'
    }, [app_isDarkTheme])

    return (
        <ReactTinyPopover
            padding={10}
            reposition={true}
            content={({ position, childRect, popoverRect }) => (
                <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowSize={10}
                    className='PopoverArrowContainer'
                    arrowClassName='PopoverArrow'
                    arrowColor={arrowColor}
                >
                    <div
                        className='PopoverContentContainer FingoShapeRadius FingoBorders'
                        style={{ width }}
                    >
                        {renderContent}
                    </div>
                </ArrowContainer>
            )}
            {...rest}
        >
            {children}
        </ReactTinyPopover>
    )
}
