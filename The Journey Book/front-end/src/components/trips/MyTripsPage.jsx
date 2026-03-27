import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generatePDFTicket } from '../../utils/pdfTicketGenerator';
import { generateTextTicket } from '../../utils/textTicketGenerator';
import './MyTripsPage.css';

const MyTripsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingTicket, setDownloadingTicket] = useState(null);

  // Base URL configuration - Change this for production
  const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
  // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnUrl: '/my-trips',
          message: 'Please login to view your trips'
        }
      });
      return;
    }

    fetchUserBookings();
  }, [user, navigate]);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/bookings/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const userBookings = await response.json();
      
      // Transform backend data to match frontend format
      const transformedBookings = userBookings.map(booking => ({
        id: booking.bookingId,
        experience: {
          id: booking.experienceId,
          name: booking.experienceName,
          image: booking.experienceImage,
          location: booking.location,
          duration: booking.duration
        },
        selectedDate: booking.selectedDate,
        ticketQuantities: booking.ticketQuantities,
        totalPrice: booking.totalPrice,
        guestDetails: {
          fullName: booking.guestFullName,
          email: booking.guestEmail,
          phone: booking.guestPhone,
          specialRequests: booking.specialRequests || ''
        },
        paymentMethod: booking.paymentMethod,
        paymentId: booking.paymentId,
        bookingDate: booking.bookingDate,
        status: booking.status,
        // Add raw booking date for sorting
        rawBookingDate: booking.bookingDate
      }));

      // FIX: Sort bookings by booking date (most recent first)
      const sortedBookings = transformedBookings.sort((a, b) => {
        return new Date(b.rawBookingDate) - new Date(a.rawBookingDate);
      });

      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load your trips. Please try again.');
      // Fallback to empty array instead of mock data
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending_payment';
    if (filter === 'past') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { text: 'Confirmed', class: 'status-confirmed' },
      pending_payment: { text: 'Pending Payment', class: 'status-pending' },
      completed: { text: 'Completed', class: 'status-completed' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings after cancellation
      await fetchUserBookings();
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/experience/${booking.experience.id}`);
  };

  const handleBookAgain = (experience) => {
    navigate(`/experience/${experience.id}`);
  };

  const handleDownloadTicket = async (booking) => {
    try {
      setDownloadingTicket(booking.id);
      await generatePDFTicket(booking, user);
    } catch (error) {
      console.error('PDF download failed:', error);
      // Fallback to text ticket if PDF fails
      alert('PDF generation failed. Downloading text version instead.');
      generateTextTicket(booking, user);
    } finally {
      setDownloadingTicket(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="my-trips-page">
      <div className="trips-container">
        {/* Header */}
        <div className="trips-header">
          <h1>My Trips</h1>
          <p>Manage your upcoming adventures and explore past experiences</p>
        </div>

        {/* Stats Overview */}
        <div className="trips-stats">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'confirmed' || b.status === 'pending_payment').length}</h3>
              <p>Upcoming Trips</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-info">
              <h3>{new Set(bookings.map(b => b.experience.location)).size}</h3>
              <p>Destinations</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="trips-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Trips
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past Trips
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {isLoading ? (
            <div className="loading">Loading your trips...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">🎒</div>
              <h3>No trips found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start exploring amazing experiences!"
                  : `No ${filter} trips found.`
                }
              </p>
              {filter !== 'all' && (
                <button 
                  className="explore-btn"
                  onClick={() => setFilter('all')}
                >
                  View All Trips
                </button>
              )}
              {filter === 'all' && (
                <button 
                  className="explore-btn"
                  onClick={() => navigate('/')}
                >
                  Explore Experiences
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-image"
                 style={{
                    width: "45%",
                    height: "350px"   //  FIXED HEIGHT
                  }}
                 >
                  <img src={booking.experience.image} alt={booking.experience.name} 
                  style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }} />
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="booking-card-content">
                  <div className="booking-header">
                    <h3>{booking.experience.name}</h3>
                    <div className="booking-meta">
                      <span>📍 {booking.experience.location}</span>
                      <span>⏱️ {booking.experience.duration}</span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>Booking ID:</span>
                      <span className="booking-id">{booking.id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Experience Date:</span>
                      <span>{formatDate(booking.selectedDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Booked On:</span>
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Guests:</span>
                      <span>
                        {booking.ticketQuantities.adult > 0 && `${booking.ticketQuantities.adult} Adult`}
                        {booking.ticketQuantities.child > 0 && `, ${booking.ticketQuantities.child} Child`}
                        {booking.ticketQuantities.senior > 0 && `, ${booking.ticketQuantities.senior} Senior`}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Payment:</span>
                      <span>
                        {booking.paymentMethod === 'online' ? '💳 Paid Online' : '🏛️ Pay at Venue'}
                        {booking.paymentId && ` (${booking.paymentId})`}
                      </span>
                    </div>
                  </div>

                  <div className="booking-total">
                    <span>Total Paid:</span>
                    <span className="price">₹{booking.totalPrice}</span>
                  </div>

                  <div className="booking-actions">
                    {(booking.status === 'confirmed' || booking.status === 'pending_payment') && (
                      <>
                        <button 
                          className="btn-secondary"
                          onClick={() => handleDownloadTicket(booking)}
                          disabled={downloadingTicket === booking.id}
                        >
                          {downloadingTicket === booking.id ? '⏳ Downloading...' : '📄 Download Ticket'}
                        </button>
                        <button 
                          className="btn-outline"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          ❌ Cancel Booking
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'completed' && (
                      <>
                        <button 
                          className="btn-primary"
                          onClick={() => handleBookAgain(booking.experience)}
                        >
                          ✨ Book Again
                        </button>
                        <button 
                          className="btn-outline"
                          onClick={() => alert('Review feature coming soon!')}
                        >
                          ⭐ Write Review
                        </button>
                      </>
                    )}

                    {booking.status === 'cancelled' && (
                      <button 
                        className="btn-primary"
                        onClick={() => handleBookAgain(booking.experience)}
                      >
                        🔄 Book Again
                      </button>
                    )}

                    <button 
                      className="btn-outline"
                      onClick={() => handleViewDetails(booking)}
                    >
                      🔍 View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help with Your Booking?</h3>
          <div className="help-options">
            <div className="help-option">
              <div className="help-icon">📞</div>
              <div className="help-info">
                <h4>24/7 Support</h4>
                <p>Call us at +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="help-option">
              <div className="help-icon">📧</div>
              <div className="help-info">
                <h4>Email Support</h4>
                <p>support@journeybook.com</p>
              </div>
            </div>
            <div className="help-option">
              <div className="help-icon">💬</div>
              <div className="help-info">
                <h4>Live Chat</h4>
                <p>Available 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTripsPage;