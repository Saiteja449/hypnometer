import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../Screens/DashboardScreen';
import NewSessionScreen from '../Screens/NewSessionScreen';
import AnalyticsScreen from '../Screens/AnalyticsScreen';
import SelfAssessmentScreen from '../Screens/SelfAssessment';
import RegistrationScreen from '../Auth/RegistrationScreen';
import PendingApprovalScreen from '../Auth/PendingApprovalScreen';
import LoginScreen from '../Auth/LoginScreen';
import AdminDashboard from '../Screens/Admin/AdminDashboard';
import AllSessionsScreen from '../Screens/AllSessionsScreen';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="RegistrationScreen"
    >
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={RegistrationScreen} name="RegistrationScreen" />
      <Stack.Screen
        component={PendingApprovalScreen}
        name="PendingApprovalScreen"
      />
      <Stack.Screen component={DashboardScreen} name="DashboardScreen" />
      <Stack.Screen component={AdminDashboard} name="AdminDashboard" />
      <Stack.Screen name="NewSessionScreen" component={NewSessionScreen} />
      <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} />
      <Stack.Screen
        name="SelfAssessmentScreen"
        component={SelfAssessmentScreen}
      />
      <Stack.Screen name="AllSessionsScreen" component={AllSessionsScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
