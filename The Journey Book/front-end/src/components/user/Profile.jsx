import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Base URL for API calls
    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/bookings/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                setError('Failed to fetch bookings');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'confirmed': { color: 'success', text: 'Confirmed' },
            'pending_payment': { color: 'warning', text: 'Pending Payment' },
            'completed': { color: 'info', text: 'Completed' },
            'cancelled': { color: 'danger', text: 'Cancelled' }
        };
        
        const config = statusConfig[status] || { color: 'secondary', text: status };
        return (
            <span className={`badge bg-${config.color}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="profile-container">
            <div className="container py-5">
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-lg-3">
                        <div className="profile-sidebar card">
                            <div className="card-body text-center">
                                <div className="profile-avatar mb-3">
                                    <div className="avatar-circle">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <h4 className="mb-2">{user?.name || 'User'}</h4>
                                <p className="text-muted mb-3">{user?.email}</p>
                                
                                <div className="profile-stats mb-4">
                                    <div className="stat-item">
                                        <h5>{bookings.filter(b => b.status === 'confirmed').length}</h5>
                                        <p>Upcoming Trips</p>
                                    </div>
                                    <div className="stat-item">
                                        <h5>{bookings.filter(b => b.status === 'completed').length}</h5>
                                        <p>Past Trips</p>
                                    </div>
                                </div>

                                <nav className="profile-menu">
                                    <Link to="/profile" className="profile-menu-item active">
                                        <i className="fas fa-user me-2"></i>Profile
                                    </Link>
                                    <Link to="/my-trips" className="profile-menu-item">
                                        <i className="fas fa-suitcase me-2"></i>My Trips
                                    </Link>
                                    <Link to="/settings" className="profile-menu-item">
                                        <i className="fas fa-cog me-2"></i>Settings
                                    </Link>
                                    <Link to="/wishlist" className="profile-menu-item">
                                        <i className="fas fa-heart me-2"></i>Wishlist
                                    </Link>
                                    <Link to="/reviews" className="profile-menu-item">
                                        <i className="fas fa-star me-2"></i>Reviews
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        <div className="profile-content">
                            {/* Welcome Card */}
                            <div className="welcome-card card mb-4">
                                <div className="card-body">
                                    <h2 className="card-title">Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}!</h2>
                                    <p className="card-text">
                                        Manage your profile, view bookings, and update your preferences here.
                                    </p>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Personal Information</h4>
                                    <button className="btn btn-outline-primary btn-sm">
                                        <i className="fas fa-edit me-1"></i>Edit
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label>Full Name</label>
                                                <p>{user?.name || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label>Email Address</label>
                                                <p>{user?.email || 'Not set'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label>Phone Number</label>
                                                <p>+91 9608456392</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label>Member Since</label>
                                                <p>{new Date().toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long' 
                                                })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Recent Bookings</h4>
                                    <Link to="/my-trips" className="btn btn-link">
                                        View All
                                    </Link>
                                </div>
                                <div className="card-body">
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger">{error}</div>
                                    ) : bookings.length === 0 ? (
                                        <div className="text-center py-4">
                                            <i className="fas fa-suitcase fa-3x text-muted mb-3"></i>
                                            <h5>No bookings yet</h5>
                                            <p>Start planning your next adventure!</p>
                                            <Link to="/explore" className="btn btn-primary">
                                                Explore Destinations
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="bookings-list">
                                            {bookings.slice(0, 3).map((booking) => (
                                                <div key={booking.id} className="booking-item">
                                                    <div className="booking-image">
                                                        <img 
                                                            src={booking.experienceImage || 'https://via.placeholder.com/80'} 
                                                            alt={booking.experienceName}
                                                        />
                                                    </div>
                                                    <div className="booking-details">
                                                        <h6>{booking.experienceName}</h6>
                                                        <p className="text-muted mb-1">
                                                            <i className="fas fa-map-marker-alt me-1"></i>
                                                            {booking.location}
                                                        </p>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <small className="text-muted">
                                                                {formatDate(booking.selectedDate)}
                                                            </small>
                                                            {getStatusBadge(booking.status)}
                                                        </div>
                                                    </div>
                                                    <div className="booking-actions">
                                                        <Link 
                                                            to={`/booking/${booking.bookingId}`}
                                                            className="btn btn-outline-primary btn-sm"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card quick-action-card text-center mb-3">
                                        <div className="card-body">
                                            <div className="quick-action-icon mb-3">
                                                <i className="fas fa-suitcase"></i>
                                            </div>
                                            <h5>Plan a Trip</h5>
                                            <p>Start planning your next adventure</p>
                                            <Link to="/explore" className="btn btn-outline-primary">
                                                Explore Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card quick-action-card text-center mb-3">
                                        <div className="card-body">
                                            <div className="quick-action-icon mb-3">
                                                <i className="fas fa-heart"></i>
                                            </div>
                                            <h5>Wishlist</h5>
                                            <p>Save places you want to visit</p>
                                            <Link to="/wishlist" className="btn btn-outline-primary">
                                                View Wishlist
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card quick-action-card text-center mb-3">
                                        <div className="card-body">
                                            <div className="quick-action-icon mb-3">
                                                <i className="fas fa-share-alt"></i>
                                            </div>
                                            <h5>Share Experience</h5>
                                            <p>Write a review of your trip</p>
                                            <Link to="/reviews" className="btn btn-outline-primary">
                                                Write Review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;