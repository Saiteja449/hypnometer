import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import RatingStars from './RatingStars';

const SessionCard = ({
  session,
  onPress,
  showFeedbackLink = false,
  compact = true,
}) => {
  const {
    id,
    title,
    type,
    date,
    avgRating,
    ratings = [],
    notes,
    feedbackLink,
    status = 'completed',
    clientName,
  } = session;

  // SVG Icons (unchanged)
  const CalendarIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        d="M10 2H2C1.44772 2 1 2.44772 1 3V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2Z"
        stroke="#718096"
        strokeWidth="1"
      />
      <Path d="M1 4H11" stroke="#718096" strokeWidth="1" />
      <Path d="M3 1V3" stroke="#718096" strokeWidth="1" strokeLinecap="round" />
      <Path d="M9 1V3" stroke="#718096" strokeWidth="1" strokeLinecap="round" />
    </Svg>
  );

  const ClientIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Circle cx="6" cy="3" r="2" stroke="#718096" strokeWidth="1" />
      <Path
        d="M9 11C9 8.79086 7.20914 7 5 7C2.79086 7 1 8.79086 1 11"
        stroke="#718096"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ShareIcon = () => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        d="M10 9C9.60444 9 9.21776 8.8827 8.88886 8.66294C8.55996 8.44318 8.30362 8.13082 8.15224 7.76537C8.00087 7.39991 7.96126 6.99778 8.03843 6.60982C8.1156 6.22186 8.30608 5.86549 8.58579 5.58579C8.86549 5.30608 9.22186 5.1156 9.60982 5.03843C9.99778 4.96126 10.3999 5.00087 10.7654 5.15224C11.1308 5.30362 11.4432 5.55996 11.6629 5.88886C11.8827 6.21776 12 6.60444 12 7C12 7.53043 11.7893 8.03914 11.4142 8.41421C11.0391 8.78929 10.5304 9 10 9Z"
        stroke="#8641f4"
        strokeWidth="1"
      />
      <Path
        d="M4 5C3.60444 5 3.21776 4.8827 2.88886 4.66294C2.55996 4.44318 2.30362 4.13082 2.15224 3.76537C2.00087 3.39991 1.96126 2.99778 2.03843 2.60982C2.1156 2.22186 2.30608 1.86549 2.58579 1.58579C2.86549 1.30608 3.22186 1.1156 3.60982 1.03843C3.99778 0.96126 4.39991 1.00087 4.76537 1.15224C5.13082 1.30362 5.44318 1.55996 5.66294 1.88886C5.8827 2.21776 6 2.60444 6 3C6 3.53043 5.78929 4.03914 5.41421 4.41421C5.03914 4.78929 4.53043 5 4 5Z"
        stroke="#8641f4"
        strokeWidth="1"
      />
      <Path
        d="M10 9L7 7M7 7L10 5M7 7L4 5M7 7L4 9"
        stroke="#8641f4"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );

  const getSessionTypeColor = sessionType => {
    const colors = {
      Anxiety: '#FF6B6B',
      Confidence: '#4ECDC4',
      Regression: '#45B7D1',
      Smoking: '#96CEB4',
      'Weight Loss': '#FFEAA7',
      Sleep: '#DDA0DD',
      'Pain Management': '#F4A460',
      Stress: '#A78BFA',
      Phobias: '#F59E0B',
      Performance: '#10B981',
      Habits: '#8B5CF6',
      default: '#8641f4',
    };
    return colors[sessionType] || colors.default;
  };

  const getStatusInfo = status => {
    const statusConfig = {
      completed: { label: 'Completed', color: '#10B981', icon: '✓' },
      'pending-feedback': {
        label: 'Pending Feedback',
        color: '#F59E0B',
        icon: '⏳',
      },
      recording: { label: 'Recording', color: '#3B82F6', icon: '●' },
    };
    return statusConfig[status] || statusConfig.completed;
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleShareFeedback = () => {
    if (feedbackLink) {
      Alert.alert(
        'Share Feedback Link',
        'Copy this link to share with clients or peers for ratings:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Copy Link',
            onPress: () => {
              // Implement copy to clipboard
              console.log('Copy link:', feedbackLink);
              Alert.alert('Success', 'Link copied to clipboard!');
            },
          },
        ],
      );
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingNumber}>
                {avgRating?.toFixed(1) || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.typeStatusRow}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getSessionTypeColor(type) },
              ]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.color },
              ]}
            >
              <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meta Information */}
      <View style={styles.metaContainer}>
        {clientName && (
          <View style={styles.metaItem}>
            <ClientIcon />
            <Text style={styles.metaText}>{clientName}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <CalendarIcon />
          <Text style={styles.metaText}>{formatDate(date)}</Text>
        </View>
      </View>

      {/* Notes Preview */}
      {notes && !compact && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes} numberOfLines={2}>
            {notes}
          </Text>
        </View>
      )}

      {/* Skill Ratings */}
      {ratings.length > 0 && !compact && (
        <View style={styles.ratingsBreakdown}>
          <View style={styles.skillsGrid}>
            <View style={styles.skillItem}>
              <Text style={styles.skillLabel}>Creativity</Text>
              <Text style={styles.skillRating}>{ratings[0]?.toFixed(1)}</Text>
            </View>
            <View style={styles.skillItem}>
              <Text style={styles.skillLabel}>Express</Text>
              <Text style={styles.skillRating}>{ratings[1]?.toFixed(1)}</Text>
            </View>
            <View style={styles.skillItem}>
              <Text style={styles.skillLabel}>Submod</Text>
              <Text style={styles.skillRating}>{ratings[2]?.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Feedback Link */}
      {showFeedbackLink && feedbackLink && status === 'pending-feedback' && (
        <TouchableOpacity
          style={styles.feedbackLinkContainer}
          onPress={handleShareFeedback}
        >
          <ShareIcon />
          <View style={styles.feedbackText}>
            <Text style={styles.feedbackLinkText}>Share Feedback Link</Text>
            <Text style={styles.feedbackLinkSubtext}>Expires in 24 hours</Text>
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  header: {
    marginBottom: 12,
  },
  titleSection: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
  },
  ratingBadge: {
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
  },
  typeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  statusIcon: {
    fontSize: 8,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito-Medium',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Nunito-Medium',
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  notes: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Nunito-Regular',
    lineHeight: 16,
  },
  ratingsBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillItem: {
    alignItems: 'center',
    flex: 1,
  },
  skillLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'Nunito-Medium',
    marginBottom: 2,
  },
  skillRating: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#374151',
  },
  feedbackLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    gap: 8,
  },
  feedbackText: {
    flex: 1,
  },
  feedbackLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#0369A1',
    marginBottom: 2,
  },
  feedbackLinkSubtext: {
    fontSize: 11,
    color: '#0EA5E9',
    fontFamily: 'Nunito-Regular',
  },
});

export default SessionCard;