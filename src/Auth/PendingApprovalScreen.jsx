import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext'; // Import useTheme

import ApprovalIcon from '../Icons/ApprovalIcon';
import ClockIcon from '../Icons/ClockIcon';
import DocumentIcon from '../Icons/DocumentIcon';
import EmailIconPending from '../Icons/EmailIconPending';
import CheckListIcon from '../Icons/CheckListIcon';
const { width, height } = Dimensions.get('window');

const PendingApprovalScreen = ({ navigation, route }) => {
  const { theme } = useTheme(); // Initialize theme
  const styles = getStyles(theme); // Use getStyles with theme

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
            <ApprovalIcon color={theme.accent} size={120} />
          </View>
          <Text style={styles.title}>Account Under Review</Text>
          <Text style={styles.subtitle}>
            Thank you for registering! Your account is currently being reviewed
            by our administration team.
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <ClockIcon color={theme.accent} size={24} />
            <Text style={styles.statusTitle}>Review in Progress</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.statusText}>
              We're verifying your professional credentials and information
            </Text>
          </View>
        </View>

        {/* What to Expect Section */}
        <View style={styles.expectationsSection}>
          <Text style={styles.sectionTitle}>What to Expect Next</Text>

          <View style={styles.expectationItem}>
                      <View style={styles.expectationIcon}>
                        <DocumentIcon color={theme.accent} size={24} />
                      </View>            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Document Verification</Text>
              <Text style={styles.expectationDescription}>
                Our team is reviewing your qualifications and certifications
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
                      <View style={styles.expectationIcon}>
                        <CheckListIcon color={theme.accent} size={24} />
                      </View>            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Background Check</Text>
              <Text style={styles.expectationDescription}>
                Ensuring all professional requirements are met
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
                      <View style={styles.expectationIcon}>
                        <EmailIconPending color={theme.accent} size={24} />
                      </View>            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Notification</Text>
              <Text style={styles.expectationDescription}>
                You'll receive an email once your account is approved
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Approval Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Application Submitted</Text>
                <Text style={styles.timelineTime}>Just now</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotPending]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Under Review</Text>
                <Text style={styles.timelineTime}>1-2 business days</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotFuture]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Approval Complete</Text>
                <Text style={styles.timelineTime}>You'll be notified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            If you have any questions or need to update your application, please
            contact our support team.
          </Text>
          <View style={styles.supportContacts}>
            <Text style={styles.contactItem}>📧 support@hypnoapp.com</Text>
            <Text style={styles.contactItem}>📞 +1 (555) 123-4567</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton} // Renaming primaryButton to secondaryButton for styling consistency
          onPress={() => {
            // Handle support contact
            // You can link to email or phone
          }}
        >
          <Text style={styles.primaryButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for fixed footer
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: theme.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: theme.primary,
    marginLeft: 12,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: theme.border,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: theme.secondary,
    textAlign: 'center',
  },
  expectationsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: theme.primary,
    marginBottom: 16,
  },
  expectationItem: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  expectationIcon: {
    marginRight: 12,
  },
  expectationContent: {
    flex: 1,
  },
  expectationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: theme.primary,
    marginBottom: 4,
  },
  expectationDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: theme.secondary,
    lineHeight: 20,
  },
  timelineSection: {
    marginBottom: 24,
  },
  timeline: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981', // Keep green for approved status
    marginTop: 4,
    marginRight: 12,
  },
  timelineDotPending: {
    backgroundColor: theme.accent,
  },
  timelineDotFuture: {
    backgroundColor: theme.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: theme.primary,
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: theme.secondary,
  },
  supportSection: {
    marginBottom: 24,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: theme.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  supportContacts: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: theme.primary,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.card,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: { // This style is no longer used, but keeping it for now
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryButtonText: { // This style is no longer used, but keeping it for now
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: theme.primary,
  },
});

export default PendingApprovalScreen;
