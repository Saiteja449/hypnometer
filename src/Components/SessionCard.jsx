import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily } from '../utils/common'; // Assuming you have this helper

const SessionCard = ({
  session,
  onPress,
  showFeedbackLink = false,
  compact = true,
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  // --- Data Normalization ---
  const {
    title = 'Untitled Session',
    type,
    session_type,
    date,
    created_at,
    session_datetime,
    average_rating,
    client_name,
    clientName,
    status = 'completed',
    feedback_link,
    feedbackLink,
  } = session;

  const displayType = type || session_type || 'General';
  const displayDate = date || session_datetime || created_at || new Date();
  const displayClient = clientName || client_name || 'Unknown Client';
  const displayLink = feedbackLink || feedback_link;

  // Handle Rating logic
  const rawRating = parseFloat(average_rating || 0);
  const hasRating = rawRating > 0;
  const formattedRating = hasRating ? rawRating.toFixed(1) : '-';

  // --- Icons ---
  const CalendarIcon = ({ color }) => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        d="M9 1.5V3M3 1.5V3M1.5 4.5H10.5M2.5 1.5H9.5C10.0523 1.5 10.5 1.94772 10.5 2.5V10.5C10.5 11.0523 10.0523 11.5 9.5 11.5H2.5C1.94772 11.5 1.5 11.0523 1.5 10.5V2.5C1.5 1.94772 1.94772 1.5 2.5 1.5Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const UserIcon = ({ color }) => (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Circle cx="6" cy="3.5" r="2.5" stroke={color} strokeWidth="1.2" />
      <Path
        d="M10.5 10.5V9.5C10.5 8.39543 9.60457 7.5 8.5 7.5H3.5C2.39543 7.5 1.5 8.39543 1.5 9.5V10.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ShareIcon = ({ color }) => (
    <Svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="18" cy="5" r="3" />
      <Circle cx="6" cy="12" r="3" />
      <Circle cx="18" cy="19" r="3" />
      <Path d="M8.59 13.51L15.42 17.49" />
      <Path d="M15.41 6.51L8.59 10.49" />
    </Svg>
  );

  // --- Helpers ---
  const formatDate = dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = s => {
    switch (s?.toLowerCase()) {
      case 'completed':
        return theme.success || '#10B981';
      case 'recording':
        return theme.danger || '#EF4444';
      case 'pending':
      case 'pending-feedback':
        return theme.warning || '#F59E0B';
      default:
        return theme.secondary;
    }
  };

  const statusColor = getStatusColor(status);

  const handleShare = () => {
    if (!displayLink) return;
    Alert.alert('Share Feedback Link', 'Copy link to clipboard?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Copy', onPress: () => console.log('Copied', displayLink) },
    ]);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.mainRow}>
        {/* Left Side: Info */}
        <View style={styles.infoSection}>
          {/* Type Badge */}
          <View style={styles.headerRow}>
            <View style={[styles.typeTag, { borderColor: theme.accent }]}>
              <Text style={[styles.typeText, { color: theme.accent }]}>
                {displayType}
              </Text>
            </View>
            {status === 'recording' && (
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
            )}
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <UserIcon color={theme.secondary} />
              <Text style={styles.metaText}>{displayClient}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <CalendarIcon color={theme.secondary} />
              <Text style={styles.metaText}>{formatDate(displayDate)}</Text>
            </View>
          </View>
        </View>

        {/* Right Side: Rating Box */}
        <View style={styles.ratingSection}>
          <View
            style={[
              styles.ratingBox,
              {
                backgroundColor: hasRating
                  ? isDark
                    ? 'rgba(255,255,255,0.05)'
                    : '#F0F4F8'
                  : 'transparent',
                borderColor: hasRating ? 'transparent' : theme.border,
              },
            ]}
          >
            {hasRating ? (
              <>
                <Text style={[styles.ratingNumber, { color: theme.primary }]}>
                  {formattedRating}
                </Text>
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 12 12"
                  fill={theme.warning}
                >
                  <Path d="M6 0L7.80568 3.92705L12 4.39052L8.87356 7.25491L9.7353 11.3855L6 9.25458L2.2647 11.3855L3.12644 7.25491L0 4.39052L4.19432 3.92705L6 0Z" />
                </Svg>
              </>
            ) : (
              <Text style={[styles.noRatingText, { color: theme.secondary }]}>
                --
              </Text>
            )}
          </View>
          <Text style={[styles.ratingLabel, { color: theme.secondary }]}>
            {hasRating ? 'Avg Score' : 'No Rating'}
          </Text>
        </View>
      </View>

      {/* Optional Feedback Link Footer */}
      {showFeedbackLink && displayLink && status === 'pending-feedback' && (
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <ShareIcon color={theme.accent} />
          <Text style={[styles.footerText, { color: theme.accent }]}>
            Share Feedback Link
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.cardShadowOpacity || 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    mainRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoSection: {
      flex: 1,
      paddingRight: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8,
    },
    typeTag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    typeText: {
      fontSize: 10,
      fontFamily: fontFamily.Nunito_Bold || 'System',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    title: {
      fontSize: 16,
      fontFamily: fontFamily.Nunito_Bold || 'System',
      color: theme.primary,
      marginBottom: 6,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Medium || 'System',
      color: theme.secondary,
    },
    metaDivider: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.border,
      marginHorizontal: 8,
    },

    // Rating Section
    ratingSection: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 50,
    },
    ratingBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
      marginBottom: 4,
    },
    ratingNumber: {
      fontSize: 14,
      fontFamily: fontFamily.Nunito_Bold || 'System',
      fontWeight: '800',
      marginBottom: -2,
    },
    noRatingText: {
      fontSize: 14,
      fontFamily: fontFamily.Nunito_Bold || 'System',
    },
    ratingLabel: {
      fontSize: 9,
      fontFamily: fontFamily.Nunito_Medium || 'System',
      opacity: 0.8,
    },

    // Footer
    footerButton: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    footerText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_SemiBold || 'System',
    },
  });

export default SessionCard;
