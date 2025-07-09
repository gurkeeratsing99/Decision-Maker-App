import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import { useAuth } from '../../src/auth/AuthContext';
import supabase from '../config/supabaseClient'; // needed for logout

export default function NavBar() {
  const { user, setUser } = useAuth(); 

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
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
            <span className="user-greeting">👋 {user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
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
