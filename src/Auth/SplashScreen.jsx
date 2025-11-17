import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, isLoading, checkUserSession } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await checkUserSession();
      console.log('User', user);
      if (user) {
        if (user.role === 'admin') {
          navigation.replace('AdminDashboard');
        } else {
          switch (user.status) {
            case 'Approved':
              navigation.replace('DashboardScreen');
              break;
            case null:
              navigation.replace('PendingApprovalScreen');
              break;
            case 'Blocked':
              navigation.replace('BlockedScreen');
              break;
            case 'Rejected':
              navigation.replace('RejectedScreen');
              break;
            default:
              navigation.replace('LoginScreen');
              break;
          }
        }
      } else {
        navigation.replace('LoginScreen');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkUserSession, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
      letterSpacing: 2,
    },
    tagline: {
      fontSize: 18,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={styles.logoText}>HypnoMeter</Text>
        <Text style={styles.tagline}>Measure Your Focus</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
