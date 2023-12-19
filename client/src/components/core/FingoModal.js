import React from 'react'
import 'src/styles/FingoModal.styles.css'
import { Modal as BootstrapModal } from 'react-bootstrap'

export const FingoModal = props => {
    const { open, onClose, children, className, rest } = props
    return (
        <BootstrapModal
            {...rest}
            className={`FingoModal ${className}`}
            show={open}
            onHide={onClose}
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            {open && (
                <button className='FingoModalClose' onClick={onClose}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='1024'
                        height='1024'
                        viewBox='0 0 1024 1024'
                    >
                        <path
                            fill='currentColor'
                            d='M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z'
                        />
                    </svg>
                </button>
            )}
            <div className='FingoShapeRadius'>{children}</div>
        </BootstrapModal>
    )
}
