import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { useState, useEffect } from 'react';
import { useAuth } from '../../src/auth/AuthContext'; 
import '../css/Home.css';
import NavBar from '../view/NavBar';
import getFirstName from '../utils/getFirstName';
import supabase from '../config/supabaseClient';

export default function Home() {
  const [typingDone, setTypingDone] = useState(false);
  const { user } = useAuth(); 
  const [ fisrtName, setFirstName ] = useState('');

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
  }, [user])

  return (
    
    <div className="home-container">
      <NavBar />
      <section className="hero">
        <h2 className="typewriter-wrapper">
          <Typewriter
            options={{
              strings: "Can't decide where to eat? <br> We are here to help you decide 😀",
              autoStart: true,
              delay: 75,
              cursor: '|',
            }}
            onInit={(typewriter) => {
              typewriter
                .callFunction(() => setTypingDone(false))
                .pauseFor(200)
                .callFunction(() => setTypingDone(true))
                .start();
            }}
          />
        </h2>

        
          <div className="hero-content fade-in">
            <p className="hero-subheading">
              {user
                ? `Welcome back, ${fisrtName}!`
                : "Pick a path — search with filters or let us surprise you!"}
            </p>

            <div className="action-buttons">
              <Link to="/search">
                <button className="home-action-btn search-btn">🔍 Search Restaurants</button>
              </Link>

              <Link to="/surprise">
                <button className="glow-always">🎲 Surprise Me!</button>
              </Link>
            </div>
          </div>
      </section>
    </div>
  );
}
