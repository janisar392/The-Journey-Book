import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Base URL configuration - Change this for production
    const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
    // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

    useEffect(() => {
        // Fetch user data from backend after OAuth success
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    debugger;
                    const data = await response.json();
                    login(data.user, data.token);
                    navigate('/');
                } else {
                    debugger;
                    navigate('/login');
                }
            } catch (error) {
                console.error('OAuth error:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [login, navigate, BASE_URL]);

    return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Completing login...</p>
        </div>
    );
};

export default OAuthSuccess;