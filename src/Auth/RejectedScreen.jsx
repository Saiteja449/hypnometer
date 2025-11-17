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
              <RejectedIcon width={80} height={80} color={theme.error} />
            </View>
          </View>

          {/* Title Section */}
          <Text style={styles.title}>Registration Rejected</Text>

          {/* Message Section */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              We're sorry, but your registration request has been reviewed and
              rejected by our administration team.
            </Text>
          </View>

          {/* Reasons Section */}
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Possible Reasons:</Text>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                Incomplete or inaccurate information provided
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                Does not meet our platform requirements
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.reasonText}>
                Suspicious activity detected
              </Text>
            </View>
          </View>

          {/* Support Info Section */}
          <View style={styles.supportContainer}>
            <EmailIcon color={theme.accent} size={24} />
            <Text style={styles.supportText}>
              If you believe this is a mistake or would like more information,
              please contact our support team.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
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

          {/* Additional Help */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Our support team typically responds within 24 hours.
            </Text>
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
      marginBottom: 24,
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
    reasonsContainer: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
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
      marginBottom: 12,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.error,
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
    supportContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(74, 144, 226, 0.1)'
        : 'rgba(74, 144, 226, 0.08)',
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(74, 144, 226, 0.3)'
        : 'rgba(74, 144, 226, 0.2)',
    },
    supportText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.accent,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    buttonsContainer: {
      gap: 12,
      marginBottom: 20,
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
    helpContainer: {
      alignItems: 'center',
      padding: 16,
    },
    helpText: {
      fontSize: 12,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });

export default RejectedScreen;
