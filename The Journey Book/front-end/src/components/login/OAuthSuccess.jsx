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
        console.log('Fetching OAuth user data...');
        
        const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('OAuth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('OAuth response data:', data);

          if (data && data.user && data.token) {
            login(data.user, data.token);
            navigate('/');
          } else {
            console.error('Invalid OAuth response:', data);
            navigate('/login', { state: { error: 'Authentication failed' } });
          }
        } else {
          const errorText = await response.text();
          console.error('OAuth request failed:', response.status, errorText);
          navigate('/login', { state: { error: 'Authentication failed' } });
        }
      } catch (error) {
        console.error('OAuth error:', error);
        navigate('/login', { state: { error: 'Network error during authentication' } });
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