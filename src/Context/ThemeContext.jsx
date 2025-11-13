// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// --- Define Color Schemes ---
const LightColors = {
  background: '#FFFFFF',
  card: '#F8F8F8',
  primary: '#2D3748', // Dark text
  secondary: '#718096', // Gray text
  accent: '#8641f4', // Purple accent
  border: '#E2E8F0',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
  cardShadowOpacity: 0.1, // Added
  buttonText: '#FFFFFF', // Added
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  danger: '#EF4444', // Red
};

const DarkColors = {
  background: '#121212',
  card: '#1D1D1D',
  primary: '#FFFFFF', // Light text
  secondary: '#A0AEC0', // Gray text
  accent: '#A673FF', // Lighter purple accent for contrast
  border: '#2D3748',
  cardShadow: 'rgba(255, 255, 255, 0.1)',
  cardShadowOpacity: 0.2, // Added
  buttonText: '#FFFFFF', // Added
  success: '#34D399', // Lighter Green for dark mode
  warning: '#FBBF24', // Lighter Orange for dark mode
  danger: '#F87171', // Lighter Red for dark mode
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState(systemColorScheme);

  const theme = colorScheme === 'dark' ? DarkColors : LightColors;
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
