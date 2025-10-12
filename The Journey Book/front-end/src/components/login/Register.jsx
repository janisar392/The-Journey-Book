import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Base URL configuration - Change this for production
    const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
    // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleGoogleLogin = () => {
    console.log('Initiating Google OAuth from register...');
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Auto-login after successful registration
                const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    login(loginData.user, loginData.token);
                    navigate('/');
                } else {
                    setError(loginData.message || 'Auto-login failed. Please log in manually.');
                    navigate('/login');
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Form Side - Left */}
            <div className="register-form-side">
                <div className="register-form-container">
                    <div className="register-header">
                        <h2>Create Account</h2>
                        <p>Join us and start your journey</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <div className="input-with-icon">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-with-icon">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-with-icon">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-with-icon">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="agree-terms">
                                <input type="checkbox" required />
                                <span className="checkmark"></span>
                                I agree to the <a href="#terms" className="terms-link">Terms & Conditions</a>
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="register-button">
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
                            ) : (
                                <><i className="fas fa-user-plus"></i> Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="register-divider">
                        <span>or sign up with</span>
                    </div>

                    <div className="social-register">
                        <button 
                            type="button" 
                            className="social-btn google-btn"
                            onClick={handleGoogleLogin}
                        >
                            <i className="fab fa-google"></i>
                            Google
                        </button>
                        <button type="button" className="social-btn facebook-btn">
                            <i className="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                    </div>

                    <div className="register-footer">
                        <p>Already have an account? <Link to="/login" className="login-link">Sign in here</Link></p>
                    </div>
                </div>
            </div>

            {/* Welcome Side - Right */}
            <div className="register-welcome-side">
                <div className="welcome-overlay">
                    <h1>Start Your Adventure</h1>
                    <p>Create your account and discover amazing travel experiences around the world. Join our community of explorers today!</p>
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <i className="fas fa-globe-americas"></i>
                            <span>Explore worldwide destinations</span>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-tag"></i>
                            <span>Exclusive deals and offers</span>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-heart"></i>
                            <span>Personalized travel recommendations</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;