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
    console.log('Contact Support button pressed');
    // TODO: Implement actual contact support functionality
    // For example: Linking.openURL('mailto:support@yourapp.com');
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Account Blocked" showThemeToggle={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Main Icon Section */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <BlockedIcon width={80} height={80} color={theme.error} />
            </View>
          </View>

          {/* Title Section */}
          <Text style={styles.title}>Account Blocked</Text>

          {/* Message Section */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              Your account has been temporarily suspended due to security
              concerns or policy violations.
            </Text>
          </View>

          {/* Security Info Section */}
          <View style={styles.securityContainer}>
            <ShieldIcon color={theme.warning} size={24} />
            <Text style={styles.securityText}>
              This action was taken to protect our platform and its users.
            </Text>
          </View>

          {/* Reasons Section */}
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>
              Common Reasons for Blocking:
            </Text>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Suspicious login activity detected
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Violation of terms of service
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Multiple failed login attempts
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: theme.error }]}
              />
              <Text style={styles.reasonText}>
                Reported for inappropriate behavior
              </Text>
            </View>
          </View>

          {/* Resolution Info */}
          <View style={styles.resolutionContainer}>
            <ClockIcon color={theme.accent} size={24} />
            <Text style={styles.resolutionText}>
              Our support team will review your case and respond within 24-48
              hours.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.primaryButton]}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <LoginIcon color="#FFFFFF" size={20} />
              <Text style={styles.primaryButtonText}>Back to Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleContactSupport}
            >
              <SupportIcon color={theme.accent} size={20} />
              <Text style={styles.secondaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What to Expect:</Text>
            <View style={styles.infoItem}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Support team will investigate the issue
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                You'll receive email updates on the status
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Account restoration if issue is resolved
              </Text>
            </View>
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
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    iconCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDark
        ? 'rgba(244, 67, 54, 0.1)'
        : 'rgba(244, 67, 54, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: isDark ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.2)',
      shadowColor: theme.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.error,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 34,
    },
    messageContainer: {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.error,
    },
    message: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    securityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(255, 152, 0, 0.1)'
        : 'rgba(255, 152, 0, 0.08)',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
    },
    securityText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.warning,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    reasonsContainer: {
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
    reasonsTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 16,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 8,
      marginRight: 12,
    },
    reasonText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      flex: 1,
      lineHeight: 20,
    },
    resolutionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(74, 144, 226, 0.1)'
        : 'rgba(74, 144, 226, 0.08)',
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(74, 144, 226, 0.3)'
        : 'rgba(74, 144, 226, 0.2)',
    },
    resolutionText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.accent,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    buttonsContainer: {
      gap: 12,
      marginBottom: 24,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
    },
    primaryButton: {
      backgroundColor: theme.accent,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.accent,
    },
    primaryButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    infoContainer: {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
      padding: 20,
      borderRadius: 16,
    },
    infoTitle: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 12,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.accent,
      marginRight: 12,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      flex: 1,
      lineHeight: 20,
    },
  });

export default BlockedScreen;
