/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useApp, useAuth, usePersistedGuest } from 'src/hooks'
import { FingoModal } from 'src/components/core'
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    FacebookShareCount,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share'
import FingoEnvelopeImg from 'src/assets/images/fingo-envelope.png'
import 'src/styles/ModalInviteFriends.styles.css'
import CopyToClipboard from 'react-copy-to-clipboard'
import { ReactComponent as InfoOutlineSVG } from 'src/assets/svg/info-outline.svg'

const SHARE_TEXT = `I am learning finance the way and getting rewarded at Fingo! Come join me

`

const ModalInviteFriends = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useAuth()
    const { guestState } = usePersistedGuest()
    const [copied, setCopied] = useState(false)

    const { openModalInviteFriends, app_setOpenModalInviteFriends } = useApp()

    const handleCloseModal = () => {
        dispatch(app_setOpenModalInviteFriends(false))
    }

    const onClickCopy = () => {
        setCopied(true)
    }

    useEffect(() => {
        if (!openModalInviteFriends) {
            setCopied(false)
        }
    }, [openModalInviteFriends])

    const getReferralLink = useMemo(() => {
        if (isAuthenticated && user) {
            return `${window.location.origin}/invite/${user.referralCode}`
        }
        return undefined
    }, [isAuthenticated, user])

    return (
        <FingoModal
            open={openModalInviteFriends}
            onClose={handleCloseModal}
            centered
            className='ModalInviteFriends'
        >
            <div className='ModalInviteFriendsContainer FingoShapeRadius'>
                <div className='InviteFriends'>
                    <div className='InviteFriendsHeader flex align-items-center flex-column mb-4'>
                        <img
                            src={FingoEnvelopeImg}
                            alt='img'
                            className='mb-3'
                        />
                        <h2 className='mb-2 text-center'>Invite Friends.</h2>
                        <h4 className='text-center'>
                            Tell your friends it's free and fun to learn on
                            Fingo. Refer 3 friends and get unlimited hearts for
                            3 days.
                        </h4>
                    </div>
                    <div className='InviteFriendsContent'>
                        {getReferralLink && (
                            <>
                                <div className='InputReferralCodeWrapper'>
                                    <input
                                        className='InputReferralCode'
                                        value={getReferralLink}
                                    />
                                    <CopyToClipboard text={getReferralLink}>
                                        <button
                                            className={`InputReferralCopyBtn ${
                                                copied && 'active'
                                            }`}
                                            onClick={onClickCopy}
                                        >
                                            <>{copied ? 'COPIED' : 'COPY'}</>
                                        </button>
                                    </CopyToClipboard>
                                </div>

                                <div className='InputReferralCodeInfo mt-2'>
                                    <InfoOutlineSVG />
                                    <p className='mb-0'>
                                        Your referral will be counted when your
                                        friend completes at least one chapter.
                                    </p>
                                </div>
                            </>
                        )}

                        <p className='mb-1 text-sm mt-4'>Or share on...</p>

                        <div className='SocialShareContainer'>
                            <div className='SocialShareItem'>
                                <TwitterShareButton
                                    url={getReferralLink}
                                    title={SHARE_TEXT}
                                    className='SocialShareItem__share-button'
                                >
                                    <XIcon size={32} round />
                                </TwitterShareButton>
                            </div>

                            <div className='SocialShareItem'>
                                <WhatsappShareButton
                                    url={getReferralLink}
                                    title={SHARE_TEXT}
                                    separator=''
                                    className='SocialShareItem__share-button'
                                >
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                            </div>

                            {/* <div className='SocialShareItem'>
                                <TelegramShareButton
                                    url={getReferralLink}
                                    className='SocialShareItem__share-button'
                                >
                                    <TelegramIcon size={32} round />
                                </TelegramShareButton>
                            </div> */}

                            <div className='SocialShareItem'>
                                <LinkedinShareButton
                                    url={getReferralLink}
                                    className='Demo__some-network__share-button'
                                >
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>

                            <div className='SocialShareItem'>
                                <FacebookShareButton
                                    url={getReferralLink}
                                    className='SocialShareItem__share-button'
                                >
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalInviteFriends
