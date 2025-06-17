import { Link } from 'react-router-dom';
import '../css/NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Decision Maker</h1>
      <div className="nav-links">
        <Link to="/">Discover</Link>
        <Link to="/history">History</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/signup">
          <button className="cta-btn">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
