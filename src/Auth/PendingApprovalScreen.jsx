import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext'; // Import useTheme

// Import Icons
import ApprovalIcon from '../Icons/ApprovalIcon';
import ClockIcon from '../Icons/ClockIcon';
import DocumentIcon from '../Icons/DocumentIcon';
import EmailIconPending from '../Icons/EmailIconPending';
import CheckListIcon from '../Icons/CheckListIcon';
const { width, height } = Dimensions.get('window');

const PendingApprovalScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme(); // Initialize theme and isDark
  const styles = getStyles(theme, isDark); // Pass isDark to getStyles

  // Get user data from signup if needed
  const userData = route.params?.userData || {};

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ApprovalIcon color={theme.accent} size={130} />
          </View>
          <Text style={styles.title}>Account Under Review</Text>
          <Text style={styles.subtitle}>
            Thank you for registering! Your account is currently being reviewed
            by our administration team.
          </Text>
        </View>

        {/* Status Card (Elevated Main Block) */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <ClockIcon color={theme.accent} size={28} />
            <Text style={styles.statusTitle}>Review in Progress</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.statusText}>
              We're verifying your professional credentials and information.
              This process typically takes 1-2 business days.
            </Text>
          </View>
        </View>

        {/* What to Expect Section */}
        <View style={styles.expectationsSection}>
          <Text style={styles.sectionTitle}>What to Expect Next</Text>

          <View style={styles.expectationItem}>
            <View style={styles.expectationIcon}>
              <DocumentIcon color={theme.accent} size={24} />
            </View>{' '}
            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Document Verification</Text>
              <Text style={styles.expectationDescription}>
                Our team is reviewing your qualifications and certifications.
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
            <View style={styles.expectationIcon}>
              <CheckListIcon color={theme.accent} size={24} />
            </View>{' '}
            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Compliance Check</Text>
              <Text style={styles.expectationDescription}>
                Ensuring all professional and regulatory requirements are met.
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
            <View style={styles.expectationIcon}>
              <EmailIconPending color={theme.accent} size={24} />
            </View>{' '}
            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Notification</Text>
              <Text style={styles.expectationDescription}>
                You'll receive an email notification once your account is
                approved.
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Approval Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotComplete]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Application Submitted</Text>
                <Text style={styles.timelineTime}>Complete</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Under Review</Text>
                <Text style={styles.timelineTime}>
                  Currently in Progress (1-2 business days)
                </Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotFuture]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Account Activation</Text>
                <Text style={styles.timelineTime}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <View style={styles.supportContacts}>
            <Text style={styles.supportText}>
              If you have any questions or need to update your application
              details, please contact our support team directly.
            </Text>
            <View style={styles.contactDetails}>
              <Text style={styles.contactItem}>📧 support@hypnoapp.com</Text>
              <Text style={styles.contactItem}>📞 +1 (555) 123-4567</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions (Fixed Button) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // Handle navigation to support/contact functionality
          }}
        >
          <Text style={styles.primaryButtonText}>Contact Support</Text>
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
      padding: 24,
      paddingBottom: 100, // Space for fixed footer
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
      marginTop: 20,
    },
    iconContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 15,
    },
    // --- Elevated Card Styles ---
    statusCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 25,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusTitle: {
      fontSize: 20,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginLeft: 12,
    },
    progressContainer: {
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    progressBar: {
      width: '100%',
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginBottom: 10,
      overflow: 'hidden',
    },
    progressFill: {
      width: '60%',
      height: '100%',
      backgroundColor: theme.accent,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    // --- Expectations Section ---
    expectationsSection: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 15,
    },
    expectationItem: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.08,
      shadowRadius: 5,
      elevation: 3,
    },
    expectationIcon: {
      marginRight: 15,
      paddingTop: 2,
    },
    expectationContent: {
      flex: 1,
    },
    expectationTitle: {
      fontSize: 17,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 2,
    },
    expectationDescription: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      lineHeight: 22,
    },
    // --- Timeline Section ---
    timelineSection: {
      marginBottom: 25,
    },
    timeline: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    timelineItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    timelineDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.accent, // Current step is accent
      marginTop: 4,
      marginRight: 15,
    },
    timelineDotComplete: {
      backgroundColor: '#10B981', // Green for completed
    },
    timelineDotFuture: {
      backgroundColor: theme.border, // Border color for future steps
    },
    timelineContent: {
      flex: 1,
    },
    timelineTitle: {
      fontSize: 17,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 2,
    },
    timelineTime: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    // --- Support Section ---
    supportSection: {
      marginBottom: 0,
    },
    supportContacts: {
      backgroundColor: isDark ? theme.card : '#F8F8F8', // Lighter background for the block
      borderRadius: 14,
      padding: 18,
    },
    supportText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 15,
      lineHeight: 22,
    },
    contactDetails: {},
    contactItem: {
      fontSize: 15,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 4,
    },
    // --- Footer Button ---
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
    },
    primaryButton: {
      backgroundColor: theme.accent,
      paddingVertical: 16, // Matching ForgotPassword button height
      borderRadius: 14, // Matching ForgotPassword button radius
      alignItems: 'center',
      // Elevated shadow for the primary button
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    primaryButtonText: {
      fontSize: 18, // Matching ForgotPassword button font size
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
  });

export default PendingApprovalScreen;
