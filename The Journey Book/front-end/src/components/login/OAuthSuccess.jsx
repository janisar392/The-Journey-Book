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
                console.log('Fetching OAuth2 user data...');
                
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response status:', response.status);
                
                // FIX: Check if response is OK first
                if (response.ok) {
                    const data = await response.json();
                    console.log('OAuth success data:', data);
                    
                    // FIX: Check if data exists and has required properties
                    if (data && data.user && data.token) {
                        login(data.user, data.token);
                        console.log('Login successful, redirecting to home...');
                        navigate('/');
                    } else {
                        console.error('Invalid data structure:', data);
                        navigate('/login', { 
                            state: { error: 'Invalid response from server' } 
                        });
                    }
                } else {
                    // FIX: Handle non-OK responses properly
                    try {
                        const errorData = await response.json();
                        console.error('OAuth failed with message:', errorData.message);
                        navigate('/login', { 
                            state: { error: errorData.message || 'Authentication failed' } 
                        });
                    } catch (parseError) {
                        console.error('OAuth failed with status:', response.status);
                        navigate('/login', { 
                            state: { error: `Authentication failed (Status: ${response.status})` } 
                        });
                    }
                }
            } catch (error) {
                console.error('OAuth network error:', error);
                navigate('/login', { 
                    state: { error: 'Network error during login' } 
                });
            }
        };

        fetchUserData();
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
            <p className="mt-3">Completing login... Please wait</p>
        </div>
    );
};

export default OAuthSuccess;