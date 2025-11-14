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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
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
      const { success, user, errors: apiErrors } = await registerUser(payload);
      if (success && user) {
        if (!user.status) {
          navigation.replace('PendingApprovalScreen');
        } else {
          navigation.replace('DashboardScreen');
        }
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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCircle}>
            <UserIcon />
          </View>
          <Text style={styles.heroTitle}>Join Our Community</Text>
          <Text style={styles.heroSubtitle}>Create your account to get started</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Section 1: Basic Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.nameRow}>
              {/* First Name Input */}
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>First Name</Text>
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
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={text => updateFormData('firstName', text)}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>

              {/* Last Name Input */}
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Last Name</Text>
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
                    placeholder="Doe"
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

          {/* Divider */}
          <View style={styles.divider} />

          {/* Section 2: Contact Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            {/* Email Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[styles.inputWrapper, errors.email && styles.inputError]}
              >
                <View style={styles.inputIcon}>
                  <EmailIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="your.email@example.com"
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
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View
                style={[styles.inputWrapper, errors.phone && styles.inputError]}
              >
                <View style={styles.inputIcon}>
                  <PhoneIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChangeText={text => updateFormData('phone', text)}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholderTextColor={theme.secondary}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Section 3: Security */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            {/* Password Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Password</Text>
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
                  placeholder="••••••••"
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
              <Text style={styles.helperText}>Minimum 8 characters</Text>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
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
                  placeholder="••••••••"
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
          </View>
        </View>

        {/* Sign Up Button */}
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
      padding: 16,
      paddingBottom: 20,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 16,
    },
    heroCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    heroTitle: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 4,
    },
    heroSubtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
    },
    formCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    sectionContainer: {
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 12,
    },
    nameRow: {
      flexDirection: 'column',
      gap: 6,
    },
    halfInput: {
      flex: 1,
    },
    inputFieldContainer: {
      marginBottom: 8,
    },
    inputLabel: {
      fontSize: 13,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 6,
    },
    optionalBadge: {
      fontSize: 11,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      fontStyle: 'italic',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderWidth: 1.5,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      minHeight: 40,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    inputError: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
    },
    inputIcon: {
      marginRight: 0,
      justifyContent: 'center',
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      paddingVertical: 10,
    },
    eyeIcon: {
      padding: 6,
      marginLeft: 2,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 4,
      marginLeft: 2,
    },
    helperText: {
      color: theme.secondary,
      fontSize: 12,
      fontFamily: 'Nunito-Regular',
      marginTop: 4,
      marginLeft: 2,
    },
    signUpButton: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    signUpButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 12,
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
