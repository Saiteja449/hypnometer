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
import RejectedIcon from '../Icons/RejectedIcon';
import EmailIcon from '../Icons/EmailIcon';
import SupportIcon from '../Icons/SupportIcon';
import LoginIcon from '../Icons/LoginIcon';

const RejectedScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  const handleContactSupport = () => {
    console.log('Contact Support button pressed');
    // TODO: Implement actual contact support functionality
    // For example: Linking.openURL('mailto:support@yourapp.com');
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Registration Rejected" showThemeToggle={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Main Icon Section */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <RejectedIcon width={90} height={90} color={theme.error} />
            </View>
          </View>

          {/* Title Section */}
          <Text style={styles.title}>Application Declined</Text>

          {/* Message Section (Refined Alert Box) */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              We're sorry, but your registration request has been reviewed and
              was declined by our administration team.
            </Text>
          </View>

          {/* Reasons Section (Elevated Card) */}
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Reasons for Decline</Text>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                The documentation provided was incomplete or contained
                inaccurate information.
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                The application did not meet our platform's minimum professional
                requirements.
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                We detected potential compliance issues during the background
                verification process.
              </Text>
            </View>
          </View>

          {/* Support Info Section (Elevated Card) */}
          <View style={styles.supportContainer}>
            <EmailIcon color={theme.accent} size={24} />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Need to Appeal?</Text>
              <Text style={styles.supportText}>
                If you believe this is a mistake or would like to submit an
                appeal, please contact our support team.
              </Text>
            </View>
          </View>

          {/* Additional Help */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Our support team typically responds to appeals within 24 business
              hours.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons (Fixed Footer) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
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
      paddingBottom: 150, // Space for fixed footer
    },
    content: {
      flex: 1,
      padding: 24,
      paddingTop: 40,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    iconCircle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: isDark
        ? 'rgba(244, 67, 54, 0.1)'
        : 'rgba(244, 67, 54, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: theme.error,
      opacity: 0.8,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.error,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 34,
    },
    // Message/Alert Box Style
    messageContainer: {
      backgroundColor: isDark
        ? 'rgba(244, 67, 54, 0.1)'
        : 'rgba(244, 67, 54, 0.05)',
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      borderLeftWidth: 5,
      borderLeftColor: theme.error,
    },
    message: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      textAlign: 'center',
      lineHeight: 24,
    },
    // Reasons Card (Elevated)
    reasonsContainer: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    reasonsTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: 8,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
      paddingTop: 5,
    },
    bulletPoint: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.error,
      marginTop: 6,
      marginRight: 12,
    },
    reasonText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      flex: 1,
      lineHeight: 22,
    },
    // Support Card (Elevated)
    supportContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    supportContent: {
      flex: 1,
      marginLeft: 15,
    },
    supportTitle: {
      fontSize: 17,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
      marginBottom: 4,
    },
    supportText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      lineHeight: 22,
    },
    // Help Footer Text
    helpContainer: {
      alignItems: 'center',
      padding: 16,
    },
    helpText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      fontStyle: 'italic',
      opacity: 0.7,
    },
    // Fixed Footer with Buttons
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      paddingHorizontal: 24,
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      gap: 12, // Spacing between buttons
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 14,
      gap: 10,
    },
    // Primary Button (Back to Login) - Elevated
    primaryButton: {
      backgroundColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    primaryButtonText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    // Secondary Button (Contact Support) - Outline
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.accent,
      elevation: 0, // Remove elevation for clean outline look
    },
    secondaryButtonText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
    },
  });

export default RejectedScreen;
