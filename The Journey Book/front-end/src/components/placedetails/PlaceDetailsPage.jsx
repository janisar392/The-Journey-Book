import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PlaceDetailsPage.css';

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [experience, setExperience] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [ticketQuantities, setTicketQuantities] = useState({
    adult: 1,
    child: 0,
    senior: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Ticket prices
  const ticketPrices = {
    adult: 25,
    child: 15,
    senior: 20
  };

  // Calculate total
  const calculateTotal = () => {
    return (ticketQuantities.adult * ticketPrices.adult) +
           (ticketQuantities.child * ticketPrices.child) +
           (ticketQuantities.senior * ticketPrices.senior);
  };

  // Replace the entire transformToExperience function with this SIMPLE version:

const transformToExperience = (data) => {
  // If data is already in experience format, return it
  if (data.description && data.highlights) {
    return data;
  }

  // ALWAYS use the actual image from backend - this is the key fix!
  const actualImage = data.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800';

  // Enhanced descriptions for better demo (optional)
  const enhancedDescriptions = {
    '1': 'Experience breathtaking panoramic views of Tokyo from the tallest tower in Japan.',
    '2': 'Visit Tokyo\'s oldest temple, a beautifully preserved Buddhist temple dating back to 645 AD.',
    '3': 'Experience the world\'s busiest pedestrian crossing in the heart of Tokyo.',
    '4': 'A serene Shinto shrine dedicated to Emperor Meiji and Empress Shoken.',
    '5': 'Japan\'s oldest and largest museum, housing extensive art and archaeological artifacts.',
    '6': 'Tokyo\'s largest and most popular park, featuring museums and cherry blossoms.'
    // Add more IDs as you add more mock data
  };

  return {
    id: data.placeId || id,
    name: data.name || 'Experience',
    image: actualImage, // ← THIS IS THE FIX - always use backend image
    location: data.address || 'Location not specified',
    rating: data.rating || 4.5,
    description: enhancedDescriptions[data.placeId] || `Explore this amazing ${data.name} in ${data.address}. A must-visit destination for travelers.`,
    duration: data.duration || '1-2 hours',
    highlights: [
      'Unique cultural experience',
      'Great for photography',
      'Local guides available',
      'Family-friendly activity'
    ],
    included: [
      'Entry ticket',
      'Basic guide services',
      'Access to main areas',
      'Safety equipment if needed'
    ],
    importantInfo: [
      'Booking confirmation required',
      'Valid ID may be required',
      'Weather-dependent activities may change',
      'Free cancellation up to 24 hours before'
    ]
  };
};

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    // Fetch experience details
    const fetchExperience = async () => {
      setIsLoading(true);
      
      try {
        // If coming from search with location state, use that data
        if (location.state?.experience) {
          const transformedExperience = transformToExperience(location.state.experience);
          setExperience(transformedExperience);
        } else {
          // Try to fetch from backend or use mock data
          const transformedExperience = transformToExperience({ placeId: id });
          setExperience(transformedExperience);
        }
      } catch (error) {
        console.error('Error loading experience:', error);
        // Final fallback
        const fallbackExperience = transformToExperience({ placeId: id });
        setExperience(fallbackExperience);
      }
      
      setIsLoading(false);
    };

    fetchExperience();
  }, [id, location.state]);

  const handleTicketChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      setTicketQuantities(prev => ({
        ...prev,
        [type]: numValue
      }));
    }
  };

  const handleBookNow = () => {
    if (!user) {
      // Redirect to login with return URL
      navigate('/login', { 
        state: { 
          returnUrl: `/experience/${id}`,
          message: 'Please login to book this experience'
        }
      });
      return;
    }

    // Proceed to booking page
    navigate('/booking', {
      state: {
        experience: experience,
        selectedDate: selectedDate,
        ticketQuantities: ticketQuantities,
        totalPrice: calculateTotal()
      }
    });
  };

  if (isLoading) {
    return (
      <div className="place-details-container">
        <div className="loading">Loading experience details...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="place-details-container">
        <div className="error">
          <h2>Experience not found</h2>
          <p>The experience you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => navigate('/')}
            className="back-home-btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-details-container">
      {/* Hero Section */}
      <div className="hero-section">
        <img src={experience.image} alt={experience.name} className="hero-image" />
        <div className="hero-overlay">
          <h1 className="experience-title">{experience.name}</h1>
          <div className="experience-meta">
            <span className="location">📍 {experience.location}</span>
            <span className="rating">⭐ {experience.rating}</span>
            <span className="duration">⏱️ {experience.duration}</span>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          {/* Description */}
          <section className="description-section">
            <h2>About this experience</h2>
            <p>{experience.description}</p>
          </section>

          {/* Highlights */}
          <section className="highlights-section">
            <h2>Experience Highlights</h2>
            <div className="highlights-grid">
              {experience.highlights.map((highlight, index) => (
                <div key={index} className="highlight-card">
                  <span className="highlight-icon">✨</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section className="included-section">
            <h2>What's Included</h2>
            <ul className="included-list">
              {experience.included.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>
          </section>

          {/* Important Information */}
          <section className="info-section">
            <h2>Important Information</h2>
            <ul className="info-list">
              {experience.importantInfo.map((info, index) => (
                <li key={index}>📌 {info}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Booking Widget - Fixed Sidebar */}
        <div className="booking-widget">
          <div className="widget-content">
            <h3>Book This Experience</h3>
            
            {/* Availability Badge */}
            <div className="availability-badge">
              <span className="available-dot"></span>
              Available on your selected date
            </div>

            {/* Date Selection */}
            <div className="date-selection">
              <label>Select Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Ticket Selection */}
            <div className="ticket-selection">
              <h4>Select Tickets:</h4>
              
              <div className="ticket-type">
                <div className="ticket-info">
                  <span className="ticket-name">Adult (13+)</span>
                  <span className="ticket-price">${ticketPrices.adult}</span>
                </div>
                <div className="ticket-controls">
                  <button 
                    onClick={() => handleTicketChange('adult', ticketQuantities.adult - 1)}
                    disabled={ticketQuantities.adult <= 1}
                  >-</button>
                  <span>{ticketQuantities.adult}</span>
                  <button onClick={() => handleTicketChange('adult', ticketQuantities.adult + 1)}>+</button>
                </div>
              </div>

              <div className="ticket-type">
                <div className="ticket-info">
                  <span className="ticket-name">Child (4-12)</span>
                  <span className="ticket-price">${ticketPrices.child}</span>
                </div>
                <div className="ticket-controls">
                  <button 
                    onClick={() => handleTicketChange('child', ticketQuantities.child - 1)}
                    disabled={ticketQuantities.child <= 0}
                  >-</button>
                  <span>{ticketQuantities.child}</span>
                  <button onClick={() => handleTicketChange('child', ticketQuantities.child + 1)}>+</button>
                </div>
              </div>

              <div className="ticket-type">
                <div className="ticket-info">
                  <span className="ticket-name">Senior (65+)</span>
                  <span className="ticket-price">${ticketPrices.senior}</span>
                </div>
                <div className="ticket-controls">
                  <button 
                    onClick={() => handleTicketChange('senior', ticketQuantities.senior - 1)}
                    disabled={ticketQuantities.senior <= 0}
                  >-</button>
                  <span>{ticketQuantities.senior}</span>
                  <button onClick={() => handleTicketChange('senior', ticketQuantities.senior + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="total-price">
              <span>Total:</span>
              <span className="price">${calculateTotal()}</span>
            </div>

            {/* Book Button */}
            <button 
              className="book-now-btn"
              onClick={handleBookNow}
            >
              {user ? 'Book Now' : 'Login to Book'}
            </button>

            {/* Free Cancellation Badge */}
            <div className="cancellation-badge">
              ✅ Free cancellation up to 24 hours before experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;