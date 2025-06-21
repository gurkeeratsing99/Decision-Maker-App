import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SignUp.css';
import { signUp, createAcc} from '../backend/sign-up';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) return alert("You must agree to the terms.");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match.");

    const fullName = form.name.trim().split(' ');
    const firstName = fullName[0];
    const lastName = fullName.slice(1).join(' ') || '';

    console.log("Creating account with:", form);

    // TODO: Hook to Supabase signUp
    const { data, error } = await signUp(form.email, form.password);
    
    if (error) {
      return alert("Error during sign up: " + error.message);
    }

    const { id: userID, email: userEmail } = data.user;
    const { data: accountData, error: accountError } = await createAcc(userID, userEmail, firstName, lastName);

    if (accountError) {
      return alert("Error creating user account: " + accountError);
    }

    console.log("Account sucessfully created: ", accountData);

  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-tabs">
          <Link to="/signin" className="tab">Sign In</Link>
          <button className="tab active">Create Account</button>
        </div>

        <div className="centered-text">
          <h2>Create account</h2>
          <p className="subtitle">Join us and get started today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
            <span className="icon">👤</span>
          </div>

          <label>Email address</label>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <span className="icon">📧</span>
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />
            <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>👁️</span>
          </div>

          <label>Confirm Password</label>
          <div className="input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Confirm your password"
              name="confirmPassword"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>👁️</span>
          </div>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button className="signup-btn" type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}
