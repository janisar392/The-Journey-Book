import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🔄 OAuthSuccess: Checking URL parameters...');
        
        // Check for token in URL parameters (from success handler)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        console.log('📋 URL Parameters:', { token });

        if (token) {
            console.log('✅ Token found in URL, completing login...');
            // You might need to decode user data from URL or make a backend call
            // For now, let's try to get user data from backend
            fetchUserData(token);
        } else {
            console.log('❌ No token in URL, trying backend...');
            fetchUserData();
        }

        async function fetchUserData(existingToken = null) {
            try {
                const BASE_URL = 'https://the-journey-book-backend.onrender.com';
                
                if (existingToken) {
                    // If we have token, verify it and get user data
                    console.log('🔄 Verifying existing token...');
                    const response = await fetch(`${BASE_URL}/api/auth/verify`, {
                        headers: {
                            'Authorization': `Bearer ${existingToken}`
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        login(userData, existingToken);
                        navigate('/', { replace: true });
                        return;
                    }
                }

                // Fallback: try to get OAuth2 user data
                console.log('🔄 Falling back to OAuth2 user endpoint...');
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/user`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                console.log('📡 Response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ OAuth2 user data:', data);
                    
                    if (data.user && data.token) {
                        login(data.user, data.token);
                        navigate('/', { replace: true });
                    } else {
                        throw new Error('Missing user data in response');
                    }
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                    console.error('❌ OAuth2 failed:', errorData);
                    throw new Error(errorData.message || 'Authentication failed');
                }
            } catch (error) {
                console.error('💥 OAuth2 processing failed:', error);
                navigate('/login', {
                    state: { error: 'Google login failed. Please try email login.' },
                    replace: true
                });
            }
        }

    }, [login, navigate]);

    return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Completing Google login...</p>
            <p className="text-muted small">Please wait while we verify your session</p>
        </div>
    );
};

export default OAuthSuccess;