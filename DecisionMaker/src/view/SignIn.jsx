// src/pages/SignIn.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignIn.css';
import { signIn } from '../auth/sign-in';
import { useAuth } from '../auth/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { user, session, error } = await signIn(email, password);

    if (error) {
      alert("Incorrect password or email. Please try again.");
      return;
    }

    if (session?.access_token) {
      localStorage.setItem("access_token", session.access_token);
    }

    setUser(user); // ✅ trigger NavBar update
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="tabs">
          <button className="tab active">Sign In</button>
          <Link to="/signup" className="tab">Create Account</Link>
        </div>

        <div className="centered-text">
          <h2>Welcome back</h2>
          <p className="subtitle">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSignIn}>
          <label>Email address</label>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="icon">📧</span>
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="icon" onClick={() => setShowPass(!showPass)}>👁️</span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button className="sign-in-btn" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
