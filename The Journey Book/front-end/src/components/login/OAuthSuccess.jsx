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
                console.log('🔄 OAuthSuccess: Starting Google login processing...');

                // Wait longer for OAuth2 to complete
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Try endpoints in order
                const endpoints = [
                    '/api/auth/oauth2/user',
                    '/api/auth/oauth2/success'
                ];

                for (const endpoint of endpoints) {
                    try {
                        console.log(`🔄 Trying endpoint: ${endpoint}`);
                        const response = await fetch(`${BASE_URL}${endpoint}`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                            },
                        });

                        console.log(`📡 ${endpoint} Status:`, response.status);

                        if (response.ok) {
                            const data = await response.json();
                            console.log(`✅ ${endpoint} SUCCESS:`, data);
                            
                            if (data.user && data.token) {
                                console.log('🎉 Login successful!');
                                login(data.user, data.token);
                                navigate('/', { replace: true });
                                return;
                            }
                        } else {
                            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                            console.log(`❌ ${endpoint} Error:`, errorData);
                        }
                    } catch (error) {
                        console.log(`❌ ${endpoint} Failed:`, error.message);
                    }
                }

                // All endpoints failed
                console.error('💥 All OAuth2 endpoints failed');
                navigate('/login', {
                    state: { error: 'Google login failed. Please try email login or contact support.' },
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
            <p className="text-muted small">This may take a few moments</p>
        </div>
    );
};

export default OAuthSuccess;