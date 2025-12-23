import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuth, setIsAuth, loading, setLoading } = useContext(AuthContext);

  const tokenRefresh = async () => {
    try {
      const response = await fetch('http://localhost:3000/refreshToken', {
        method: 'POST',
        credentials: 'include',
      });
      const res = await response.json();
      console.log('Refresh response:', res);

      if (response.ok) {
        setIsAuth(true);
        setLoading(false);
        return true;
      } else {
        setIsAuth(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setIsAuth(false);
      setLoading(false);
      return false;
    }
  };

  const checkRefresh = async () => {
    try {
      const response = await fetch('http://localhost:3000/checkToken', {
        method: 'POST',
        credentials: 'include',
      });
      const res = await response.json();

      if (response.ok) {
        console.log('Access token valid:', res);
        setIsAuth(true);
        setLoading(false);
      } else {
        console.log('Access token expired, trying refresh...');
        const refreshed = await tokenRefresh();
        if (!refreshed) setIsAuth(false);
      }
    } catch (error) {
      console.error('Check error:', error);
      setIsAuth(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRefresh();
  }, []); // <-- run only once

  if (loading) {
    console.log('Loading auth state...');
    return <Loader/>
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
