import { useState } from 'react';

const sampleRestaurants = [
  'Sushi Place',
  'Burger Barn',
  'Vegan Delight',
  'Pizza Palace',
  'Curry Corner',
  'Taco Town',
];

export default function SurpriseMe() {
  const [suggestion, setSuggestion] = useState('');

  const handleSurprise = () => {
    const random = sampleRestaurants[Math.floor(Math.random() * sampleRestaurants.length)];
    setSuggestion(random);

    const history = JSON.parse(localStorage.getItem('restaurantHistory')) || [];
    localStorage.setItem('restaurantHistory', JSON.stringify([random, ...history]));
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Surprise Me</h2>
        <p>Click the button to pick a random restaurant:</p>
        <button className="sign-in-btn" onClick={handleSurprise}>Surprise Me</button>
        {suggestion && <p style={{ marginTop: '20px' }}>🎉 Try: <strong>{suggestion}</strong></p>}
      </div>
    </div>
  );
}
