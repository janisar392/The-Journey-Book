import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Base URL configuration
    const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
    // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth0Login = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/auth0/login`);
            const data = await response.json();
            
            if (response.ok) {
                // Redirect to Auth0 login page
                window.location.href = data.redirectUrl;
            } else {
                setError('Failed to initiate login');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Auth0 login error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Image Side */}
            <div className="login-image-side">
                <div className="image-overlay">
                    <h1>Welcome Back</h1>
                    <p>Discover amazing travel experiences around the world</p>
                </div>
            </div>

            {/* Login Form Side */}
            <div className="login-form-side">
                <div className="login-form-container">
                    <div className="login-header">
                        <h2>Sign In</h2>
                        <p>Enter your credentials to continue</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
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

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#forgot" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" disabled={loading} className="login-button">
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
                            ) : (
                                <><i className="fas fa-sign-in-alt"></i> Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                        <button 
                            type="button" 
                            className="social-btn google-btn"
                            onClick={handleAuth0Login}
                        >
                            <i className="fab fa-google"></i>
                            Continue with Auth0
                        </button>
                        <button type="button" className="social-btn facebook-btn">
                            <i className="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/register" className="register-link">Create account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;