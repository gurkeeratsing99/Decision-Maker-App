import '../css/History.css';
import { useState, useEffect } from 'react';

const dummyHistory = [
  { name: 'Sushi Place', date: '2025-07-10' },
  { name: 'Pizza Palace', date: '2025-07-12' },
  { name: 'Burger Barn', date: '2025-07-14' },
];

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // You can replace this with a Supabase fetch call later
    setHistory(dummyHistory);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Past Suggestions</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <strong>{item.name}</strong><br />
              <small>{item.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
