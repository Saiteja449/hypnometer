import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import StackNavigation from './src/Navigations/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/Context/ThemeContext';

import { AppProvider } from './src/Context/AppContext';

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
