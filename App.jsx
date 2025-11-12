import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import StackNavigation from './src/Navigations/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/Context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
