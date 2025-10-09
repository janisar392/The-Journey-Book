import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Base URL configuration - Change this for production
  const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
  // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

  // Use test key - replace with your actual key
  const RAZORPAY_KEY = 'rzp_test_RGAUVmOIy5JQnz';

  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnUrl: '/booking',
          message: 'Please login to complete your booking'
        }
      });
      return;
    }

    if (location.state?.experience) {
      setBookingData(location.state);
      setGuestDetails(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    } else {
      navigate('/');
    }
  }, [location.state, user, navigate]);

  // Load Razorpay script properly
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          console.log('Razorpay already loaded');
          setRazorpayLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Razorpay SDK loaded successfully');
          setRazorpayLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          console.error('Failed to load Razorpay SDK');
          setRazorpayLoaded(false);
          reject(new Error('Razorpay SDK failed to load'));
        };
        
        document.body.appendChild(script);
      });
    };

    loadRazorpay().catch(error => {
      console.error('Error loading Razorpay:', error);
    });
  }, []);

  // Replace your current debug useEffect with this:
useEffect(() => {
  if (bookingData) {
    const checkFormDetails = () => {
      const form = document.querySelector('.booking-form');
      const content = document.querySelector('.booking-content');
      
      if (form) {
        const rect = form.getBoundingClientRect();
        const style = window.getComputedStyle(form);
        
        console.log('🔍 FORM DETAILS:');
        console.log(' - Position:', rect.top, rect.left, rect.width, rect.height);
        console.log(' - Visible in viewport?', 
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        console.log(' - transform:', style.transform);
        console.log(' - margin:', style.margin);
        console.log(' - padding:', style.padding);
        console.log(' - width/height:', style.width, style.height);
      }
      
      if (content) {
        const contentRect = content.getBoundingClientRect();
        console.log('📦 CONTENT AREA:', contentRect.width, contentRect.height);
      }
    };

    checkFormDetails();
    setTimeout(checkFormDetails, 100);
  }
}, [bookingData]);

  const handleGuestDetailsChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const generateBookingId = () => {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  // SIMPLE DEMO RAZORPAY INTEGRATION
  const initiateRazorpayPayment = () => {
    if (!razorpayLoaded) {
      alert('Razorpay is still loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay not available. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    const { experience, totalPrice } = bookingData;

    // Simple options for demo
    const options = {
      key: RAZORPAY_KEY,
      amount: totalPrice * 100, // Convert to paise
      currency: 'INR',
      name: 'The Journey Book',
      description: `Booking for ${experience.name}`,
      image: 'https://cdn.pixabay.com/photo/2016/11/29/12/13/fence-1869401_1280.jpg', // Your logo
      handler: async (response) => {
        console.log('Payment successful:', response);
        
        // For demo - we'll assume payment is successful
        await completeBooking('online', response.razorpay_payment_id);
      },
      prefill: {
        name: guestDetails.fullName,
        email: guestDetails.email,
        contact: guestDetails.phone
      },
      notes: {
        address: 'The Journey Book Office',
        experience: experience.name
      },
      theme: {
        color: '#3498db'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
          setIsLoading(false);
        },
        escape: false, // Prevent closing with ESC key
        backdropclose: false // Prevent closing by clicking outside
      }
    };

    try {
      console.log('Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      alert('Error initiating payment. Please try again.');
      setIsLoading(false);
    }
  };

  const completeBooking = async (method, paymentId = null) => {
  const bookingId = generateBookingId();
  
  const bookingDetails = {
    ...bookingData,
    guestDetails,
    paymentMethod: method,
    paymentId: paymentId || (method === 'online' ? 'demo_payment_' + Date.now() : null),
    bookingId,
    bookingDate: new Date().toISOString(),
    status: method === 'online' ? 'confirmed' : 'pending_payment'
  };

  try {
    // Save booking to backend
    const bookingDataToSave = {
      bookingId: bookingId,
      userId: user.id, // Make sure user object has id
      experienceId: bookingData.experience.id,
      experienceName: bookingData.experience.name,
      experienceImage: bookingData.experience.image,
      location: bookingData.experience.location,
      duration: bookingData.experience.duration,
      selectedDate: bookingData.selectedDate,
      ticketQuantities: bookingData.ticketQuantities,
      totalPrice: bookingData.totalPrice,
      guestFullName: guestDetails.fullName,
      guestEmail: guestDetails.email,
      guestPhone: guestDetails.phone,
      specialRequests: guestDetails.specialRequests,
      paymentMethod: method,
      paymentId: paymentId || null,
      status: method === 'online' ? 'confirmed' : 'pending_payment'
    };

    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(bookingDataToSave)
    });

    if (!response.ok) {
      throw new Error('Failed to save booking');
    }

    const savedBooking = await response.json();
    console.log('Booking saved to backend:', savedBooking);

    // Navigate to confirmation page
    navigate('/booking-confirmation', {
      state: {
        bookingDetails
      }
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    // Still navigate to confirmation but show error message
    alert('Booking completed but failed to save details. Please contact support.');
    navigate('/booking-confirmation', {
      state: {
        bookingDetails
      }
    });
  }
};

  const handleConfirmBooking = async () => {
    // Validation
    if (!guestDetails.fullName || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill in all required guest details');
      return;
    }

    if (guestDetails.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === 'online') {
        // Wait a moment to ensure Razorpay is fully loaded
        setTimeout(() => {
          initiateRazorpayPayment();
        }, 500);
      } else {
        // Pay at venue
        await completeBooking('venue');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (!bookingData) {
    return <div className="loading">Loading booking details...</div>;
  }

  const { experience, selectedDate, ticketQuantities, totalPrice } = bookingData;

 console.log('🔍 RENDERING DEBUG:');
  console.log(' - bookingData:', bookingData);
  console.log(' - bookingData exists:', !!bookingData);
  console.log(' - experience exists:', !!bookingData?.experience);

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Complete Your Booking</h1>
          <p>Review your experience details and complete the booking process</p>
          {!razorpayLoaded && paymentMethod === 'online' && (
            <div className="razorpay-loading">
              <p>🔄 Loading payment system...</p>
            </div>
          )}
        </div>

        <div className="booking-content">
          {/* Left Column - Experience Summary */}
          <div className="booking-summary">
            <h2>Experience Summary</h2>
            
            <div className="experience-card">
              <img src={experience.image} alt={experience.name} />
              <div className="experience-info">
                <h3>{experience.name}</h3>
                <p className="location">📍 {experience.location}</p>
                <p className="rating">⭐ {experience.rating}</p>
                <p className="duration">⏱️ {experience.duration}</p>
              </div>
            </div>

            <div className="booking-details">
              <h4>Booking Details</h4>
              <div className="detail-row">
                <span>Date:</span>
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              
              <div className="ticket-breakdown">
                <h5>Tickets:</h5>
                {ticketQuantities.adult > 0 && (
                  <div className="ticket-row">
                    <span>Adult (13+):</span>
                    <span>{ticketQuantities.adult} x ${25} = ${ticketQuantities.adult * 25}</span>
                  </div>
                )}
                {ticketQuantities.child > 0 && (
                  <div className="ticket-row">
                    <span>Child (4-12):</span>
                    <span>{ticketQuantities.child} x ${15} = ${ticketQuantities.child * 15}</span>
                  </div>
                )}
                {ticketQuantities.senior > 0 && (
                  <div className="ticket-row">
                    <span>Senior (65+):</span>
                    <span>{ticketQuantities.senior} x ${20} = ${ticketQuantities.senior * 20}</span>
                  </div>
                )}
              </div>

              <div className="total-price">
                <span>Total Amount:</span>
                <span className="price">₹{totalPrice}</span>
              </div>
            </div>

            <div className="cancellation-policy">
              <h4>🎯 Cancellation Policy</h4>
              <p>Free cancellation up to 24 hours before the experience start time</p>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="booking-form">
            <h2>Guest Information</h2>
            
            <div className="form-section">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={guestDetails.fullName}
                onChange={handleGuestDetailsChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-section">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={guestDetails.email}
                onChange={handleGuestDetailsChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-section">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={guestDetails.phone}
                onChange={handleGuestDetailsChange}
                placeholder="Enter 10-digit phone number"
                required
                minLength="10"
                maxLength="10"
              />
            </div>

            <div className="form-section">
              <label>Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                value={guestDetails.specialRequests}
                onChange={handleGuestDetailsChange}
                placeholder="Any special requirements or requests..."
                rows="3"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="payment-section">
              <h3>Payment Method</h3>
              
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('online')}
                >
                  <div className="payment-radio">
                    <div className="radio-dot"></div>
                  </div>
                  <div className="payment-info">
                    <h4>💳 Pay Online</h4>
                    <p>Secure payment with Razorpay</p>
                  </div>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'venue' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('venue')}
                >
                  <div className="payment-radio">
                    <div className="radio-dot"></div>
                  </div>
                  <div className="payment-info">
                    <h4>🏛️ Pay at Venue</h4>
                    <p>Pay when you arrive at the experience</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'online' && (
                <div className="online-payment-info">
                  <p>🔒 Secure payment powered by Razorpay</p>
                  <p>You'll be redirected to Razorpay checkout</p>
                  <p><strong>Test Card: 4386 2894 0766 0153 "visa"</strong></p>
                  <p><strong>Test Card: 2305 3242 5784 8228 "mastercard"</strong></p>
                </div>
              )}

              {paymentMethod === 'venue' && (
                <div className="venue-payment-info">
                  <p>📋 You'll receive a booking reference</p>
                  <p>Pay when you check in at the venue</p>
                </div>
              )}
            </div>

            {/* Confirm Booking Button */}
            <button 
              className="confirm-booking-btn"
              onClick={handleConfirmBooking}
              disabled={isLoading || (paymentMethod === 'online' && !razorpayLoaded)}
            >
              {isLoading ? 'Processing...' : 
               paymentMethod === 'online' ? 
                 (razorpayLoaded ? 'Pay with Razorpay' : 'Loading Payment...') : 
                 'Confirm Booking (Pay at Venue)'}
            </button>

            <div className="security-notice">
              <p>🔒 Your information is secure and encrypted</p>
              {paymentMethod === 'online' && <p>Powered by Razorpay for secure payments</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;