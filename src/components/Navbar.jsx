import React, { useState } from 'react';
import '../css/Header.css';

function Navbar({ onNavigate, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMenuOpen(false); 
  };

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="logo" onClick={() => handleNavClick('landing')}>
          🏃‍♂️ FitTrack
        </div>


        <div
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li
            className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
          >
            Home
          </li>
          <li
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={`nav-link ${currentPage === 'workouts' ? 'active' : ''}`}
            onClick={() => handleNavClick('workouts')}
          >
            Workouts
          </li>
          <li
            className={`nav-link ${currentPage === 'weights' ? 'active' : ''}`}
            onClick={() => handleNavClick('weights')}
          >
            Weight
          </li>
          <li
            className={`nav-link ${currentPage === 'goals' ? 'active' : ''}`}
            onClick={() => handleNavClick('goals')}
          >
            Goals
          </li>
          <li
            className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            Settings
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
