import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../Screens/DashboardScreen';
import NewSessionScreen from '../Screens/NewSessionScreen';
import AnalyticsScreen from '../Screens/AnalyticsScreen';
import SelfAssessment from '../Screens/SelfAssessment';
import RegistrationScreen from '../Auth/RegistrationScreen';
import PendingApprovalScreen from '../Auth/PendingApprovalScreen';
import LoginScreen from '../Auth/LoginScreen';
import AdminDashboard from '../Screens/Admin/AdminDashboard';
import AllSessionsScreen from '../Screens/AllSessionsScreen';
import SessionDetailScreen from '../Screens/SessionDetailScreen';
import SplashScreen from '../Auth/SplashScreen';
import { useApp } from '../Context/AppContext';
import BlockedScreen from '../Auth/BlockedScreen';
import RejectedScreen from '../Auth/RejectedScreen';
import ForgotPasswordScreen from '../Auth/ForgotPasswordScreen'; // Import the new screen
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="BlockedScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen component={LoginScreen} name="LoginScreen" />
        <Stack.Screen
          component={RegistrationScreen}
          name="RegistrationScreen"
        />
        <Stack.Screen
          component={PendingApprovalScreen}
          name="PendingApprovalScreen"
        />
        <Stack.Screen component={DashboardScreen} name="DashboardScreen" />
        <Stack.Screen component={AdminDashboard} name="AdminDashboard" />
        <Stack.Screen name="NewSessionScreen" component={NewSessionScreen} />
        <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} />
        <Stack.Screen name="SelfAssessmentScreen" component={SelfAssessment} />
        <Stack.Screen name="AllSessionsScreen" component={AllSessionsScreen} />
        <Stack.Screen name="SessionDetailScreen" component={SessionDetailScreen} />
        <Stack.Screen name="BlockedScreen" component={BlockedScreen} />
        <Stack.Screen name="RejectedScreen" component={RejectedScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
