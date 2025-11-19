import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal, // Added Modal
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';

import UserIcon from '../Icons/UserIcon';
import EmailIcon from '../Icons/EmailIcon';
import PhoneIcon from '../Icons/PhoneIcon';
import LockIcon from '../Icons/LockIcon';
import EyeIcon from '../Icons/EyeIcon';

const RegistrationScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { register } = useApp();
  const styles = getStyles(theme, isDark);

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
  const [isLoading, setIsLoading] = useState(false);

  // State for custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone number must be 10 digits';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (formData.password !== value) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSignUp = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'user',
        });

        if (result) {
          switch (result.status) {
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
              setModalTitle('Registration Status');
              setModalMessage('Unknown user status. Please contact support.');
              setModalButtons([{ text: 'OK' }]);
              setModalVisible(true);
              break;
          }
        }
      } catch (error) {
        console.error('Registration process error:', error);
        const serverMessage = error?.response?.data?.message;
        const message =
          serverMessage ||
          error?.message ||
          'An unexpected error occurred during registration. Please try again.';

        setModalTitle('Registration Failed');
        setModalMessage(message);
        setModalButtons([{ text: 'OK' }]);
        setModalVisible(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateFormData = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    const newErrors = { ...errors };
    const error = validateField(field, value);
    newErrors[field] = error;

    if (field === 'password' || field === 'confirmPassword') {
      // Re-validate confirmPassword whenever password or confirmPassword changes
      const confirmPasswordError = validateField(
        'confirmPassword',
        field === 'password' ? value : newFormData.confirmPassword,
      );
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
  };

  const renderInputField = (
    field,
    placeholder,
    IconComponent,
    isPassword = false,
    keyboardType = 'default',
    maxLength = undefined,
  ) => {
    const isSecure = field === 'password' || field === 'confirmPassword';
    const isVisible =
      field === 'confirmPassword' ? showConfirmPassword : showPassword;
    const toggleVisibility =
      field === 'confirmPassword'
        ? () => setShowConfirmPassword(!isVisible)
        : () => setShowPassword(!isVisible);

    return (
      <View
        style={
          field === 'firstName' || field === 'lastName'
            ? { flex: 1 }
            : styles.inputGroup
        }
      >
        <View
          style={[
            styles.inputWrapper,
            errors[field] && styles.inputError,
            isLoading && styles.inputWrapperDisabled,
          ]}
        >
          {IconComponent && (
            <View style={styles.iconContainer}>
              <IconComponent
                color={errors[field] ? '#EF4444' : theme.secondary}
              />
            </View>
          )}
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            value={formData[field]}
            onChangeText={text => updateFormData(field, text)}
            keyboardType={keyboardType}
            autoCapitalize={field === 'email' ? 'none' : 'sentences'}
            secureTextEntry={isSecure && !isVisible}
            placeholderTextColor={theme.secondary + '90'}
            editable={!isLoading}
            maxLength={maxLength}
          />
          {isSecure && (
            <TouchableOpacity
              onPress={toggleVisibility}
              style={styles.eyeIcon}
              disabled={isLoading}
            >
              <EyeIcon open={!isVisible} />
            </TouchableOpacity>
          )}
        </View>
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

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
      <CustomHeader title="Create Account" showThemeToggle={false} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Get Started</Text>
            <Text style={styles.subtitle}>
              Create an account to start your journey.
            </Text>
          </View>

          <View style={styles.nameRow}>
            {renderInputField('firstName', 'First Name', UserIcon)}
            <View style={styles.spacer} />
            {renderInputField('lastName', 'Last Name', UserIcon)}
          </View>

          {renderInputField(
            'email',
            'Email Address',
            EmailIcon,
            false,
            'email-address',
          )}

          {renderInputField(
            'phone',
            'Phone Number (10 digits)',
            PhoneIcon,
            false,
            'number-pad',
            10,
          )}

          {renderInputField(
            'password',
            'Password (min. 8 chars)',
            LockIcon,
            true,
          )}

          {renderInputField(
            'confirmPassword',
            'Confirm Password',
            LockIcon,
            true,
          )}

          <TouchableOpacity
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('LoginScreen')}
              >
                Log In
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
      marginTop: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 26,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    spacer: {
      width: 16,
    },
    inputGroup: {
      marginBottom: 20,
    },
    // Input Styles
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingHorizontal: 0,
      height: 56,
    },
    inputWrapperDisabled: {
      opacity: 0.7,
      backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
    },
    iconContainer: {
      paddingHorizontal: 16,
    },
    inputError: {
      borderColor: '#EF4444',
      borderWidth: 2,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
    },
    eyeIcon: {
      paddingHorizontal: 16,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 13,
      fontFamily: 'Nunito-Medium',
      marginTop: 4,
      marginLeft: 4,
    },
    // Button Styles
    signUpButton: {
      backgroundColor: theme.accent,
      paddingVertical: 18,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 20,
      minHeight: 56,
      justifyContent: 'center',
    },
    signUpButtonDisabled: {
      backgroundColor: '#C7B2F4',
    },
    signUpButtonText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    footer: {
      alignItems: 'center',
      marginTop: 32,
    },
    footerText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    loginLink: {
      color: theme.accent,
      fontFamily: 'Nunito-Bold',
    },
    // Modal Styles
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
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

export default RegistrationScreen;
