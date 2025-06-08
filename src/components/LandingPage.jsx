
import React from 'react';
import '../css/landingpage.css';
import bgImage from '../img/background-main.jpg';

function LandingPage({ onNavigate }) {
  return (
    <section
      className="landing-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
      }}
    >
      <div className="hero-content">
        <h1>A fast and reliable way to your fitness progress!</h1>
        <p>Track your workouts, weight, goals and reach new heights with FitTrack.</p>
        <button className="cta-button" onClick={() => onNavigate('dashboard')}>
          Start
        </button>
      </div>
    </section>
  );
}

export default LandingPage;
