import React from 'react';
import '../css/Footer.css'; 
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <div className="footer-content">
      <div className="footer-section footer-about">
        <h3 className="footer-logo">FitTrack 🏃‍♂️</h3>
        <p>
          Your ultimate companion in the world of fitness.
          Track your progress, set goals, and stay motivated on your journey to a healthy life.
        </p>
      </div>

      <div className="footer-section footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Workouts</a></li>
          <li><a href="#">Goals</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </div>

      <div className="footer-section footer-social">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      <div className="footer-section footer-contact">
        <h3>Contact Us</h3>
        <p>Email: <a href="mailto:info@fittrack.com">info@fittrack.com</a></p>
        <p>Phone: +380 12 345 6789</p>
        <p>Address: Fitness Center, Kyiv, Ukraine</p>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} FitTrack. All rights reserved. 💪
        </p>
      </div>
    </div>
  );
}

export default Footer;
