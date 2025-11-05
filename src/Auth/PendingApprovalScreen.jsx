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
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PendingApprovalScreen = ({ navigation, route }) => {
  // Get user data from signup if needed
  const userData = route.params?.userData || {};

  const ApprovalIcon = () => (
    <Svg width="120" height="120" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M8 12L11 15L16 9"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="8" r="1" fill="#8641f4" />
      <Path
        d="M12 12V15"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ClockIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M12 6V12L16 14"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const DocumentIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2V8H20"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 13H8"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17H8"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 9H9H8"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const EmailIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M2 6L12 13L22 6"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const CheckListIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 11L12 14L22 4"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        navigation.replace('DashboardScreen');
      }, 1500);
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ApprovalIcon />
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
            <ClockIcon />
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
              <DocumentIcon />
            </View>
            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Document Verification</Text>
              <Text style={styles.expectationDescription}>
                Our team is reviewing your qualifications and certifications
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
            <View style={styles.expectationIcon}>
              <CheckListIcon />
            </View>
            <View style={styles.expectationContent}>
              <Text style={styles.expectationTitle}>Background Check</Text>
              <Text style={styles.expectationDescription}>
                Ensuring all professional requirements are met
              </Text>
            </View>
          </View>

          <View style={styles.expectationItem}>
            <View style={styles.expectationIcon}>
              <EmailIcon />
            </View>
            <View style={styles.expectationContent}>
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
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Return to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            // Handle support contact
            // You can link to email or phone
          }}
        >
          <Text style={styles.secondaryButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
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
    color: '#1F2937',
    marginLeft: 12,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#8641f4',
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  expectationsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  expectationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  expectationDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  timelineSection: {
    marginBottom: 24,
  },
  timeline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
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
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginTop: 4,
    marginRight: 12,
  },
  timelineDotPending: {
    backgroundColor: '#8641f4',
  },
  timelineDotFuture: {
    backgroundColor: '#E5E7EB',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
  },
  supportSection: {
    marginBottom: 24,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  supportContacts: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#8641f4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#8641f4',
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
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
});

export default PendingApprovalScreen;
