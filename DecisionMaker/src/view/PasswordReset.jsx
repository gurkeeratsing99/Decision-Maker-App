import { useState } from "react";
import resetPassword from "../auth/reset-password";
import NavBar from "./NavBar";
import "../css/PasswordReset.css";
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordReset() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [ form, setForm ] = useState({
        password: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            alert('Passwords do not match. Please try again.');
        } else {
            resetPassword(form.newPassword);
            navigate('/profile')
        }
    }

    if (user) {
        return (
            <>
                <NavBar />
                <div className="password-reset-container">
                    <h1>Reset Account Password</h1>
                    <p>Enter a new password.</p>
                    
                    <form className='input-wrapper' onSubmit={handleSubmit}>
                    
                    <h3>New Password *</h3>
                        <input
                        type="password"
                        placeholder="Enter New Password"
                        name="newPassword"
                        required
                        value={form.newPassword}
                        onChange={handleChange}
                        />
                    
                    
                    <h3>Re-enter New Password * </h3>
                        <input
                        type="password"
                        placeholder="Enter New Password"
                        name="confirmPassword"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        />
                    
                    <Link to='/profile'><button className="btn-cancel-password">Cancel</button></Link>
                    <button className="btn-reset-password">Reset Password</button>
                    </form>
                </div>
            </>
            ); 
    } else {
        setUser(null);
        <Link to="/signup"></Link>
    }
    
    
        
}