import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, Stop } from 'react-native-svg';

import { useTheme } from '../Context/ThemeContext';

const StaticColors = {
  accentGradient: ['#8A2BE2', '#4C51BF'],
  success: '#38A169',
};

const SessionCard = ({
  session,
  onPress,
  showFeedbackLink = false,
  compact = true,
}) => {
  const { theme, isDark } = useTheme();

  console.log('SESSION', session);

  // Support both internal prop names and API response keys
  const {
    id,
    title,
    type,
    date,
    average_rating,
    ratings = [],
    notes,
    feedbackLink,
    status = 'completed',
    clientName,
  } = session;

  // Fallbacks for API field names
  const sessionType = type || session.session_type || session.sessionType;
  const sessionDate =
    date ||
    session.session_datetime ||
    session.sessionDate ||
    session.created_at;
  const sessionAvgRating = average_rating;
  const sessionFeedbackLink =
    feedbackLink || session.feedback_link || session.feedbackLink;
  const sessionClientName =
    clientName || session.client_name || session.clientName;
  const sessionRatings = ratings || session.ratings || [];

  const iconColor = theme.secondary;
  const accentColor = theme.accent;

  const CalendarIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        d="M10 2H2C1.44772 2 1 2.44772 1 3V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2Z"
        stroke={iconColor}
        strokeWidth="1"
      />
      <Path d="M1 4H11" stroke={iconColor} strokeWidth="1" />
      <Path
        d="M3 1V3"
        stroke={iconColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Path
        d="M9 1V3"
        stroke={iconColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ClientIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Circle cx="6" cy="3" r="2" stroke={iconColor} strokeWidth="1" />
      <Path
        d="M9 11C9 8.79086 7.20914 7 5 7C2.79086 7 1 8.79086 1 11"
        stroke={iconColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ShareIcon = () => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        d="M10 9C9.60444 9 9.21776 8.8827 8.88886 8.66294C8.55996 8.44318 8.30362 8.13082 8.15224 7.76537C8.00087 7.39991 7.96126 6.99778 8.03843 6.60982C8.1156 6.22186 8.30608 5.86549 8.58579 5.58579C8.86549 5.30608 9.22186 5.1156 9.60982 5.03843C9.99778 4.96126 10.3999 5.00087 10.7654 5.15224C11.1308 5.30362 11.4432 5.55996 11.6629 5.88886C11.8827 6.21776 12 6.60444 12 7C12 7.53043 11.7893 8.03914 11.4142 8.41421C11.0391 8.78929 10.5304 9 10 9Z"
        stroke={accentColor}
        strokeWidth="1"
      />
      <Path
        d="M4 5C3.60444 5 3.21776 4.8827 2.88886 4.66294C2.55996 4.44318 2.30362 4.13082 2.15224 3.76537C2.00087 3.39991 1.96126 2.99778 2.03843 2.60982C2.1156 2.22186 2.30608 1.86549 2.58579 1.58579C2.86549 1.30608 3.22186 1.1156 3.60982 1.03843C3.99778 0.96126 4.39991 1.00087 4.76537 1.15224C5.13082 1.30362 5.44318 1.55996 5.66294 1.88886C5.8827 2.21776 6 2.60444 6 3C6 3.53043 5.78929 4.03914 5.41421 4.41421C5.03914 4.78929 4.53043 5 4 5Z"
        stroke={accentColor}
        strokeWidth="1"
      />
      <Path
        d="M10 9L7 7M7 7L10 5M7 7L4 5M7 7L4 9"
        stroke={accentColor}
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
      default: theme.accent, // Use theme accent as fallback
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
    if (sessionFeedbackLink) {
      Alert.alert(
        'Share Feedback Link',
        'Copy this link to share with clients or peers for ratings:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Copy Link',
            onPress: () => {
              console.log('Copy link:', sessionFeedbackLink);
              Alert.alert('Success', 'Link copied to clipboard!');
            },
          },
        ],
      );
    }
  };

  // If API gives feedback_expires_at and it's in the future, mark as pending-feedback
  const resolvedStatus =
    session.feedback_expires_at &&
    new Date(session.feedback_expires_at) > new Date()
      ? 'pending-feedback'
      : status;

  const statusInfo = getStatusInfo(resolvedStatus);

  const cardStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      padding: 12,
      borderRadius: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: isDark ? '#000' : theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    compactContainer: {
      padding: 8,
      marginBottom: 6,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary, // Dynamic primary color
      flex: 1,
      lineHeight: 20,
    },
    ratingBadge: {
      backgroundColor: theme.background, // Use background for badge color
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border, // Dynamic border color
      marginLeft: 6,
    },
    ratingNumber: {
      fontSize: 14,
      fontFamily: 'Nunito-Bold',
      color: accentColor, // Dynamic accent color
    },
    metaText: {
      fontSize: 12,
      color: theme.secondary, // Dynamic secondary color
      fontFamily: 'Nunito-Medium',
    },
    notesContainer: {
      backgroundColor: isDark ? theme.border : theme.background, // Subtle contrast
      padding: 6,
      borderRadius: 8,
      marginBottom: 6,
    },
    notes: {
      fontSize: 12,
      color: theme.secondary, // Dynamic secondary color
      fontFamily: 'Nunito-Regular',
      lineHeight: 16,
    },
    ratingsBreakdown: {
      borderTopWidth: 1,
      borderTopColor: theme.border, // Dynamic border color
      paddingTop: 6,
    },
    skillLabel: {
      fontSize: 10,
      color: theme.tertiary, // Tertiary/lighter text color
      fontFamily: 'Nunito-Medium',
      marginBottom: 0,
    },
    skillRating: {
      fontSize: 12,
      fontFamily: 'Nunito-Bold',
      color: theme.primary, // Dynamic primary color
    },
    feedbackLinkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1C2E4A' : '#F0F9FF', // Specific blue background for link
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#2D4464' : '#E0F2FE',
      gap: 6,
    },
    feedbackLinkText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: isDark ? '#93C5FD' : '#0369A1', // Light blue text for contrast
      marginBottom: 0,
    },
    feedbackLinkSubtext: {
      fontSize: 11,
      color: isDark ? '#60A5FA' : '#0EA5E9',
      fontFamily: 'Nunito-Regular',
    },
  });

  return (
    <TouchableOpacity
      style={[cardStyles.container, compact && cardStyles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={cardStaticStyles.header}>
        <View style={cardStaticStyles.titleSection}>
          <View style={cardStaticStyles.titleRow}>
            <Text style={cardStyles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={cardStyles.ratingBadge}>
              <Text style={cardStyles.ratingNumber}>
                {average_rating == 0
                  ? average_rating.toString().concat('.0')
                  : average_rating.toString()}
              </Text>
            </View>
          </View>

          <View style={cardStaticStyles.typeStatusRow}>
            <View
              style={[
                cardStaticStyles.typeBadge,
                { backgroundColor: getSessionTypeColor(sessionType) },
              ]}
            >
              <Text style={cardStaticStyles.typeText}>
                {sessionType || 'Session'}
              </Text>
            </View>

            <View
              style={[
                cardStaticStyles.statusBadge,
                { backgroundColor: statusInfo.color },
              ]}
            >
              <Text style={cardStaticStyles.statusIcon}>{statusInfo.icon}</Text>
              <Text style={cardStaticStyles.statusText}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={cardStaticStyles.metaContainer}>
        {sessionClientName && (
          <View style={cardStaticStyles.metaItem}>
            <ClientIcon />
            <Text style={cardStyles.metaText}>{sessionClientName}</Text>
          </View>
        )}
        <View style={cardStaticStyles.metaItem}>
          <CalendarIcon />
          <Text style={cardStyles.metaText}>{formatDate(sessionDate)}</Text>
        </View>
      </View>

      {notes && !compact && (
        <View style={cardStyles.notesContainer}>
          <Text style={cardStyles.notes} numberOfLines={2}>
            {notes}
          </Text>
        </View>
      )}

      {sessionRatings.length > 0 && !compact && (
        <View style={cardStyles.ratingsBreakdown}>
          <View style={cardStaticStyles.skillsGrid}>
            <View style={cardStaticStyles.skillItem}>
              <Text style={cardStyles.skillLabel}>Creativity</Text>
              <Text style={cardStyles.skillRating}>
                {sessionRatings[0]?.toFixed(1)}
              </Text>
            </View>
            <View style={cardStaticStyles.skillItem}>
              <Text style={cardStyles.skillLabel}>Express</Text>
              <Text style={cardStyles.skillRating}>
                {sessionRatings[1]?.toFixed(1)}
              </Text>
            </View>
            <View style={cardStaticStyles.skillItem}>
              <Text style={cardStyles.skillLabel}>Submod</Text>
              <Text style={cardStyles.skillRating}>
                {sessionRatings[2]?.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {showFeedbackLink &&
        sessionFeedbackLink &&
        status === 'pending-feedback' && (
          <TouchableOpacity
            style={cardStyles.feedbackLinkContainer}
            onPress={handleShareFeedback}
          >
            <ShareIcon />
            <View style={cardStaticStyles.feedbackText}>
              <Text style={cardStyles.feedbackLinkText}>
                Share Feedback Link
              </Text>
              <Text style={cardStyles.feedbackLinkSubtext}>
                Expires in 24 hours
              </Text>
            </View>
          </TouchableOpacity>
        )}
    </TouchableOpacity>
  );
};

const cardStaticStyles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
  titleSection: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 1,
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
    gap: 12,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillItem: {
    alignItems: 'center',
    flex: 1,
  },
  feedbackText: {
    flex: 1,
  },
});

export default SessionCard;
