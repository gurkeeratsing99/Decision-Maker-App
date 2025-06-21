import { Link } from 'react-router-dom';
import '../css/Home.css';
import NavBar from './NavBar';


export default function Home() {

  return (
    <div className="home-container">
      <NavBar />

      <section className="hero">
        <h2>Can't decide where to eat?</h2>
        <p>Pick a path — search with filters or let us surprise you!</p>

        <div className="action-buttons">
          <Link to="/search">
            <button className="home-action-btn search-btn">🔍 Search Restaurants</button>
          </Link>

          <Link to="/surprise">
            <button className="home-action-btn surprise-btn">🎲 Surprise Me!</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
