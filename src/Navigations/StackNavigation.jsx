import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../Screens/DashboardScreen';
import NewSessionScreen from '../Screens/NewSessionScreen';
import AnalyticsScreen from '../Screens/AnalyticsScreen';
import SelfAssessmentScreen from '../Screens/SelfAssessment';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={DashboardScreen} name="DashboardScreen" />
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
