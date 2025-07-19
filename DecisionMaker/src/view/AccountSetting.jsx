import { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import { useAuth } from '../../src/auth/AuthContext';
import getUserData, {updateUserData} from '../utils/userData';
import PasswordReset from './PasswordReset';
import '../css/AccountSetting.css';
import { Link } from 'react-router-dom';


export default function Profile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(null);

    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        fullName: '',
    });

    useEffect(() =>{
        async function fetchUserData() {
            const data = await getUserData();

            if (data) {
                setUserInfo({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    password: data.password || '',
                    fullName: `${data.first_name || ''} ${data.last_name || ''}`
                });
            }
        }

        if (user) {
            fetchUserData();
        }

    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { first_name, last_name, email } = userInfo;
        const updatedInfo = {
            first_name,
            last_name,
            email
        };

        const success = await updateUserData(updatedInfo);

        if (success) {
            alert("Profile has been successfully updated");
            window.location.reload();
        } else {
            alert("Failed to update profile. Please try again.");
        }

    };

    return(
        <>
            <NavBar />
            <div className='profile-container'>

                <div className='user-profile-container'>
                <h1 className='account-setting'>Account Setting</h1>
                    <div className='profile-pic' />
                    {/* <h1 className='profile-username'>{userInfo.first_name}</h1> */}
                    <button className='btn-edit-profile' onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>
                
                {isEditing ? (
                    <div className='edit-profile-container'>
                        <form className='input-form' onSubmit={handleSubmit}>
                            <h3>First Name</h3>
                            <input
                                type='text'
                                placeholder='Enter First Name'
                                name="first_name"
                                required
                                value={userInfo.first_name}
                                onChange={handleChange}
                            />

                            <h3>Last Name</h3>
                            <input
                                type='text'
                                palceholder='Enter Last Name'
                                name='last_name'
                                required
                                value={userInfo.last_name}
                                onChange={handleChange}
                            />

                        <br/>
                        <h3>Email</h3>
                        
                            <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            required
                            value={userInfo.email}
                            onChange={handleChange}
                            />
                            <br/>
                            <button className='btn-save'>Save</button>
                        </form>
                    </div>

                ) : (
                    <div className='profile-info'>
                        <p><b>Full Name:</b> {userInfo.fullName}</p>
                        <p><b>Email:</b> {userInfo.email}</p>
                        <p>
                            <b>Password:</b>
                            <Link to="/profile/edit-password"><button className='btn-change'>[Change]</button></Link>
                        </p>
                    </div>
                )}

            </div>  
        </>    
    );
}