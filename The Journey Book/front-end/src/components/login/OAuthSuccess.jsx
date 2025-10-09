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
        const response = await fetch(`${BASE_URL}/api/auth/oauth2/success`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          // Defensive check to ensure backend actually returned token & user
          if (data && data.user && data.token) {
            login(data.user, data.token);
            navigate('/');
          } else {
            console.error('Invalid OAuth response:', data);
            navigate('/login');
          }
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
