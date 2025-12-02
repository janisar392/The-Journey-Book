import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './BookingConfirmationPage.css';
import { generatePDFTicket } from '../../utils/pdfTicketGenerator';
import { generateTextTicket } from '../../utils/textTicketGenerator';


const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingTicket, setDownloadingTicket] = useState(false);


  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // Get booking details from navigation state
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      setIsLoading(false);
    } else {
      // If no booking data, redirect to home
      navigate('/');
    }
  }, [location.state, user, navigate]);

  const handleViewMyTrips = () => {
    navigate('/my-trips');
  };

  const handleDownloadTicket = async () => {
  try {
    setDownloadingTicket(true);
    await generatePDFTicket(bookingDetails, user);
  } catch (error) {
    console.error('PDF download failed:', error);
    alert('PDF generation failed. Downloading text version instead.');
    generateTextTicket(bookingDetails, user);
  } finally {
    setDownloadingTicket(false);
  }
};


  const handleBookAnother = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div className="loading">Loading booking confirmation...</div>;
  }

  if (!bookingDetails) {
    return <div className="error">No booking details found</div>;
  }

  const { 
    experience, 
    selectedDate, 
    ticketQuantities, 
    totalPrice, 
    guestDetails, 
    paymentMethod, 
    bookingId,
    bookingDate 
  } = bookingDetails;

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h1>Booking Confirmed!</h1>
          <p className="success-message">Your experience has been successfully booked</p>
          <div className="booking-id">Booking ID: <strong>{bookingId}</strong></div>
        </div>

        <div className="confirmation-content">
          {/* Left Column - Booking Summary */}
          <div className="confirmation-summary">
            <h2>Booking Summary</h2>
            
            <div className="experience-card">
              <img src={experience.image} alt={experience.name} />
              <div className="experience-info">
                <h3>{experience.name}</h3>
                <p className="location">📍 {experience.location}</p>
                <p className="rating">⭐ {experience.rating}</p>
                <div className="booking-date">
                  <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            <div className="booking-details-section">
              <h4>Booking Details</h4>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Booking ID:</span>
                  <span className="value">{bookingId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Booking Date:</span>
                  <span className="value">{new Date(bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {paymentMethod === 'online' ? '💳 Paid Online' : '🏛️ Pay at Venue'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value status-confirmed">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="ticket-summary">
              <h4>Tickets</h4>
              <div className="ticket-list">
                {ticketQuantities.adult > 0 && (
                  <div className="ticket-item">
                    <span>Adult (13+)</span>
                    <span>{ticketQuantities.adult} x &#8377;{25}</span>
                  </div>
                )}
                {ticketQuantities.child > 0 && (
                  <div className="ticket-item">
                    <span>Child (4-12)</span>
                    <span>{ticketQuantities.child} x &#8377;{15}</span>
                  </div>
                )}
                {ticketQuantities.senior > 0 && (
                  <div className="ticket-item">
                    <span>Senior (65+)</span>
                    <span>{ticketQuantities.senior} x &#8377;{20}</span>
                  </div>
                )}
              </div>
              <div className="total-amount">
                <span>Total Paid:</span>
                <span className="amount">&#8377;{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Guest Info & Actions */}
          <div className="confirmation-actions">
            <div className="guest-info-section">
              <h3>Guest Information</h3>
              <div className="guest-details">
                <div className="guest-item">
                  <strong>Full Name:</strong>
                  <span>{guestDetails.fullName}</span>
                </div>
                <div className="guest-item">
                  <strong>Email:</strong>
                  <span>{guestDetails.email}</span>
                </div>
                <div className="guest-item">
                  <strong>Phone:</strong>
                  <span>{guestDetails.phone}</span>
                </div>
                {guestDetails.specialRequests && (
                  <div className="guest-item">
                    <strong>Special Requests:</strong>
                    <span>{guestDetails.specialRequests}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="important-info">
              <h4>📋 Important Information</h4>
              <ul>
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring a valid photo ID for verification</li>
                <li>Show your booking confirmation at the entrance</li>
                <li>Free cancellation available up to 24 hours before</li>
                {paymentMethod === 'venue' && (
                  <li>Payment will be collected when you check in</li>
                )}
              </ul>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={handleDownloadTicket}
                disabled={downloadingTicket}
              >
                {downloadingTicket ? '⏳ Downloading...' : '📄 Download Ticket'}
              </button>

              
              <button 
                className="btn-secondary"
                onClick={handleViewMyTrips}
              >
                🎒 View My Trips
              </button>
              
              <button 
                className="btn-outline"
                onClick={handleBookAnother}
              >
                ✨ Book Another Experience
              </button>
            </div>

            <div className="support-info">
              <p>Need help? Contact our support team at <strong>support@journeybook.com</strong></p>
              <p>Or call us at <strong>+1 (555) 123-4567</strong></p>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">📧</div>
              <h4>Email Confirmation</h4>
              <p>You'll receive a confirmation email with all details within 5 minutes</p>
            </div>
            <div className="step">
              <div className="step-icon">📱</div>
              <h4>Mobile Ticket</h4>
              <p>Show your ticket on your phone or print it before arrival</p>
            </div>
            <div className="step">
              <div className="step-icon">⭐</div>
              <h4>Enjoy Your Experience</h4>
              <p>Arrive on time and get ready for an amazing adventure!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;