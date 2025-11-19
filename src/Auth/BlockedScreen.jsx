import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import CustomHeader from '../Components/CustomHeader';
import BlockedIcon from '../Icons/BlockedIcon';
import LoginIcon from '../Icons/LoginIcon';
import SupportIcon from '../Icons/SupportIcon';
import ShieldIcon from '../Icons/ShieldIcon';
import ClockIcon from '../Icons/ClockIcon';

const BlockedScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  const handleContactSupport = () => {
    // In a real application, you would implement deep linking or a modal
    // to direct the user to the support email/page.
    console.log(
      'Contact Support button pressed - Redirecting to support page/email...',
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Account Status" showThemeToggle={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Main Icon and Title Section */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <BlockedIcon width={80} height={80} color={theme.error} />
            </View>
          </View>

          <Text style={styles.title}>Account Blocked</Text>
          <Text style={styles.subText}>
            Your access to the application has been suspended.
          </Text>

          {/* Message Card */}
          <View style={[styles.card, styles.messageCard]}>
            <View style={styles.messageHeader}>
              <ShieldIcon color={theme.error} size={24} />
              <Text style={styles.messageTitle}>Security Notice</Text>
            </View>
            <Text style={styles.message}>
              Your account has been temporarily suspended due to security
              concerns or a violation of our community guidelines. This action
              is taken to protect your data and our platform.
            </Text>
          </View>

          {/* Reasons Card */}
          <View style={styles.card}>
            <Text style={styles.reasonsTitle}>Why was my account blocked?</Text>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Suspicious login activity or location changes.
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Repeated attempts to violate terms of service.
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Multiple failed login or unauthorized access attempts.
              </Text>
            </View>
          </View>

          {/* Resolution / Timeline Info */}
          <View style={[styles.resolutionContainer]}>
            <ClockIcon color={theme.accent} size={20} />
            <Text style={styles.resolutionText}>
              Our team will review your account immediately. Please allow
              **24-48 hours** for a full response and resolution.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContactSupport}
            >
              <SupportIcon color="#FFFFFF" size={20} />
              <Text style={styles.primaryButtonText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <LoginIcon color={theme.accent} size={20} />
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
      padding: 24,
    },
    content: {
      flex: 1,
      paddingTop: 20,
    },
    // --- Header / Icon Section ---
    iconContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    iconCircle: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: isDark ? theme.error + '1A' : theme.error + '10', // Light background for the icon
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.error + '40',
      shadowColor: theme.error,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Nunito-Bold',
      color: theme.error,
      textAlign: 'center',
      marginBottom: 8,
    },
    subText: {
      fontSize: 18,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      textAlign: 'center',
      marginBottom: 32,
    },

    // --- Cards ---
    card: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },

    // --- Message Card ---
    messageCard: {
      borderLeftWidth: 6,
      borderLeftColor: theme.error,
      backgroundColor: isDark ? '#351111' : '#FEEAE6', // Slightly red-tinted background
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    messageTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.error,
      marginLeft: 10,
    },
    message: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      lineHeight: 22,
    },

    // --- Reasons Card ---
    reasonsTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 16,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 7,
      marginRight: 12,
    },
    reasonText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      flex: 1,
      lineHeight: 20,
    },

    // --- Resolution Container ---
    resolutionContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: isDark ? theme.accent + '1A' : theme.accent + '10',
      padding: 16,
      borderRadius: 12,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: theme.accent + '30',
    },
    resolutionText: {
      fontSize: 15,
      fontFamily: 'Nunito-Medium',
      color: theme.accent,
      marginLeft: 12,
      flex: 1,
      lineHeight: 22,
    },

    // --- Buttons ---
    buttonsContainer: {
      gap: 12,
      marginBottom: 24,
    },
    primaryButton: {
      backgroundColor: theme.error, // Changed primary to error color for urgency
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      borderRadius: 14,
      gap: 8,
    },
    secondaryButton: {
      backgroundColor: isDark ? theme.card : '#F3F4F6',
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      borderRadius: 14,
      gap: 8,
    },
    primaryButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
  });

export default BlockedScreen;
