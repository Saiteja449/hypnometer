import React, { useState, useRef } from 'react';
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
  Dimensions,
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import EmailIcon from '../Icons/EmailIcon';
import LockIcon from '../Icons/LockIcon';
import EyeIcon from '../Icons/EyeIcon';

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
  const [showPassword, setShowPassword] = useState(false);

  // State for custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtons, setModalButtons] = useState([]);

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
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to your account to continue.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[styles.inputWrapper, errors.email && styles.inputError]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                value={formData.password}
                onChangeText={text => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                placeholderTextColor={theme.secondary}
                editable={!isLoading}
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

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

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
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    formContainer: {
      marginTop: 24,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
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
    inputGroup: {
      marginBottom: 16,
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
      height: 50,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
    },
    eyeIcon: {
      padding: 8,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 8,
    },
    loginButton: {
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
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
      marginTop: 24,
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    signUpLink: {
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
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
    },
    modalTitle: {
      marginBottom: 10,
      textAlign: 'center',
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    modalMessage: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 8,
    },
    modalButton: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      backgroundColor: theme.accent,
      minWidth: 100,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: theme.border,
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
