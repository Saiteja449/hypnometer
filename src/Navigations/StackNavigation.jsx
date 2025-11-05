import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../Screens/DashboardScreen';
import NewSessionScreen from '../Screens/NewSessionScreen';
import AnalyticsScreen from '../Screens/AnalyticsScreen';
import SelfAssessmentScreen from '../Screens/SelfAssessment';
import SignUpScreen from '../Auth/SignUpScreen';
import PendingApprovalScreen from '../Auth/PendingApprovalScreen';
import LoginScreen from '../Auth/LoginScreen';
import AdminDashboard from '../Screens/Admin/AdminDashboard';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={SignUpScreen} name="SignUpScreen" />
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
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
