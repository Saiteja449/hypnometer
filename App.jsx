import React from 'react';
import StackNavigation from './src/Navigations/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/Context/ThemeContext';

import { AppProvider } from './src/Context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
