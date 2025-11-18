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
  const { theme } = useTheme();
  const { sendOtp, resetPassword } = useApp(); // Assuming these functions exist in AppContext
  const styles = getStyles(theme);

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
      const result = await sendOtp(email);
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
      const result = await resetPassword(email, newPassword, otp);
      if (result.success) {
        Alert.alert('Success', result.message || 'Password reset successfully.');
        navigation.navigate('Login'); // Navigate to login after successful reset
      } else {
        Alert.alert('Error', result.message || 'Failed to reset password. Please check your OTP and try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'An unexpected error occurred while resetting your password.');
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
            {step === 1
              ? 'Enter Your Email'
              : 'Verify OTP & Set New Password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'We will send an OTP to your registered email address.'
              : 'Please enter the OTP sent to your email and set your new password.'}
          </Text>

          {step === 1 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <EmailIcon color={theme.secondary} size={20} />
                <TextInput
                  style={styles.textInput}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.secondary}
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOtp}
                disabled={localLoading}
              >
                {localLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={theme.secondary}
                />
              </View>

              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <LockIcon color={theme.secondary} size={20} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor={theme.secondary}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  <EyeIcon open={!showNewPassword} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <LockIcon color={theme.secondary} size={20} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry={!showConfirmNewPassword}
                  placeholderTextColor={theme.secondary}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  style={styles.eyeIcon}
                >
                  <EyeIcon open={!showConfirmNewPassword} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
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
                style={[styles.button, styles.resendOtpButton]}
                onPress={handleSendOtp}
                disabled={localLoading}
              >
                <Text style={styles.resendOtpButtonText}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          )}
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
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    content: {
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
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
      marginBottom: 30,
    },
    inputGroup: {
      width: '100%',
      marginBottom: 20,
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
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 50,
      marginBottom: 15,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 10,
    },
    eyeIcon: {
      padding: 8,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    resendOtpButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.accent,
      marginTop: 10,
    },
    resendOtpButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
    },
  });

export default ForgotPasswordScreen;
