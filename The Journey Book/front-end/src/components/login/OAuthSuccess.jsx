import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OAuthSuccess.css'; // Optional: Add some styling

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Completing login...');

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setMessage('Fetching user information...');
                
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/user`, {
                    method: 'GET',
                    credentials: 'include', // CRITICAL: Include cookies/session
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('OAuth success data:', data);
                    
                    if (data.user && data.token) {
                        login(data.user, data.token);
                        setMessage('Login successful! Redirecting...');
                        setTimeout(() => navigate('/'), 1000);
                    } else {
                        throw new Error('Invalid response data');
                    }
                } else {
                    const errorData = await response.json();
                    console.error('OAuth failed:', errorData);
                    setMessage('Login failed. Redirecting to login...');
                    setTimeout(() => navigate('/login', { 
                        state: { error: errorData.message || 'Login failed' } 
                    }), 2000);
                }
            } catch (error) {
                console.error('OAuth error:', error);
                setMessage('Network error. Redirecting to login...');
                setTimeout(() => navigate('/login', { 
                    state: { error: 'Network error during login' } 
                }), 2000);
            }
        };

        // Add a small delay to ensure backend processing is complete
        setTimeout(fetchUserData, 500);
    }, [login, navigate, BASE_URL]);

    return (
        <div className="oauth-success-container">
            <div className="oauth-success-content">
                <div className="spinner"></div>
                <h2>Completing Login</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default OAuthSuccess;