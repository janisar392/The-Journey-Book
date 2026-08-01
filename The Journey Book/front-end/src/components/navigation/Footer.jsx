// components/navigation/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-img">
              <img src="/images/logo.jpg" alt="J Logo" />
            </div>
            <div className="logo-text">
              <h3>Janisar Akhtar</h3>
              <p>Software Engineer</p>
            </div>
          </div>
          <p className="footer-description">
            Creating innovative solutions and memorable digital experiences.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">The Journey Book</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/destinations">Top Destinations</Link></li>
            <li><Link to="/bookings">Bookings</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li>
              <a
                href="https://the-journey-book-backend.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Run Backend (Render) to Load Data
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> janisar392@gmail.com</p>
            <p><i className="fas fa-phone"></i> +91 - 9608456392</p>
            <p><i className="fas fa-map-marker-alt"></i> New Delhi, India</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Connect With Me</h4>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/janisar392/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.youtube.com/@JanisarAkhtar_Vlog" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/janisar392" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://portfolio-janisar.netlify.app/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fas fa-briefcase"></i>
            </a>
          </div>
          <div className="newsletter">
            <h4>Stay Updated</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Janisar Akhtar. All rights reserved.</p>
        <div className="legal-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;