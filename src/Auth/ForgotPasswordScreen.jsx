import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext'; // Assuming AppContext will handle API calls
import EmailIcon from '../Icons/EmailIcon';
import LockIcon from '../Icons/LockIcon';
import EyeIcon from '../Icons/EyeIcon';

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { sendOtp, resetPassword } = useApp(); // Assuming these functions exist in AppContext
  const styles = getStyles(theme, isDark);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & Set New Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // For button specific loading

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLocalLoading(true);
    try {
      // Dummy API Call for sending OTP
      const result = { success: true, message: 'OTP sent successfully!' };
      // const result = await sendOtp(email);

      if (result.success) {
        Alert.alert('Success', result.message || 'OTP sent to your email.');
        setStep(2);
      } else {
        Alert.alert('Error', result.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', 'An unexpected error occurred while sending OTP.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    setLocalLoading(true);
    try {
      // Dummy API Call for resetting password
      const result = { success: true, message: 'Password reset successful.' };
      // const result = await resetPassword(email, newPassword, otp);

      if (result.success) {
        Alert.alert(
          'Success',
          result.message || 'Password reset successfully.',
        );
        navigation.navigate('LoginScreen'); // Navigate to login after successful reset
      } else {
        Alert.alert(
          'Error',
          result.message ||
            'Failed to reset password. Please check your OTP and try again.',
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while resetting your password.',
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader title="Forgot Password" showThemeToggle={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {step === 1 ? 'Recover Your Account' : 'Security Verification'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter the email associated with your account to receive a security code.'
              : 'Enter the 6-digit code sent to your email, then set a new secure password.'}
          </Text>

          {step === 1 && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <EmailIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="your.email@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={theme.secondary + '90'}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, localLoading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={localLoading}
              >
                {localLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Send Code</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.formContainer}>
              {/* OTP Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification Code (OTP)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={theme.secondary + '90'}
                  />
                </View>
              </View>

              {/* New Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <LockIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Create new password (min 6 characters)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholderTextColor={theme.secondary + '90'}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <EyeIcon color={theme.secondary} open={!showNewPassword} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm New Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                  <LockIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry={!showConfirmNewPassword}
                    placeholderTextColor={theme.secondary + '90'}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    style={styles.eyeIcon}
                  >
                    <EyeIcon
                      color={theme.secondary}
                      open={!showConfirmNewPassword}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={[styles.button, localLoading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={localLoading}
              >
                {localLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendOtpButton}
                onPress={handleSendOtp}
                disabled={localLoading}
              >
                <Text style={styles.resendOtpButtonText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.backToLoginText}>
              Remembered your password?{' '}
              <Text style={{ fontFamily: 'Nunito-Bold', color: theme.accent }}>
                Back to Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    content: {
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      marginBottom: 35,
      paddingHorizontal: 15,
      lineHeight: 24,
    },
    formContainer: {
      width: '100%',
      backgroundColor: theme.card,
      padding: 24,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    inputGroup: {
      width: '100%',
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 8,
      alignSelf: 'flex-start',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? theme.card : '#F8F8F8', // Lighter background for inputs in dark mode
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 55,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 10,
    },
    eyeIcon: {
      paddingLeft: 10,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      width: '100%',
      marginTop: 20,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    resendOtpButton: {
      backgroundColor: 'transparent',
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    resendOtpButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    backToLoginButton: {
      marginTop: 20,
    },
    backToLoginText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
  });

export default ForgotPasswordScreen;
