import NavBar from '../view/NavBar';
import '../css/Surprise.css';

export default function Surprise() {
  return (
    <div className="surprise-page">
      <NavBar />
      <div className="surprise-wrapper">
        <h2>Your Surprise Pick 🍽️</h2>
        <p>Here's a randomly chosen restaurant for you!</p>

        <div className="surprise-card">
          <h3>Restaurant Name here</h3>
          <p>Cuisine here</p>
          <p>Distance: </p>
          <button>Show Another</button>
        </div>
      </div>
    </div>
  );
}
