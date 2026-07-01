import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user profile on startup:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic,
        });
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${res.data.name}!`);
        return { success: true };
      } else {
        toast.error(res.message || 'Invalid email or password');
        return { success: false, message: res.message };
      }
    } catch (error) {
      toast.error('An error occurred during login. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await api.register({ name, email, password });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic,
        });
        setIsAuthenticated(true);
        toast.success(`Registration successful! Welcome, ${res.data.name}`);
        return { success: true };
      } else {
        toast.error(res.message || 'Registration failed');
        return { success: false, message: res.message };
      }
    } catch (error) {
      toast.error('An error occurred during registration.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Backend logout failed/ignored:', e);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      if (res.success) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic,
        });
        toast.success('Profile updated successfully!');
        return { success: true };
      } else {
        toast.error(res.message || 'Failed to update profile');
        return { success: false, message: res.message };
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred updating profile');
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
