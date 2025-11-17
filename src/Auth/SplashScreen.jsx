import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial value for scale: 0.5

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 24,
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
