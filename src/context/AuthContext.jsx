// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user if token exists
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (err) {
      console.warn('Failed to load user:', err?.response?.data || err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    navigate('/vote'); // Always go to voting panel
  };

  const register = async (payload) => {
    await registerUser(payload);
    navigate('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
