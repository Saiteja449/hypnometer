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

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState('credentials');
  const [loginType, setLoginType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const otpInputRefs = useRef([]);

  // SVG Icons
  const UserIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const PhoneIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Circle cx="12" cy="18" r="1" fill="#8641f4" />
    </Svg>
  );

  const EmailIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7"
        stroke="#8641f4"
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
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15" r="2" fill="#8641f4" />
    </Svg>
  );

  const AdminIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C8.829 15 6.01099 16.5306 4.21597 18.906C3.82968 19.4172 3.63654 19.6728 3.64285 20.0183C3.64773 20.2852 3.81534 20.6219 4.02534 20.7867C4.29716 21 4.67384 21 5.4272 21H18.5728C19.3262 21 19.7028 21 19.9747 20.7867C20.1847 20.6219 20.3523 20.2852 20.3571 20.0183C20.3635 19.6728 20.1703 19.4172 19.784 18.906C17.989 16.5306 15.171 15 12 15Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const validateCredentials = () => {
    const newErrors = {};

    if (loginType === 'user') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Phone number must be 10 digits';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          formData.email.trim(),
        )
      ) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    return otp.every(digit => digit !== '');
  };

  const handleSendOtp = async () => {
    if (!validateCredentials()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('otp');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!validateCredentials()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (
        formData.email === 'admin123@gmail.com' &&
        formData.password === '123456'
      ) {
        console.log('Admin login successful');
        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Error', 'Invalid admin credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) {
      Alert.alert('Error', 'Please enter all OTP digits');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const enteredOtp = otp.join('');
      if (enteredOtp === '1234') {
        console.log('User login successful');
        navigation.replace('PendingApprovalScreen');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) {
      const digits = text.split('').slice(0, 4);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      const lastIndex = Math.min(index + digits.length - 1, 3);
      if (lastIndex < 3 && otpInputRefs.current[lastIndex + 1]) {
        otpInputRefs.current[lastIndex + 1].focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
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

  const switchToAdminLogin = () => {
    setLoginType('admin');
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
    });
    setErrors({});
  };

  const switchToUserLogin = () => {
    setLoginType('user');
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
    });
    setErrors({});
  };

  const renderLoginTypeSelector = () => (
    <View style={styles.loginTypeContainer}>
      <View style={styles.loginTypeToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginType === 'user' && styles.toggleButtonActive,
          ]}
          onPress={switchToUserLogin}
        >
          <Text
            style={[
              styles.toggleButtonText,
              loginType === 'user' && styles.toggleButtonTextActive,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginType === 'admin' && styles.toggleButtonActive,
          ]}
          onPress={switchToAdminLogin}
        >
          <Text
            style={[
              styles.toggleButtonText,
              loginType === 'admin' && styles.toggleButtonTextActive,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCredentialsStep = () => (
    <View style={styles.formSection}>
      {loginType === 'user' ? (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View
              style={[styles.inputWrapper, errors.name && styles.inputError]}
            >
              <View style={styles.inputIcon}>
                <UserIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={text => updateFormData('name', text)}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.phoneNumber && styles.inputError,
              ]}
            >
              <View style={styles.inputIcon}>
                <PhoneIcon />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={text => updateFormData('phoneNumber', text)}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
                maxLength={10}
              />
            </View>
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
                placeholder="admin123@gmail.com"
                value={formData.email}
                onChangeText={text => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
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
            onPress={handleAdminLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.formSection}>
      <View style={styles.otpHeader}>
        <Text style={styles.otpTitle}>Enter OTP</Text>
        <Text style={styles.otpSubtitle}>
          Code sent to{' '}
          <Text style={styles.phoneNumberHighlight}>
            +1 {formData.phoneNumber}
          </Text>
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (otpInputRefs.current[index] = ref)}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={text => handleOtpChange(text, index)}
            onKeyPress={e => handleOtpKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? 4 : 1}
            selectTextOnFocus
            editable={!isLoading}
          />
        ))}
      </View>

      <View style={styles.otpActions}>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleSendOtp}
          disabled={isLoading}
        >
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeNumberButton}
          onPress={() => setCurrentStep('credentials')}
          disabled={isLoading}
        >
          <Text style={styles.changeNumberButtonText}>Change Number</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleVerifyOtp}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader
        title="Sign In"
        onBackPress={() => {
          if (currentStep === 'otp') {
            setCurrentStep('credentials');
          } else {
            navigation.goBack();
          }
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {currentStep === 'credentials'
              ? 'Access your account to continue'
              : 'Enter the 4-digit code sent to your phone'}
          </Text>
        </View>

        {currentStep === 'credentials' && renderLoginTypeSelector()}

        {currentStep === 'credentials'
          ? renderCredentialsStep()
          : renderOtpStep()}

        {loginType === 'user' && currentStep === 'credentials' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('SignUpScreen')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Compact Login Type Selector
  loginTypeContainer: {
    marginBottom: 32,
  },
  loginTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
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
    backgroundColor: '#8641f4',
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
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
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
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
    color: '#1F2937',
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
    backgroundColor: '#8641f4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8641f4',
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
  adminHint: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  adminHintText: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#0369A1',
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
  },
  signUpLink: {
    color: '#8641f4',
    fontFamily: 'Nunito-SemiBold',
  },
  // OTP Styles
  otpHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneNumberHighlight: {
    fontFamily: 'Nunito-SemiBold',
    color: '#8641f4',
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
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: '#8641f4',
    backgroundColor: '#F8F5FF',
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
    color: '#8641f4',
  },
  changeNumberButton: {
    padding: 8,
  },
  changeNumberButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
  },
  verifyButton: {
    backgroundColor: '#8641f4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default LoginScreen;
