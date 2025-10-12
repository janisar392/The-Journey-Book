import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasProcessed = useRef(false);

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        // Reset the flag when location changes (new login attempt)
        hasProcessed.current = false;
    }, [location.search]);

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const handleAuth0Callback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            console.log('OAuthSuccess: Processing...', { code: !!code, error });

            // Handle OAuth errors
            if (error) {
                console.error('OAuthSuccess: Auth error:', error);
                navigate('/login', { 
                    replace: true,
                    state: { error: `Authentication failed: ${error}` }
                });
                return;
            }

            if (code) {
                try {
                    console.log('OAuthSuccess: Exchanging code for token...');
                    const response = await fetch(`${BASE_URL}/api/auth/auth0/callback`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });

                    console.log('OAuthSuccess: Response status:', response.status);

                    if (response.ok) {
                        const data = await response.json();
                        console.log('OAuthSuccess: Login successful');
                        
                        // Clear URL immediately to prevent reuse
                        window.history.replaceState({}, '', window.location.pathname);
                        
                        await login(data.user, data.token);
                        navigate('/', { replace: true });
                    } else {
                        const errorData = await response.json();
                        console.error('OAuthSuccess: Backend error:', errorData);
                        
                        // Clear URL on error too
                        window.history.replaceState({}, '', window.location.pathname);
                        
                        navigate('/login', { 
                            replace: true,
                            state: { error: errorData.message || 'Authentication failed' }
                        });
                    }
                } catch (error) {
                    console.error('OAuthSuccess: Network error:', error);
                    window.history.replaceState({}, '', window.location.pathname);
                    navigate('/login', { replace: true });
                }
            } else {
                console.log('OAuthSuccess: No code - redirecting to login');
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