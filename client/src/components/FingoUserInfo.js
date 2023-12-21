import Axios from 'src/api/axios'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import nonSignedUp from 'src/images/nonSignedUp'
import signedUp from 'src/images/pepe.jpg'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks'

import 'src/styles/FingoUserInfo.styles.css'
import { getLevelColor } from 'src/utils'

const FingoUserInfo = () => {
    const now = new Date()
    const time = now.getHours()

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
    const { user, newUser, auth_setNewUser } = useAuth()

    const [profilePicture, setProfilePicture] = useState('')

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
            })
            .catch(error => {
                console.error('Error uploading file:', error)
            })
    }

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
                    <label htmlFor='profile-picture-upload'>
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
                        {newUser ? 'Stranger' : user?.displayName ?? ''}!
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
