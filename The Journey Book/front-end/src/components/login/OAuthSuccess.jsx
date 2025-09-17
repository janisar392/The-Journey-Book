import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from backend after OAuth success
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/oauth2/success', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    login(data.user, data.token);
                    navigate('/tours');
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('OAuth error:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [login, navigate]);

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