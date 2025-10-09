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
                console.log('🔵 STEP 1: Starting OAuth2 success flow...');
                
                const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                console.log('🔵 STEP 2: Response status:', response.status);
                console.log('🔵 STEP 2: Response OK:', response.ok);

                // Check if response is OK before parsing
                if (!response.ok) {
                    console.error('❌ HTTP Error:', response.status, response.statusText);
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('🔵 STEP 3: Response data received:', data);

                // Check if we have the required data
                if (data && data.user && data.token) {
                    console.log('✅ STEP 4: OAuth2 successful!');
                    console.log('User data:', data.user);
                    console.log('Token received:', data.token ? 'YES' : 'NO');
                    
                    // Call login function
                    console.log('🔵 STEP 5: Calling login function...');
                    login(data.user, data.token);
                    
                    console.log('🔵 STEP 6: Navigating to home page...');
                    // Use replace: true to prevent going back to this page
                    navigate('/', { replace: true });
                } else {
                    console.error('❌ STEP 4: Missing user data or token in response');
                    console.log('User present:', !!data.user);
                    console.log('Token present:', !!data.token);
                    console.log('Full response:', data);
                    
                    navigate('/login', { 
                        replace: true,
                        state: { 
                            error: 'Login failed: Missing user information' 
                        }
                    });
                }

            } catch (error) {
                console.error('💥 STEP ERROR: OAuth2 failed completely:', error);
                console.error('Error details:', error.message);
                
                navigate('/login', { 
                    replace: true,
                    state: { 
                        error: `Google login failed: ${error.message}` 
                    }
                });
            }
        };

        // Small delay to ensure everything is loaded
        const timer = setTimeout(() => {
            fetchUserData();
        }, 1000);

        return () => clearTimeout(timer);
    }, [login, navigate, BASE_URL]);

    return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Completing Google login...</p>
            <p className="text-muted small">Please wait while we set up your account</p>
        </div>
    );
};

export default OAuthSuccess;