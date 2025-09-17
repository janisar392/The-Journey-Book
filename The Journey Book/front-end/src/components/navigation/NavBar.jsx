import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ADD useNavigate
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // ADD this

    const handleLogout = () => {
        logout();
        navigate('/login'); // ADD navigation after logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                {/* Brand Logo with Image */}
                <Link className="navbar-brand" to="/">
                    <div className="brand-container">
                        <img 
                            src="/logo.png" 
                            alt="Tour Planner Logo" 
                            className="navbar-logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className="logo-placeholder" style={{display: 'none'}}>✈️</div>
                        <span className="brand-text">The Journey Book</span>
                    </div>
                </Link>

                {/* Mobile Toggle Button */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Center Navigation Items */}
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/explore">
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/destinations">
                                Top Destinations
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/bookings">
                                Bookings
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/gallery">
                                Gallery
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">
                                Contact Us
                            </Link>
                        </li>
                    </ul>

                    {/* Right Side - Auth Buttons */}
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            // Logged In User Menu
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-trips">
                                        <i className="fas fa-suitcase me-1"></i>My Trips
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a 
                                        className="nav-link dropdown-toggle" 
                                        href="#" 
                                        id="navbarDropdown" 
                                        role="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-user me-1"></i>Profile
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/profile">
                                                <i className="fas fa-user-circle me-2"></i>My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/settings">
                                                <i className="fas fa-cog me-2"></i>Settings
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={handleLogout}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="fas fa-sign-out-alt me-2"></i>Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            // Logged Out User Menu
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link login-btn" to="/login">
                                        <i className="fas fa-sign-in-alt me-1"></i>Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link signup-btn" to="/register">
                                        <i className="fas fa-user-plus me-1"></i>Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;