import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Completing login...');

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        const completeOAuthLogin = async () => {
            try {
                setStatus('Fetching user information...');
                
                // Try multiple endpoints to get user data
                const endpoints = [
                    '/api/auth/user',
                    '/api/auth/oauth2/success',
                    '/api/auth/oauth2/token'
                ];

                let userData = null;
                
                for (const endpoint of endpoints) {
                    try {
                        console.log(`Trying endpoint: ${endpoint}`);
                        const response = await fetch(`${BASE_URL}${endpoint}`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            console.log(`Success from ${endpoint}:`, data);
                            
                            if (data && data.user && data.token) {
                                userData = data;
                                break;
                            }
                        }
                    } catch (error) {
                        console.log(`Endpoint ${endpoint} failed:`, error);
                        continue;
                    }
                }

                if (userData) {
                    setStatus('Login successful! Redirecting...');
                    login(userData.user, userData.token);
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    setStatus('No user data received. Using manual approach...');
                    // Fallback: Redirect to login with instruction to try manual login
                    setTimeout(() => {
                        navigate('/login', { 
                            state: { 
                                message: 'Google login completed. Please try manual login with your Google email.' 
                            } 
                        });
                    }, 2000);
                }

            } catch (error) {
                console.error('OAuth completion error:', error);
                setStatus('Error occurred. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        completeOAuthLogin();
    }, [login, navigate, BASE_URL]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="mt-3">Google Authentication</h3>
            <p className="mt-2">{status}</p>
        </div>
    );
};

export default OAuthSuccess;