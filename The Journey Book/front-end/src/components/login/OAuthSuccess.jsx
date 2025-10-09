import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            try {
                console.log('🔄 Starting OAuth2 processing...');

                // Method 1: Try to get user data from backend
                try {
                    const response = await fetch('https://the-journey-book-backend.onrender.com/api/auth/oauth2/success', {
                        method: 'GET',
                        credentials: 'include', // Important for cookies
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                    console.log('📡 Backend response status:', response.status);

                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Backend OAuth2 success:', data);
                        
                        if (data.user && data.token) {
                            login(data.user, data.token);
                            navigate('/', { replace: true });
                            return;
                        }
                    } else {
                        console.log('❌ Backend returned error:', response.status);
                        const errorData = await response.json().catch(() => null);
                        console.log('Error details:', errorData);
                    }
                } catch (backendError) {
                    console.log('❌ Backend call failed:', backendError);
                }

                // Method 2: Check URL parameters for OAuth2 data
                const urlParams = new URLSearchParams(window.location.search);
                const error = urlParams.get('error');
                const code = urlParams.get('code');
                
                console.log('🔍 URL Parameters:', { error, code });

                if (error) {
                    console.error('❌ OAuth2 error from URL:', error);
                    navigate('/login', {
                        state: { error: `Google login failed: ${error}` },
                        replace: true
                    });
                    return;
                }

                // Method 3: If we have a code, try to exchange it for token
                if (code) {
                    console.log('🔄 Exchanging authorization code for token...');
                    try {
                        const tokenResponse = await fetch('https://the-journey-book-backend.onrender.com/api/auth/oauth2/token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ code })
                        });

                        if (tokenResponse.ok) {
                            const tokenData = await tokenResponse.json();
                            console.log('✅ Token exchange successful:', tokenData);
                            
                            if (tokenData.user && tokenData.token) {
                                login(tokenData.user, tokenData.token);
                                navigate('/', { replace: true });
                                return;
                            }
                        }
                    } catch (tokenError) {
                        console.error('❌ Token exchange failed:', tokenError);
                    }
                }

                // If all methods fail, show generic error
                console.error('💥 All OAuth2 methods failed');
                navigate('/login', {
                    state: { error: 'Google login failed. Please try again or use email login.' },
                    replace: true
                });

            } catch (error) {
                console.error('💥 OAuth2 processing failed:', error);
                navigate('/login', {
                    state: { error: 'Login failed. Please try again.' },
                    replace: true
                });
            }
        };

        // Start processing
        handleOAuthSuccess();
    }, [login, navigate]);

    return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Completing Google login...</p>
            <p className="text-muted small">This may take a few moments</p>
        </div>
    );
};

export default OAuthSuccess;