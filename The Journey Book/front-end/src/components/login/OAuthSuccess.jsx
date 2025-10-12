import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        const handleAuth0Callback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');

            if (code) {
                try {
                    console.log('Exchanging code for token...');
                    const response = await fetch(`${BASE_URL}/api/auth/auth0/callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Login successful, redirecting to home...');
                        login(data.user, data.token);
                        navigate('/', { replace: true }); // Force redirect to home
                    } else {
                        console.error('Auth0 callback failed');
                        navigate('/login', { replace: true });
                    }
                } catch (error) {
                    console.error('Auth0 callback error:', error);
                    navigate('/login', { replace: true });
                }
            } else {
                console.error('No authorization code found');
                navigate('/login', { replace: true });
            }
        };

        handleAuth0Callback();
    }, [location, login, navigate, BASE_URL]);

    return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Signing you in...</p>
        </div>
    );
};

export default OAuthSuccess;