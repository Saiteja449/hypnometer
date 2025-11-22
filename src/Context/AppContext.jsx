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
  const [sessions, setSessions] = useState([]);

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
          const userdata = {
            ...response.data.data,
            ...response.data.averageRatings,
          };
          console.log('USER', userdata);
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
        // console.log('User status updated successfully:', response.data);
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
      // console.log('login response data', response.data);

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
      // If server returned a structured error (e.g., { status: false, message: '...' })
      // prefer that message to provide a friendly error to UI consumers.
      const serverMessage = error?.response?.data?.message;
      console.error('Login error:', error.response?.data || error.message);
      if (serverMessage) {
        // Wrap into a normal Error so consumer components can use error.message
        throw new Error(serverMessage);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async userData => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}register`, userData);
      // console.log('Registration response data:', response.data);
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

  const sendOtp = async email => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}send-password-otp`, {
        email,
      });
      if (response.data && response.data.status) {
        return { success: true, message: response.data.message };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to send OTP',
        };
      }
    } catch (error) {
      console.error('Send OTP error:', error.response?.data || error.message);
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

  const resetPassword = async (email, newPassword, otp) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}update-password-otp`, {
        email,
        password: newPassword,
        otp: otp,
      });
      if (response.data && response.data.status) {
        return { success: true, message: response.data.message };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to reset password',
        };
      }
    } catch (error) {
      console.error(
        'Reset password error:',
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

  const createSession = async sessionData => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error('User not authenticated. Please log in.');
      }
      const payload = {
        ...sessionData,
        user_id: userId,
      };
      console.log('Creating session with payload:', payload);
      const response = await axios.post(
        `${API_BASE_URL}create-session`,
        payload,
      );
      console.log('RESPONSE', response.data);
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to create session',
        };
      }
    } catch (error) {
      console.error(
        'Create session error:',
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

  const getSessions = useCallback(
    async idParam => {
      const uid = idParam || userId;
      try {
        if (!uid) {
          throw new Error('User not authenticated. Please log in.');
        }
        setIsLoading(true);
        // console.log('Fetching sessions for userId:', uid);
        const response = await axios.get(`${API_BASE_URL}sessions/${uid}`);
        // console.log('Sessions fetched successfully:', response.data);
        if (response.data && response.data.success) {
          setSessions(response.data.sessions);
          return { success: true, data: response.data.sessions };
        } else {
          throw new Error(response.data.message || 'Failed to fetch sessions');
        }
      } catch (error) {
        console.error(
          'Get sessions error:',
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
    },
    [userId],
  );

  const getSessionRatings = useCallback(async sessionId => {
    if (!sessionId) {
      return { success: false, message: 'sessionId is required' };
    }
    try {
      setIsLoading(true);
      // console.log('Fetching ratings for sessionId:', sessionId);
      const response = await axios.get(
        `${API_BASE_URL}sessions/${sessionId}/ratings`,
      );
      // console.log('Session ratings response:', response.data);
      if (response.data && (response.data.success || response.data.status)) {
        const ratings = response.data.ratings || response.data.data || null;
        const session =
          response.data.session || response.data.data?.session || null;
        const average_ratings =
          response.data.average_ratings ||
          response.data.data?.average_ratings ||
          response.data.average_rating ||
          null;
        return { success: true, data: { session, ratings, average_ratings } };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to fetch session ratings',
        };
      }
    } catch (error) {
      console.error(
        'Get session ratings error:',
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
  }, []);

  useEffect(() => {
    getSessionRatings();
  }, []);

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

  const getAnalyticsData = async period => {
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}analytics/${userId}/sessions?period=${period}`,
      );
      console.log('Response', response.data);
      if (response.data && response.data.success) {
        return { success: true, data: response.data.sessions };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to fetch analytics data',
        };
      }
    } catch (error) {
      console.error(
        'Get analytics data error:',
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

  useEffect(() => {
    (async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          await checkUserSession();
          await getSessions(storedUserId);
        }
      } catch (err) {
        console.error('Startup session fetch error:', err);
      }
    })();
  }, [checkUserSession, getSessions]);

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
        register,
        getUserDetails,
        sendOtp,
        resetPassword,
        createSession,
        sessions,
        getSessions,
        getSessionRatings,
        getAnalyticsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
