import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import api from '../api/api';
const ProtectedRoute = ({ children }) => {
  const { isAuth, setIsAuth, loading, setLoading } = useContext(AuthContext);

const checkRefresh = async () => {
  try {
    // Step 1: validate access token (or refresh automatically)
    const response = await api.post("/checkToken");

    console.log("Access token valid or refreshed:", response.data);
    setIsAuth(true);
  } catch (error) {
    console.log(
      "Auth check failed:",
      error.response?.data?.msg || error.message
    );
    setIsAuth(false);
  } finally {
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
