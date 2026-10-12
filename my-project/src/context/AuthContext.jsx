import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      authAPI.getMe()
        .then(res => {
          setUser(res.data.user);
        })
        .catch(err => {
          console.log('Ошибка восстановления сессии:', err);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roomcraft_theme');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};