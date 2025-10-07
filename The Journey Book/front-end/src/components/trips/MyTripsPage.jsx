import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MyTripsPage.css';

const MyTripsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock bookings data - in real app, you'd fetch from backend
  const mockBookings = [
    {
      id: 'BK123456789',
      experience: {
        id: '1',
        name: 'Tokyo Skytree',
        image: 'https://cdn.pixabay.com/photo/2020/02/05/16/10/tokyo-skytree-4821334_1280.jpg',
        location: 'Tokyo, Japan',
        duration: '2-3 hours'
      },
      selectedDate: '2024-12-15',
      ticketQuantities: { adult: 2, child: 1, senior: 0 },
      totalPrice: 65,
      guestDetails: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
      },
      paymentMethod: 'online',
      paymentId: 'pay_123456789',
      bookingDate: '2024-11-10T10:30:00Z',
      status: 'confirmed'
    },
    {
      id: 'BK987654321',
      experience: {
        id: '13',
        name: 'Eiffel Tower',
        image: 'https://cdn.pixabay.com/photo/2017/09/26/20/13/eiffel-2789943_640.jpg',
        location: 'Paris, France',
        duration: '1-2 hours'
      },
      selectedDate: '2024-12-20',
      ticketQuantities: { adult: 1, child: 0, senior: 0 },
      totalPrice: 25,
      guestDetails: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
      },
      paymentMethod: 'venue',
      paymentId: null,
      bookingDate: '2024-11-08T14:20:00Z',
      status: 'pending_payment'
    },
    {
      id: 'BK555666777',
      experience: {
        id: '7',
        name: 'Big Ben',
        image: 'https://cdn.pixabay.com/photo/2017/09/26/20/13/eiffel-2789943_640.jpg',
        location: 'London, UK',
        duration: '1 hour'
      },
      selectedDate: '2024-11-25',
      ticketQuantities: { adult: 3, child: 0, senior: 1 },
      totalPrice: 95,
      guestDetails: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
      },
      paymentMethod: 'online',
      paymentId: 'pay_555666777',
      bookingDate: '2024-10-15T09:15:00Z',
      status: 'completed'
    }
  ];

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

    // Simulate API call
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // In real app: const response = await fetch('/api/bookings');
        // const data = await response.json();
        
        // Using mock data for demo
        setTimeout(() => {
          setBookings(mockBookings);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

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
      // In real app: await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      
      // Update local state for demo
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
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

  const handleDownloadTicket = (booking) => {
    // Simulate ticket download
    alert(`Ticket for ${booking.experience.name} downloaded!`);
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
                <div className="booking-image">
                  <img src={booking.experience.image} alt={booking.experience.name} />
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
                        >
                          📄 Download Ticket
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