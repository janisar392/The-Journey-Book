import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://the-journey-book-backend.onrender.com/api/auth/oauth2/success', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          login(data.user, data.token);
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUser();
  }, [login, navigate]);

  return (
    <div className="text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Completing login...</p>
    </div>
  );
};

export default OAuthSuccess;