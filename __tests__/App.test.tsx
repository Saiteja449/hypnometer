import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native', () => ({
  // Mock common components
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  TextInput: 'TextInput',
  StyleSheet: {
    create: (styles) => styles,
  },
  Platform: {
    OS: 'ios', // or 'android'
    select: jest.fn((options) => options.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })), // Mock common screen dimensions
  },
  Animated: {
    Value: jest.fn(() => ({
      current: {
        interpolate: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    })),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    parallel: jest.fn((animations) => ({
      start: jest.fn((callback) => {
        animations.forEach(anim => anim.start());
        callback && callback();
      }),
    })),
    // Add other Animated methods as needed
  },
  Easing: {
    ease: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  useColorScheme: jest.fn(() => 'light'), // Mock useColorScheme to return 'light'
  NativeModules: {
    DevMenu: {
      show: jest.fn(),
      reload: jest.fn(),
      toggleElementInspector: jest.fn(),
    },
    // Add other native modules here if they cause issues
  },
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }) => <>{children}</>, // Mock NavigationContainer
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      replace: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

// Mock AppContext
jest.mock('../src/Context/AppContext', () => ({
  useApp: () => ({
    checkLoginStatus: jest.fn(),
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    isLoading: false,
    user: null,
    API_BASE_URL: 'mock-api-url',
  }),
  AppProvider: ({ children }) => <>{children}</>, // Mock AppProvider
}));

// Mock ThemeContext
jest.mock('../src/Context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: 'white',
      card: 'lightgray',
      primary: 'black',
      secondary: 'gray',
      accent: 'purple',
      border: 'lightgray',
      cardShadow: 'rgba(0,0,0,0.1)',
    },
    isDark: false,
    toggleTheme: jest.fn(),
    colorScheme: 'light',
  }),
  ThemeProvider: ({ children }) => <>{children}</>, // Mock ThemeProvider
}));

// Mock all screen components
jest.mock('../src/Screens/SplashScreen', () => 'SplashScreen');
jest.mock('../src/Auth/LoginScreen', () => 'LoginScreen');
jest.mock('../src/Auth/RegistrationScreen', () => 'RegistrationScreen');
jest.mock('../src/Auth/PendingApprovalScreen', () => 'PendingApprovalScreen');
jest.mock('../src/Screens/DashboardScreen', () => 'DashboardScreen');
jest.mock('../src/Screens/NewSessionScreen', () => 'NewSessionScreen');
jest.mock('../src/Screens/AllSessionsScreen', () => 'AllSessionsScreen');
jest.mock('../src/Screens/AnalyticsScreen', () => 'AnalyticsScreen');
jest.mock('../src/Screens/SelfAssessment', () => 'SelfAssessment');
jest.mock('../src/Screens/Admin/AdminDashboard', () => 'AdminDashboard');


test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
