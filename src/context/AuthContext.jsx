import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '@services/api/authService';
import { setUser, clearUser } from '@features/auth/store/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      if (token) {
        const userData = await authService.getCurrentUser();
        setUserState(userData);
        setIsAuthenticated(true);
        dispatch(setUser(userData));
      }
    } catch (error) {
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token } = response;
      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, token);
      setUserState(userData);
      setIsAuthenticated(true);
      dispatch(setUser(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response;
      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, token);
      setUserState(newUser);
      setIsAuthenticated(true);
      dispatch(setUser(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    setUserState(null);
    setIsAuthenticated(false);
    dispatch(clearUser());
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
