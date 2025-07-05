import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is valid and set user data
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Set the token for all API calls
        api.setAuthToken(token);
        
        // Check if token is expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token has expired
          logout();
          return;
        }

        // Get current user profile
        const response = await api.get('/users/profile');
        
        if (response.data.success) {
          setCurrentUser(response.data.data);
          setIsAuthenticated(true);
          setIsAdmin(response.data.data.role === 'admin');
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login user
  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.role === 'admin');
        
        api.setAuthToken(response.data.token);
        console.log('Login successful, user role:', response.data.user.role);
        return { success: true };
      } else {
        console.warn('Login response without token:', response.data);
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received - backend might be down');
      } else {
        console.error('Error message:', error.message);
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    api.setAuthToken(null);
    navigate('/login');
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password' 
      };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      if (response.data.success) {
        setCurrentUser(response.data.data);
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
