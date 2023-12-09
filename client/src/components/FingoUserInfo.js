import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import nonSignedUp from 'src/images/nonSignedUp'
import signedUp from 'src/images/pepe.jpg'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks'

import 'src/styles/FingoUserInfo.styles.css'

const FingoUserInfo = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, newUser, auth_setNewUser } = useAuth()
    const role = useRef('')
    const [userName, setUserName] = useState(null)

    const [profilePicture, setProfilePicture] = useState('')

    ////to authenticate user before allowing him to enter the home page
    ////if he is not redirect him to login page
    useEffect(() => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: '/server/login',
        }).then(function (response) {
            if (response.data.redirect == '/login') {
                // console.log("Please log in");
                dispatch(auth_setNewUser(true))
                // navigate(`/auth/login`);
            } else if (response.data.redirect == '/updateemail') {
                navigate('/updateemail')
            } else {
                // console.log("Already logged in");
                role.current = response.data.user.role
                // setUser(response.data.user)
                setUserName(
                    response.data.user.displayName
                        ? response.data.user.displayName?.split(' ')[0]
                        : response.data.user.email
                )
            }
        })
    }, [])

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
            <div className='d-flex align-items-center p-3'>
                <div className='profile-picture'>
                    <label htmlFor='profile-picture-upload'>
                        {newUser ? (
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
                    <h4 className='user-name'>
                        Hey, {newUser ? 'Stranger' : userName}!
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
