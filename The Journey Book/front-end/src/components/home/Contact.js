// Contact.js
import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero Section with Parallax Effect */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Start Your Next Adventure</h1>
            <p>Have questions about destinations, bookings, or travel tips? Our team is here to help you plan the perfect journey.</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="contact-container">
        <div className="section-title">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="info-card">
              <h3>Contact Information</h3>
              <p className="info-description">
                Reach out to us for travel inquiries, collaboration opportunities, or just to share your journey stories!
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Email Address</h4>
                    <p>support@thejourneybook.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Phone Number</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Headquarters</h4>
                    <p>123 Adventure Lane, Travel City, TC 12345</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Office Hours</h4>
                    <p>Monday - Friday: 9am - 6pm</p>
                    <p>Saturday: 10am - 4pm</p>
                  </div>
                </div>
              </div>
              
              <div className="social-section">
                <h4>Follow Our Journey</h4>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-pinterest"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="travel-stats">
              <div className="stat-item">
                <h4>50+</h4>
                <p>Destinations</p>
              </div>
              <div className="stat-item">
                <h4>5K+</h4>
                <p>Happy Travelers</p>
              </div>
              <div className="stat-item">
                <h4>12</h4>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form-container">
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>Fill out the form below and we'll get back to you shortly</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select 
                  className="form-control" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="destination">Destination Information</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Your Message</label>
                <textarea 
                  className="form-control" 
                  id="message" 
                  name="message" 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your travel plans or questions..."
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="container">
          <h2>Find Us Around the World</h2>
          <p>We have travel experts in multiple time zones to serve you better</p>
          <div className="map-placeholder">
            <div className="map-content">
              <i className="fas fa-globe-americas"></i>
              <p>Global Travel Assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How far in advance should I book my trip?</h4>
              <p>We recommend booking at least 2-3 months in advance for international trips and 1-2 months for domestic travel to get the best deals.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer custom travel itineraries?</h4>
              <p>Yes! We specialize in creating personalized travel experiences tailored to your preferences, budget, and travel style.</p>
            </div>
            <div className="faq-item">
              <h4>What is your cancellation policy?</h4>
              <p>Our cancellation policy varies by package. Most bookings offer free cancellation up to 30 days before departure.</p>
            </div>
            <div className="faq-item">
              <h4>Can you help with visa applications?</h4>
              <p>Absolutely! We provide guidance and documentation support for visa applications to most destinations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;