import { useEffect, useState } from 'react';
import NavBar from '../view/NavBar';
import '../css/History.css';
import supabase from '../config/supabaseClient';


export default function History() {
  const [searches, setSearches] = useState([]);
  const [surprises, setSurprises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.id;

      try {
        const searchRes = await fetch(`http://localhost:4000/api/history/search?user_id=${userId}`);
        const surpriseRes = await fetch(`http://localhost:4000/api/history/surprise?user_id=${userId}`);

        if (!searchRes.ok || !surpriseRes.ok) throw new Error("Failed to fetch history.");

        const searchData = await searchRes.json();
        const surpriseData = await surpriseRes.json();

        setSearches(searchData);
        setSurprises(surpriseData);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (timestamp) => new Date(timestamp).toLocaleString();

  const groupByDate = (entries) => {
    return entries.reduce((acc, entry) => {
      const date = new Date(entry.searched_at).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
  };

  return (
    <div className="history-page">
      <NavBar />
      <div className="history-wrapper">
        <h2>📜 Recent Picks For You</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
           
            <section className="history-section">
              <h3>🎲 Surprise Picks</h3>
              {surprises.length === 0 ? (
                <p>No surprise history found.</p>
              ) : (
                <ul>
                  {surprises.map((item) => (
                    <li key={item.id} className="history-card">
                      <strong>{item.restaurant_name}</strong><br />
                      <span className="timestamp">at {formatDate(item.viewed_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
