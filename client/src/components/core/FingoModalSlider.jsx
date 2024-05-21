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
                    <button className='FingoModalClose' onClick={onClose}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1024'
                            height='1024'
                            viewBox='0 0 1024 1024'
                        >
                            <path
                                fill='currentColor'
                                d='M195.2 195.2a64 64 0 0 1 90.496 0L512 4 21.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z'
                            />
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

    .FingoShapeRadius {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
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
