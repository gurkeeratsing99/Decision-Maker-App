// Loves.jsx
import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import NavBar from './NavBar';
import '../css/Loves.css';
import { Link } from 'react-router-dom';

export default function Loves() {
  const [loves, setLoves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoves = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:4000/api/loves?user_id=${user.id}`);
        const data = await res.json();
        setLoves(data);
      } catch (err) {
        console.error('Error fetching loves:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoves();
  }, []);

  const handleUnlove = async (restaurant_id) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !restaurant_id) return;

  try {
    const res = await fetch('http://localhost:4000/api/unlove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, restaurant_id })
    });

    if (!res.ok) throw new Error('Failed to unlove restaurant');

    // Update UI
    setLoves(prev => prev.filter(r => r.restaurant_id !== restaurant_id));
  } catch (err) {
    console.error("Unlove error:", err);
  }
};


  return (
    <div className="loves-page">
      <NavBar />
      <div className="loves-wrapper">
        <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>❤️ Your Loved Restaurants</h2>

        {loading ? (
          <p>Loading...</p>
        ) : loves.length === 0 ? (
          <p>You haven’t loved any restaurants yet.</p>
        ) : (
          <div className="loves-grid">
            {loves.map((item) => (
              <div key={item.id} className="love-card">
                
                
                <img src={item.image_url} alt={item.restaurant_name} className="love-img" />
                <button
                    className="unlove-btn absolute top-2 right-2 text-red-500 text-xl"
                    onClick={() => handleUnlove(item.restaurant_id)}
                    title="Remove from Loves"
                >
                    ❤️
                </button>
                <div className="love-info">
                  <h3>{item.restaurant_name}</h3>
                  <p>{item.address}</p>
                  <p>⭐ {item.rating} &nbsp;|&nbsp; {item.price || 'N/A'}</p>
                  
                </div>
                
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" style={{ color: '#3b82f6' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
