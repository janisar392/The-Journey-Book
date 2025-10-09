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

                // FIX: Add credentials: 'include' to send cookies
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
                    method: 'GET',
                    credentials: 'include', // THIS IS CRITICAL - sends cookies
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
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
                    const errorData = await response.json();
                    console.log('Error details:', errorData);
                    
                    navigate('/login', {
                        state: { error: errorData.message || 'Google login failed' },
                        replace: true
                    });
                }

            } catch (error) {
                console.error('💥 OAuth2 processing failed:', error);
                navigate('/login', {
                    state: { error: 'Network error during Google login' },
                    replace: true
                });
            }
        };

        // Add delay to ensure OAuth2 redirect is complete
        setTimeout(() => {
            fetchUserData();
        }, 1000);

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