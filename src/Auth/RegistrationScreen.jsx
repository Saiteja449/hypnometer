import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';

import UserIcon from '../Icons/UserIcon';
import EmailIcon from '../Icons/EmailIcon';
import PhoneIcon from '../Icons/PhoneIcon';
import LockIcon from '../Icons/LockIcon';
import EyeIcon from '../Icons/EyeIcon';

const { width } = Dimensions.get('window');

const RegistrationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { registerUser, isLoading } = useApp();
  const styles = getStyles(theme);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
      };
      const { success, errors: apiErrors } = await registerUser(payload);
      if (success) {
        navigation.replace('DashboardScreen');
      } else {
        if (apiErrors) {
          const newErrors = {};
          for (const key in apiErrors) {
            // Map API error keys (e.g., 'first_name') to form data keys (e.g., 'firstName')
            const formKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            newErrors[formKey] = apiErrors[key][0]; // Take the first error message
          }
          setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
          if (apiErrors.general) {
            Alert.alert('Error', apiErrors.general);
          }
        } else {
          Alert.alert('Error', 'Failed to create account. Please try again.');
        }
      }
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
      <CustomHeader title="Create Account" showThemeToggle={false} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>Tell us about yourself</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.nameRow}>
            {/* First Name Input */}
            <View style={styles.halfInput}>
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.firstName && styles.inputError,
                  ]}
                >
                  <View style={styles.inputIcon}>
                    <UserIcon />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={text => updateFormData('firstName', text)}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>
            </View>

            {/* Last Name Input */}
            <View style={styles.halfInput}>
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.lastName && styles.inputError,
                  ]}
                >
                  <View style={styles.inputIcon}>
                    <UserIcon />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={text => updateFormData('lastName', text)}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View
              style={[styles.inputWrapper, errors.email && styles.inputError]}
            >
              <View style={styles.inputIcon}>
                <EmailIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={text => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.secondary}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View
              style={[styles.inputWrapper, errors.phone && styles.inputError]}
            >
              <View style={styles.inputIcon}>
                <PhoneIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={text => updateFormData('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor={theme.secondary}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
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
                placeholder="Password"
                value={formData.password}
                onChangeText={text => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                placeholderTextColor={theme.secondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <EyeIcon open={!showPassword} />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword && styles.inputError,
              ]}
            >
              <View style={styles.inputIcon}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={text => updateFormData('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor={theme.secondary}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <EyeIcon open={!showConfirmPassword} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              Sign In
            </Text>
          </Text>
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
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 30,
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
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    formSection: {
      gap: 16,
    },
    nameRow: {
      flexDirection: 'row',
      gap: 12,
    },
    halfInput: {
      flex: 1,
    },
    inputContainer: {
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
    eyeIcon: {
      padding: 4,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 6,
      marginLeft: 4,
    },
    signUpButton: {
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
    signUpButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: '#FFFFFF',
    },
    footer: {
      marginTop: 30,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    loginLink: {
      color: theme.accent,
      fontFamily: 'Nunito-SemiBold',
    },
  });

export default RegistrationScreen;
