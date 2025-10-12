import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
    // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

    useEffect(() => {
        const handleAuth0Callback = async () => {
            // Get the authorization code from URL parameters
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');

            if (code) {
                try {
                    const response = await fetch(`${BASE_URL}/api/auth/auth0/callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        login(data.user, data.token);
                        navigate('/');
                    } else {
                        const errorData = await response.json();
                        console.error('Auth0 callback error:', errorData);
                        navigate('/login', { state: { error: 'Authentication failed' } });
                    }
                } catch (error) {
                    console.error('Auth0 callback error:', error);
                    navigate('/login', { state: { error: 'Network error during authentication' } });
                }
            } else {
                // No code parameter, redirect to login
                navigate('/login', { state: { error: 'No authorization code received' } });
            }
        };

        handleAuth0Callback();
    }, [location, login, navigate, BASE_URL]);

    return (
        <div className="container text-center mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="mt-3 text-primary">Completing Authentication</h4>
                    <p className="text-muted">Please wait while we sign you in...</p>
                </div>
            </div>
        </div>
    );
};

export default OAuthSuccess;