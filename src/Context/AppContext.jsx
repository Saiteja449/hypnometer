import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_BASE_URL = 'https://xhtmlreviews.in/hypnometer/api/';

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userId');
      setUserId(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserDetails = useCallback(
    async id => {
      try {
        const response = await axios.get(`${API_BASE_URL}get-user/${id}`);
        if (response.data && response.data.status) {
          const userdata = response.data.data;
          console.log('response.data.user', userdata);
          setUser(userdata);
          return userdata;
        } else {
          throw new Error(
            response.data.message || 'Failed to get user details',
          );
        }
      } catch (error) {
        console.error('Get user details error:', error);
        await logout();
        return false;
      }
    },
    [logout],
  );

  // Add the updateUserStatus function
  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      const response = await axios.post(`${API_BASE_URL}update-user-status`, {
        user_id: userId,
        status: status,
      });

      if (response.data && response.data.status) {
        console.log('User status updated successfully:', response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(
          response.data.message || 'Failed to update user status',
        );
      }
    } catch (error) {
      console.error(
        'Update user status error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}login`, {
        email,
        password,
      });
      console.log('login response data', response.data);

      if (response.data && response.data.status) {
        const { id } = response.data.user;
        await AsyncStorage.setItem('userId', id.toString());
        setUserId(id.toString());
        const result = await getUserDetails(id.toString());
        return result;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async userData => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}register`, userData);
      console.log('Registration response data:', response.data);
      if (response.data && response.data.status) {
        const { id } = response.data.user;
        await AsyncStorage.setItem('userId', id.toString());
        setUserId(id.toString());
        const result = await getUserDetails(id.toString());
        return result;
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Network error or server is unreachable',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = useCallback(async () => {
    if (user && user.role === 'admin') {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}users`);
        if (response.data && response.data.status) {
          console.log('response.data.data', response.data.data);
          setAllUsers(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch all users');
        }
      } catch (error) {
        console.error('Fetch all users error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  const checkUserSession = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        const result = await getUserDetails(storedUserId);
        return result;
      }
    } catch (error) {
      console.error('Check user session error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getUserDetails]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <AppContext.Provider
      value={{
        userId,
        user,
        isLoading,
        login,
        logout,
        checkUserSession,
        allUsers,
        fetchAllUsers,
        updateUserStatus,
        register, // Add this to the context value
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
