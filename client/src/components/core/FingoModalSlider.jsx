import React, { Fragment } from 'react'
import 'src/styles/FingoModal.styles.css'
import { breakpoints } from 'src/utils/breakpoints.util'
import { Modal as BootstrapModal } from 'react-bootstrap'
import styled from 'styled-components'

export const FingoModalSlider = props => {
    const { open, onClose, width, children, showCloseButton, rest } = props
    return (
        <Fragment>
            {open && <FingoBackdrop onClick={onClose} />}
            <RootFingoModalSlider
                {...rest}
                style={{ width: width || '100%' }}
                $isOpen={open}
                $width={width}
                className={`FingoModalSlider-${open ? 'open' : ''}`}
            >
                {open && showCloseButton && (
                    <button className='FingoModalSlideClose' onClick={onClose}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1em'
                            height='1em'
                            viewBox='0 0 24 24'
                        >
                            <path
                                fill='currentColor'
                                d='M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z'
                            ></path>
                        </svg>
                    </button>
                )}
                <div className='FingoShapeRadius FingoBackgroundColor'>
                    {children}
                </div>
            </RootFingoModalSlider>
        </Fragment>
    )
}

const RootFingoModalSlider = styled.div`
    position: fixed;
    z-index: 1051;
    top: 0;
    transition: all 0.25s;
    opacity: 0;
    right: ${props => (props.$isOpen ? '0%' : '-100%')};
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    @media screen and (min-width: ${breakpoints.md}) {
        right: ${props => (props.$isOpen ? '0px' : '-' + props.$width + 'px')};
    }

    /* .FingoShapeRadius {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    } */

    .FingoModalSlideClose {
        width: 36px;
        height: 36px;
        border-radius: 36px;
        border: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        position: absolute;
        top: 20px;
        left: -18px;
        background: #ff4141;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px;
        color: #fff;
        z-index: 1001;
        margin: 0;
        padding: 0;
        svg {
            font-size: 22px;
        }
    }
`

const FingoBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.4;
`

FingoModalSlider.defaultProps = {
    showCloseButton: true,
    width: 300,
}
