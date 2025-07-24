import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import { useAuth } from '../../src/auth/AuthContext';
import supabase from '../config/supabaseClient'; // needed for logout
import { useState, useEffect } from 'react';
import getFirstName from '../utils/getFirstName';

export default function NavBar() {
  const { user, setUser } = useAuth(); 
  const [ firstName, setFirstName ] = useState('');

  useEffect(() => {
    async function fetchName() {
      const name = await getFirstName(user.id);
      if (name && name.length > 0) {
        setFirstName(name);
      }
    }

    if (user) {
      fetchName();
    }

  },[user])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
  };

  return (
    <nav className="navbar">
      <h1 className="logo"><Link to="/">Decision Maker</Link></h1>
      <div className="nav-links">
        <Link to="/">Discover</Link>

 {user ? (
          <>
             <Link to="/history">History</Link>
        <Link to="/loves">Loves</Link>
          </>
        ) : (
          <>
          
          </>
        )}

       

        {user ? (
          <>
            <span className="user-greeting">
              <Link to="/profile"> 👋 {firstName}</Link></span>
            <button onClick={handleLogout} className="cta-btn">Logout</button>
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
