import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        const processOAuth = async () => {
            try {
                console.log('🔄 OAuthSuccess: Processing Google login...');

                // Wait for OAuth2 redirect to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Try the NEW callback endpoint
                console.log('🔄 Calling OAuth2 callback endpoint...');
                const response = await fetch(`${BASE_URL}/oauth2/user`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                console.log('📡 Response status:', response.status);
                console.log('📡 Response headers:', response.headers);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ OAuth2 SUCCESS:', data);
                    
                    if (data.user && data.token) {
                        login(data.user, data.token);
                        navigate('/', { replace: true });
                        return;
                    }
                }

                // If failed, show the actual error
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('❌ OAuth2 FAILED:', errorData);
                
                navigate('/login', {
                    state: { 
                        error: errorData.message || 'Google login failed. Please try email login.' 
                    },
                    replace: true
                });

            } catch (error) {
                console.error('💥 OAuth2 processing error:', error);
                navigate('/login', {
                    state: { error: 'Network error during Google login' },
                    replace: true
                });
            }
        };

        processOAuth();
    }, [login, navigate, BASE_URL]);

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