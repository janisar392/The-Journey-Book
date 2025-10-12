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
        
        console.log('OAuthSuccess: Code received:', code ? 'YES' : 'NO');
        console.log('OAuthSuccess: Full URL search:', location.search);

        if (code) {
            try {
                console.log('OAuthSuccess: Calling backend callback...');
                const response = await fetch(`${BASE_URL}/api/auth/auth0/callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });

                console.log('OAuthSuccess: Backend response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('OAuthSuccess: Login data received:', data);
                    console.log('OAuthSuccess: Calling login function...');
                    login(data.user, data.token);
                    console.log('OAuthSuccess: Navigating to home...');
                    navigate('/', { replace: true });
                } else {
                    const errorData = await response.json();
                    console.error('OAuthSuccess: Backend error:', errorData);
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('OAuthSuccess: Network error:', error);
                navigate('/login', { replace: true });
            }
        } else {
            console.error('OAuthSuccess: No code in URL');
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