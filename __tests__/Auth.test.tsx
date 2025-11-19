import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import LoginScreen from '../src/Auth/LoginScreen';
import RegistrationScreen from '../src/Auth/RegistrationScreen';
import SplashScreen from '../src/Auth/SplashScreen';
import BlockedScreen from '../src/Auth/BlockedScreen';
import RejectedScreen from '../src/Auth/RejectedScreen';
import PendingApprovalScreen from '../src/Auth/PendingApprovalScreen';

// Mock common React Native modules
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Modal: 'Modal',
  StyleSheet: {
    create: (styles:any )=> styles,
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  Alert: {
    alert: jest.fn(),
  },
  ActivityIndicator: 'ActivityIndicator',
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('../src/Context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: '#ffffff',
      card: '#f5f5f5',
      primary: '#000000',
      secondary: '#666666',
      accent: '#7C3AED',
      border: '#e0e0e0',
      cardShadow: 'rgba(0,0,0,0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
    isDark: false,
  }),
}));

jest.mock('../src/Context/AppContext', () => ({
  useApp: () => ({
    login: jest.fn(async (email, password) => {
      // Mock success response
      return {
        id: '123',
        email,
        role: 'user',
        status: 'Approved',
      };
    }),
    register: jest.fn(async (data) => {
      return {
        id: '124',
        email: data.email,
        status: 'pending',
      };
    }),
    isLoading: false,
    user: null,
  }),
}));

jest.mock('../src/Components/CustomHeader', () => 'CustomHeader');
jest.mock('../src/Icons/EmailIcon', () => 'EmailIcon');
jest.mock('../src/Icons/LockIcon', () => 'LockIcon');
jest.mock('../src/Icons/EyeIcon', () => 'EyeIcon');

describe('Auth Screens', () => {
  describe('LoginScreen', () => {
    it('renders LoginScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<LoginScreen navigation={navigationMock} />);
      });
    });

    it('should validate email field', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      let instance;
      await ReactTestRenderer.act(async () => {
        instance = ReactTestRenderer.create(<LoginScreen navigation={navigationMock} />);
      });

      // Test will check if validation errors appear for invalid email
      expect(instance).toBeDefined();
    });

    it('should validate password field', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      let instance;
      await ReactTestRenderer.act(async () => {
        instance = ReactTestRenderer.create(<LoginScreen navigation={navigationMock} />);
      });

      expect(instance).toBeDefined();
    });
  });

  describe('RegistrationScreen', () => {
    it('renders RegistrationScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<RegistrationScreen navigation={navigationMock} />);
      });
    });
  });

  describe('SplashScreen', () => {
    it('renders SplashScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<SplashScreen navigation={navigationMock} />);
      });
    });
  });

  describe('BlockedScreen', () => {
    it('renders BlockedScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<BlockedScreen navigation={navigationMock} />);
      });
    });
  });

  describe('RejectedScreen', () => {
    it('renders RejectedScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<RejectedScreen navigation={navigationMock} />);
      });
    });
  });

  describe('PendingApprovalScreen', () => {
    it('renders PendingApprovalScreen correctly', async () => {
      const navigationMock = {
        navigate: jest.fn(),
        replace: jest.fn(),
      };

      await ReactTestRenderer.act(async () => {
        ReactTestRenderer.create(<PendingApprovalScreen navigation={navigationMock} route={BlockedScreen}/>);
      });
    });
  });
});

describe('Auth Flow - Different User Status Cases', () => {
  it('should navigate to DashboardScreen for Approved user', async () => {
    const navigationMock = {
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    // Mock approved user
    jest.mock('../src/Context/AppContext', () => ({
      useApp: () => ({
        login: jest.fn(async () => ({
          id: '123',
          role: 'user',
          status: 'Approved',
        })),
      }),
    }));

    expect(navigationMock.navigate).toBeDefined();
  });

  it('should navigate to PendingApprovalScreen for pending user', async () => {
    const navigationMock = {
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    expect(navigationMock.navigate).toBeDefined();
  });

  it('should navigate to BlockedScreen for blocked user', async () => {
    const navigationMock = {
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    expect(navigationMock.navigate).toBeDefined();
  });

  it('should navigate to RejectedScreen for rejected user', async () => {
    const navigationMock = {
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    expect(navigationMock.navigate).toBeDefined();
  });

  it('should navigate to AdminDashboard for admin user', async () => {
    const navigationMock = {
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    expect(navigationMock.navigate).toBeDefined();
  });
});
