import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_BASE_URL = 'https://xhtmlreviews.in/hypnometer/api/';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async userData => {
    console.log(
      'Registering user with payload:',
      JSON.stringify(userData, null, 2),
    );
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}register`, userData);
      if (response.data) {
        setUser(response.data.user);
        setIsLoading(false);
        return { success: true, errors: null };
      } else {
        setIsLoading(false);
        return {
          success: false,
          errors: response.data.errors || {
            general: response.data.message || 'Registration failed.',
          },
        };
      }
    } catch (error) {
      console.error(
        'An error occurred during registration:',
        error.response.data,
      );
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        return { success: false, errors: error.response.data.errors };
      } else {
        return {
          success: false,
          errors: { general: error.message || 'An unexpected error occurred.' },
        };
      }
    }
  };

  const loginUser = async (email, password, navigation) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);
      if (response.data && response.data.status) {
        const userData = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        if (userData.status === 'approved') {
          navigation.replace('DashboardScreen');
        } else {
          navigation.replace('PendingApprovalScreen');
        }
        return { success: true, errors: null };
      } else {
        setIsLoading(false);
        const errorMessage = response.data.message || 'Login failed.';
        const errorType =
          errorMessage === 'Invalid credentials'
            ? 'invalid_credentials'
            : 'general';
        return {
          success: false,
          errors: response.data.errors || {
            general: errorMessage,
            type: errorType,
          },
        };
      }
    } catch (error) {
      console.error('An error occurred during login:', error);

      setIsLoading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.';
      const errorType =
        errorMessage === 'Invalid credentials'
          ? 'invalid_credentials'
          : 'general';

      if (error.response && error.response.data && error.response.data.errors) {
        return {
          success: false,
          errors: { ...error.response.data.errors, type: errorType },
        };
      } else {
        return {
          success: false,
          errors: { general: errorMessage, type: errorType },
        };
      }
    }
  };

  const checkLoginStatus = async navigation => {
    setIsLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        if (userData.status === 'approved') {
          navigation.replace('DashboardScreen');
        } else {
          navigation.replace('PendingApprovalScreen');
        }
      } else {
        navigation.replace('LoginScreen'); // No user found, go to login
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
      navigation.replace('LoginScreen'); // Error, go to login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        registerUser,
        loginUser,
        checkLoginStatus,
        API_BASE_URL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
