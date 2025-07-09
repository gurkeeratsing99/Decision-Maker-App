import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { useState } from 'react';
import { useAuth } from '../../src/auth/AuthContext'; 
import '../css/Home.css';
import NavBar from '../view/NavBar';

export default function Home() {
  const [typingDone, setTypingDone] = useState(false);
  const { user } = useAuth(); 

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

        {typingDone && (
          <div className="hero-content fade-in">
            <p className="hero-subheading">
              {user
                ? `Welcome back, ${user.email}!`
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
        )}
      </section>
    </div>
  );
}
