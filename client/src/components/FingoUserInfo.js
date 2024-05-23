import Axios from 'src/api/axios'
import { useNavigate } from 'react-router-dom'
import { Fragment, useMemo, useRef, useState } from 'react'

import nonSignedUp from 'src/images/nonSignedUp'
import signedUp from 'src/images/pepe.jpg'
import { useDispatch } from 'react-redux'
import { useApp, useAuth } from 'src/hooks'

import 'src/styles/FingoUserInfo.styles.css'
import { getLevelColor } from 'src/utils'
import { ArrowContainer, Popover as ReactTinyPopover } from 'react-tiny-popover'
import { ReactComponent as PencilFillSvg } from 'src/assets/svg/pencil-fill.svg'
import { userUtils } from 'src/utils/user.util'

const FingoUserInfo = () => {
    const now = new Date()
    const time = now.getHours()

    const labelUploadRef = useRef(null)

    const { app_isDarkTheme } = useApp()

    const { isAuthenticated } = useAuth()

    const getGreetingText = useMemo(() => {
        if (time >= 1 && time < 11) {
            return 'Good morning,'
        } else if (time >= 11 && time < 16) {
            return 'Good afternoon,'
        } else if (time >= 16 && time < 19) {
            return 'Good afternoon,'
        } else if (time >= 19 || time < 5) {
            return 'Good evening,'
        } else {
            return 'Hey,'
        }
    }, [time])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, newUser, auth_syncAndGetUser } = useAuth()

    const [profilePicture, setProfilePicture] = useState('')
    const [isOpenPopover, setIsOpenPopover] = useState('')

    const handleProfilePictureUpload = event => {
        const file = event.target.files[0]
        // Perform necessary actions with the uploaded file
        // For example, you can upload the file to a server or store it in the state
        const formData = new FormData()
        formData.append('photo', file)

        Axios({
            method: 'POST',
            data: formData,
            withCredentials: true,
            url: '/server/updateProfilePhoto',
        })
            .then(function (response) {
                setProfilePicture(response.data.imageUrl)
                auth_syncAndGetUser()
            })
            .catch(error => {
                console.error('Error uploading file:', error)
            })
    }

    const renderTooltip = () => <div className='FingoTooltip'>Upload Image</div>

    return (
        <div className='FingoUserInfo'>
            <div className='FingoUserInfoInner d-flex align-items-center'>
                <div className='profile-picture'>
                    {isAuthenticated && Boolean(user) && (
                        <div
                            className='FingoCardDailyXPHeaderLevel'
                            style={{
                                backgroundColor: getLevelColor(
                                    'default',
                                    user?.xp?.level
                                ),
                            }}
                        >
                            Lvl {user?.xp?.level ?? 1}
                        </div>
                    )}

                    {isAuthenticated ? (
                        <ReactTinyPopover
                            isOpen={isOpenPopover}
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
                                    arrowColor={
                                        app_isDarkTheme ? '#fff' : '#333'
                                    }
                                >
                                    {renderTooltip()}
                                </ArrowContainer>
                            )}
                        >
                            <div
                                onMouseEnter={() => setIsOpenPopover(true)}
                                onMouseLeave={() => {
                                    setTimeout(() => {
                                        setIsOpenPopover(false)
                                    }, 300)
                                }}
                                className='position-relative UploadPictureContainer'
                            >
                                <label
                                    ref={labelUploadRef}
                                    htmlFor='profile-picture-upload'
                                    className='cursor-pointer'
                                >
                                    {!isAuthenticated ? (
                                        <img
                                            src={nonSignedUp}
                                            alt='Profile'
                                            className='rounded-circle'
                                        />
                                    ) : user?.imgPath ? (
                                        <img
                                            src={user.imgPath}
                                            alt='Profile'
                                            className='rounded-circle'
                                        />
                                    ) : (
                                        <img
                                            src={signedUp}
                                            alt='Profile'
                                            className='rounded-circle'
                                        />
                                    )}
                                </label>
                                <div
                                    className='UploadMarker'
                                    onClick={() => {
                                        if (labelUploadRef.current) {
                                            labelUploadRef.current.click()
                                        }
                                    }}
                                >
                                    <PencilFillSvg />
                                </div>
                            </div>
                        </ReactTinyPopover>
                    ) : (
                        <label
                            htmlFor='profile-picture-upload'
                            onMouseEnter={() => setIsOpenPopover(true)}
                            onMouseLeave={() => setIsOpenPopover(false)}
                            className='cursor-pointer'
                        >
                            {!isAuthenticated ? (
                                <img
                                    src={nonSignedUp}
                                    alt='Profile'
                                    className='rounded-circle'
                                />
                            ) : user?.imgPath ? (
                                <img
                                    src={user.imgPath}
                                    alt='Profile'
                                    className='rounded-circle'
                                />
                            ) : (
                                <img
                                    src={signedUp}
                                    alt='Profile'
                                    className='rounded-circle'
                                />
                            )}
                        </label>
                    )}

                    <input
                        id='profile-picture-upload'
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handleProfilePictureUpload}
                        disabled={newUser}
                    />
                </div>
                <div className='user-info ml-3'>
                    <p className='greetingText'>{getGreetingText}</p>
                    <h4 className='user-name'>
                        {newUser
                            ? 'Stranger'
                            : userUtils.getFirstName(user) ?? ''}
                        ! 
                        <span
                            style={{
                                display: 'inline-block',
                                animation: 'wave-animation 3s infinite',
                                transformOrigin: '70% 100%',
                            }}
                        >
                            👋
                        </span>
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default FingoUserInfo
