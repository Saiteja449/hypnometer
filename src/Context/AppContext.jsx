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

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}login`, { email, password });
      console.log('Login response:', response.data);
      if (response.data && response.data.status) {
        setUser(response.data.user);
        setIsLoading(false);
        return { success: true, errors: null };
      } else {
        setIsLoading(false);
        return {
          success: false,
          errors: response.data.errors || {
            general: response.data.message || 'Login failed.',
          },
        };
      }
    } catch (error) {
      console.error('An error occurred during login:', error);

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

  return (
    <AppContext.Provider
      value={{ user, isLoading, registerUser, loginUser, API_BASE_URL }}
    >
      {children}
    </AppContext.Provider>
  );
};
