import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_BASE_URL = 'https://xhtmlreviews.in/hypnometer/api/';

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        userId,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
