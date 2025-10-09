import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token && email) {
      const user = { email, name: name || email.split('@')[0] };
      login(user, token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [login, navigate, searchParams]);

  return <div className="text-center mt-5">Logging you in...</div>;
};

export default OAuthSuccess;