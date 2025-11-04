import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import StackNavigation from './src/Navigations/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;

