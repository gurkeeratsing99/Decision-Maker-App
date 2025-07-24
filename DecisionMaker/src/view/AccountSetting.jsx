import { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import { useAuth } from '../../src/auth/AuthContext';
import getUserData, { updateUserData } from '../utils/userData';
import '../css/AccountSetting.css';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
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
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email } = userInfo;
    const updatedInfo = { first_name, last_name, email };

    const success = await updateUserData(updatedInfo);
    if (success) {
      alert("Profile has been successfully updated");
      window.location.reload();
    } else {
      alert("Failed to update profile. Please try again.");
    }
  };

return (
  <>
    <NavBar />
    <div className="account-settings">
      <div className="settings-container">
        <h2>Account Settings</h2>

        {isEditing ? (
          <form className="input-form" onSubmit={handleSubmit}>
            <div className="setting-field">
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter First Name"
                required
                value={userInfo.first_name}
                onChange={handleChange}
              />
            </div>

            <div className="setting-field">
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter Last Name"
                required
                value={userInfo.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="setting-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                required
                value={userInfo.email}
                onChange={handleChange}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="primary-btn">Save</button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setIsEditing(false)}
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="setting-field">
                <label>Full Name:</label>
                <input type="text" value={userInfo.fullName} disabled className="readonly-field" />
            </div>

            <div className="setting-field">
                <label>Email:</label>
                <input type="text" value={userInfo.email} disabled className="readonly-field" />
            </div>

            <div className="setting-field password-row">
                
                <Link to="/profile/edit-password" className="password-link">
                   Reset password
                </Link>
                </div>


            <div className="button-group" style={{ marginTop: "1.5rem" }}>
                <button
                className="primary-btn"
                onClick={() => setIsEditing(true)}
                >
                Edit Profile
                </button>
            </div>
            </div>

        )}
      </div>
    </div>
  </>
);

}
