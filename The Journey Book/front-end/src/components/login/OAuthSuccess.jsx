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
                console.log('🔄 Starting OAuth2 processing...');

                // Try multiple endpoints
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

                        console.log(`📡 ${endpoint} response status:`, response.status);

                        if (response.ok) {
                            const data = await response.json();
                            console.log(`✅ ${endpoint} success:`, data);
                            
                            if (data.user && data.token) {
                                login(data.user, data.token);
                                navigate('/', { replace: true });
                                return;
                            }
                        } else {
                            const errorData = await response.json().catch(() => null);
                            console.log(`❌ ${endpoint} error:`, errorData);
                        }
                    } catch (error) {
                        console.log(`❌ ${endpoint} failed:`, error.message);
                    }
                }

                // All endpoints failed
                console.error('💥 All OAuth2 endpoints failed');
                navigate('/login', {
                    state: { error: 'Google login failed. Please try email login.' },
                    replace: true
                });

            } catch (error) {
                console.error('💥 OAuth2 processing failed:', error);
                navigate('/login', {
                    state: { error: 'Network error during Google login' },
                    replace: true
                });
            }
        };

        // Wait for OAuth2 redirect to complete
        setTimeout(() => {
            fetchUserData();
        }, 2000);

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