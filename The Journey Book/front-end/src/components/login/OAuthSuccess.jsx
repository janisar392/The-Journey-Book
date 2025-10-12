import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Fetching user data from /api/auth/user...');
                
                const response = await fetch(`${BASE_URL}/api/auth/user`, {
                    method: 'GET',
                    credentials: 'include', // IMPORTANT: Include cookies
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('User data received:', data);
                    
                    if (data && data.user && data.token) {
                        login(data.user, data.token);
                        console.log('Login successful!');
                        navigate('/');
                    } else {
                        throw new Error('Invalid response data');
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to get user:', errorData);
                    navigate('/login', { 
                        state: { error: errorData.message || 'Authentication failed' } 
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login', { 
                    state: { error: 'Network error. Please try again.' } 
                });
            }
        };

        // Wait a moment for the OAuth2 flow to complete
        setTimeout(fetchUserData, 1000);
    }, [login, navigate, BASE_URL]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Completing Google login...</p>
        </div>
    );
};

export default OAuthSuccess;