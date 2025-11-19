import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator, // Added for loading state in button
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import EmailIcon from '../Icons/EmailIcon';
import LockIcon from '../Icons/LockIcon';
import EyeIcon from '../Icons/EyeIcon';

import { useApp } from '../Context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { login } = useApp();
  const styles = getStyles(theme, isDark);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

  // --- Validation Logic (Kept as is) ---
  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (
          !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.trim())
        ) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleLogin = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        if (user.role === 'admin') {
          navigation.navigate('AdminDashboard');
        } else {
          switch (user.status) {
            case 'Approved':
              navigation.navigate('DashboardScreen');
              break;
            case null:
              navigation.navigate('PendingApprovalScreen');
              break;
            case 'Blocked':
              navigation.navigate('BlockedScreen');
              break;
            case 'Rejected':
              navigation.navigate('RejectedScreen');
              break;
            default:
              setModalTitle('Login Failed');
              setModalMessage('Unknown user status.');
              setModalButtons([{ text: 'OK' }]);
              setModalVisible(true);
              break;
          }
        }
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      const message =
        serverMessage || error?.message || 'An unexpected error occurred.';

      setModalTitle('Login Failed');
      setModalMessage(message);
      setModalButtons([{ text: 'OK' }]);
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    const error = validateField(field, value);
    setErrors({
      ...errors,
      [field]: error,
    });
  };

  // --- Render Functions ---

  const renderInputField = (
    field,
    placeholder,
    IconComponent,
    isPassword = false,
  ) => (
    <View style={styles.inputGroup}>
      <View
        style={[
          styles.inputWrapper,
          errors[field] && styles.inputError,
          isLoading && styles.inputWrapperDisabled,
        ]}
      >
        <View style={styles.iconContainer}>
          <IconComponent color={errors[field] ? '#EF4444' : theme.secondary} />
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={text => updateFormData(field, text)}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          autoCapitalize={field === 'email' ? 'none' : 'sentences'}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={theme.secondary + '90'}
          editable={!isLoading}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            disabled={isLoading}
          >
            <EyeIcon open={!showPassword} />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            {modalButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalButton,
                  button.style === 'cancel' && styles.modalButtonCancel,
                ]}
                onPress={() => {
                  setModalVisible(false);
                  button.onPress && button.onPress();
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    button.style === 'cancel' && styles.modalButtonTextCancel,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader title="Log In" showThemeToggle={false} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to your account to continue your journey.
            </Text>
          </View>

          {/* Form Fields */}
          {renderInputField('email', 'Email Address', EmailIcon)}
          {renderInputField('password', 'Password', LockIcon, true)}

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.forgotPasswordButton}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Footer/Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('RegistrationScreen')}
              >
                Register here
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      {renderModal()}
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    formContainer: {
      marginTop: 40, // Increased spacing from header
    },
    header: {
      alignItems: 'center',
      marginBottom: 48, // Increased spacing to form
    },
    title: {
      fontSize: 26, // Larger title
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    inputGroup: {
      marginBottom: 20, // Increased spacing between inputs
    },
    // Removed 'label' style

    // NEW INPUT STYLES (Icon integrated)
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14, // Slightly more rounded
      paddingHorizontal: 0, // Icons are contained within the wrapper
      height: 56, // Taller input field
    },
    inputWrapperDisabled: {
      opacity: 0.7,
      backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
    },
    inputError: {
      borderColor: '#EF4444',
      borderWidth: 2,
    },
    iconContainer: {
      paddingHorizontal: 16,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      // Removed left padding, using iconContainer instead
    },
    eyeIcon: {
      paddingHorizontal: 16, // Padding for touchable area
    },
    errorText: {
      color: '#EF4444',
      fontSize: 13, // Slightly larger error text
      fontFamily: 'Nunito-Medium',
      marginTop: 8,
      marginLeft: 4,
    },
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      marginTop: -10,
      marginBottom: 20, // Added bottom margin
    },
    forgotPasswordText: {
      fontSize: 15,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    // LOGIN BUTTON STYLES
    loginButton: {
      backgroundColor: theme.accent,
      paddingVertical: 18, // Taller button
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 20,
      minHeight: 56, // Ensure height even when showing ActivityIndicator
      justifyContent: 'center',
    },
    loginButtonDisabled: {
      backgroundColor: '#C7B2F4',
    },
    loginButtonText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    footer: {
      alignItems: 'center',
      marginTop: 32, // Increased spacing
    },
    footerText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    signUpLink: {
      color: theme.accent,
      fontFamily: 'Nunito-Bold',
    },
    // Modal Styles (Kept largely the same, minor font/color adjustments)
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.card,
      borderRadius: 16, // Consistent rounding
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
      width: '85%',
    },
    modalTitle: {
      marginBottom: 12,
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    modalMessage: {
      marginBottom: 20,
      textAlign: 'center',
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      gap: 10,
    },
    modalButton: {
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: theme.accent,
      minWidth: 100,
      alignItems: 'center',
      flex: 1,
    },
    modalButtonCancel: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
    },
    modalButtonText: {
      color: 'white',
      fontFamily: 'Nunito-SemiBold',
      textAlign: 'center',
      fontSize: 16,
    },
    modalButtonTextCancel: {
      color: theme.primary,
    },
  });

export default LoginScreen;
