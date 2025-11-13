import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { checkLoginStatus } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial value for scale: 0.5

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Fade in over 1.5 seconds
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3, // Controls "bounciness"
        tension: 40, // Controls speed
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation, check login status
      checkLoginStatus(navigation);
    });
  }, [fadeAnim, scaleAnim, checkLoginStatus, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 48,
      fontFamily: 'Nunito-Bold', // Assuming Nunito-Bold is available
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
          opacity: fadeAnim, // Bind opacity to animated value
          transform: [{ scale: scaleAnim }], // Bind scale to animated value
        }}
      >
        <Text style={styles.logoText}>HypnoMeter</Text>
        <Text style={styles.tagline}>Measure Your Focus</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
