import { useState } from "react";
import resetPassword from "../auth/reset-password";
import NavBar from "./NavBar";
import "../css/PasswordReset.css";
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordReset() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert('Passwords do not match. Please try again.');
    } else {
      await resetPassword(form.newPassword);
      setSuccessMsg('✅ Password reset successfully! Redirecting...');
      setTimeout(() => navigate('/profile'), 2000); // 2 second delay before redirect
    }
  };

  if (!user) {
    setUser(null);
    return <Link to="/signup" />;
  }

  return (
    <>
      <NavBar />
      <div className="password-reset-container">
        <h2>🔐 Reset Password</h2>
        <p>Enter a new password to update your account.</p>

        {successMsg && <div className="success-alert">{successMsg}</div>}

        <form className="password-reset-form" onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            required
            value={form.newPassword}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter new password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <div className="btn-group">
            <Link to="/profile" className="btn cancel">Cancel</Link>
            <button type="submit" className="btn primary">Reset</button>
          </div>
        </form>
      </div>
    </>
  );
}
