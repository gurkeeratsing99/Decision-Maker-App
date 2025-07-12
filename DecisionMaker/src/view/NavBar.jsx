// src/view/NavBar.jsx
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import { useAuth } from '../../src/auth/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();  // ✅ use logout from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();      // ✅ call context logout
    navigate("/signin"); // ✅ then redirect
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Decision Maker</h1>
      <div className="nav-links">
        <Link to="/">Discover</Link>
        <Link to="/history">History</Link>
        <Link to="/groups">Groups</Link>

        {user ? (
          <>
            
            <button onClick={handleLogout} className="logout-btn cta-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">
              <button className="cta-btn">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
