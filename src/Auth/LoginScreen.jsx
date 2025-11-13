import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';

import { useApp } from '../Context/AppContext';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { loginUser } = useApp();
  const styles = getStyles(theme);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const EmailIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        stroke={theme.accent}
        strokeWidth="2"
      />
      <Path
        d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const LockIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="10"
        width="18"
        height="12"
        rx="3"
        stroke={theme.accent}
        strokeWidth="2"
      />
      <Path
        d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15" r="2" fill={theme.accent} />
    </Svg>
  );

  const validateCredentials = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateCredentials()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser(formData.email, formData.password);
      if (response.success) {
        navigation.replace('DashboardScreen');
      } else {
        Alert.alert('Login Failed', response.errors.general || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader title="Sign In" showThemeToggle={false} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Access your account to continue</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[styles.inputWrapper, errors.email && styles.inputError]}
            >
              <View style={styles.inputIcon}>
                <EmailIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={text => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.secondary}
                editable={!isLoading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputError,
              ]}
            >
              <View style={styles.inputIcon}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={text => updateFormData('password', text)}
                secureTextEntry
                placeholderTextColor={theme.secondary}
                editable={!isLoading}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 32,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    loginTypeContainer: {
      marginBottom: 32,
    },
    loginTypeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    toggleButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      gap: 8,
    },
    toggleButtonActive: {
      backgroundColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    toggleButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
    },
    toggleButtonTextActive: {
      color: '#FFFFFF',
    },
    formSection: {
      gap: 20,
    },
    inputContainer: {
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    inputError: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
    },
    inputIcon: {
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      paddingVertical: 14,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 6,
      marginLeft: 4,
    },
    loginButton: {
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonDisabled: {
      backgroundColor: '#C7B2F4',
      shadowOpacity: 0.1,
    },
    loginButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: '#FFFFFF',
    },
    footer: {
      marginTop: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    signUpLink: {
      color: theme.accent,
      fontFamily: 'Nunito-SemiBold',
    },
    otpHeader: {
      alignItems: 'center',
      marginBottom: 32,
    },
    otpTitle: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 8,
    },
    otpSubtitle: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    phoneNumberHighlight: {
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    otpInput: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 12,
      backgroundColor: theme.card,
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    otpInputFilled: {
      borderColor: theme.accent,
      backgroundColor: theme.card,
    },
    otpActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    resendButton: {
      padding: 8,
    },
    resendButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    changeNumberButton: {
      padding: 8,
    },
    changeNumberButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
    },
    verifyButton: {
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  });

export default LoginScreen;

