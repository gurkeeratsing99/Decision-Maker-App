import NavBar from '../view/NavBar';
import '../css/Search.css';

export default function Search() {
  return (
    <div className="search-page">
      <NavBar />
      <div className="search-wrapper">
        <h2>Search Restaurants</h2>
        <p>Use filters to narrow down your options.</p>

        <div className="search-form">
          <input type="text" placeholder="🔍 Search for food, name..." />
          <input type="text" placeholder="📍 Location" />

          <div className="filters">
            <button>🍽️ Cuisine ▾</button>
            <button>💲 Price ▾</button>
            <button>🚶 Distance ▾</button>
            <button>🕒 Hours ▾</button>
          </div>

          <button className="search-submit">🔍 Search Restaurants</button>
        </div>
      </div>
    </div>
  );
}
