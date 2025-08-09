// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // { id, name, email, role, ... }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // load current user if token present
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUser();
      setUser(res.data);
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
    const res = await loginUser(credentials); // expects { token, user } OR { token }
    // backend may return token and user; if not, loadUser will fetch /me
    if (res.data?.token) localStorage.setItem('token', res.data.token);
    await loadUser();
    const role = res.data.user?.role || (window.localStorage.getItem('roleFromMe') || (await getCurrentUser().then(r=>r.data.role).catch(()=>null)));
    // redirect based on role (if user loaded, use user.role)
    const actualRole = (res.data.user && res.data.user.role) || (user && user.role);
    if (actualRole === 'admin') navigate('/admin');
    else navigate('/vote');
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
