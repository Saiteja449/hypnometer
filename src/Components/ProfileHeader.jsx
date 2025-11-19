import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { fontFamily } from '../utils/common';
import Svg, { Path, Circle, Rect, G, Polygon } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// --- Static Values (Memoized outside render for optimization) ---
const StaticGradients = {
  avatarRingGradient: ['#E28A2B', '#8A2BE2'], // Gold to Violet
  statsPrimaryGradient: ['#4C51BF', '#6B46C1'], // Deep Blue Gradient
  statsSuccessGradient: ['#38A169', '#48BB78'], // Green Gradient
  statsWarningGradient: ['#DD6B20', '#ED8936'], // Orange Gradient
};

const StaticColors = {
  ratingStar: '#FFD700',
  expert: '#27ae60', // Adjusted to a common V/G color
  advanced: '#3498DB',
  proficient: '#f39c12', // Adjusted to a common Orange color
  beginner: '#e74c3c', // Adjusted to a common Red color
};

// --- SVG Icons (Memoized) ---

const StarIcon = React.memo(
  ({ size = 16, color = StaticColors.ratingStar }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  ),
);

const ChartIcon = React.memo(({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </Svg>
));

const TrendingIcon = React.memo(({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </Svg>
));

const EditIcon = React.memo(({ size = 18, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
));

// Skill Level Icons
const ExpertIcon = React.memo(({ size = 14, color = StaticColors.expert }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" fill="none" />
  </Svg>
));

const AdvancedIcon = React.memo(
  ({ size = 14, color = StaticColors.advanced }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
    </Svg>
  ),
);

const ProficientIcon = React.memo(
  ({ size = 14, color = StaticColors.proficient }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </Svg>
  ),
);

const BeginnerIcon = React.memo(
  ({ size = 14, color = StaticColors.beginner }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
    </Svg>
  ),
);

const DefaultIcon = React.memo(({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="8" />
    <Circle cx="12" cy="12" r="3" fill="#FFFFFF" />
  </Svg>
));

const ProfileHeader = ({ userData, setShowUpdateProfileModal }) => {
  const { theme, isDark } = useTheme();

  // Memoize styles to improve performance
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const name = userData?.name || 'John Doe';
  const overallRating = userData?.overallRating || 0;
  const email = userData?.email || '';

  if (!userData) return null;

  // --- BarSkillMeter Sub-Component ---
  const BarSkillMeter = ({ skill, rating, level }) => {
    const percentage = (rating / 5) * 100;

    const getLevelColor = level => {
      switch (level) {
        case 'EXPERT':
          return StaticColors.expert;
        case 'ADVANCED':
          return StaticColors.advanced;
        case 'PROFICIENT':
          return StaticColors.proficient;
        case 'BEGINNER':
          return StaticColors.beginner;
        default:
          return theme.accent;
      }
    };

    const getLevelIcon = level => {
      switch (level) {
        case 'EXPERT':
          return <ExpertIcon />;
        case 'ADVANCED':
          return <AdvancedIcon />;
        case 'PROFICIENT':
          return <ProficientIcon />;
        case 'BEGINNER':
          return <BeginnerIcon />;
        default:
          // Must pass theme color to DefaultIcon since it's not a StaticColor
          return <DefaultIcon color={theme.accent} />;
      }
    };

    const levelColor = getLevelColor(level);

    return (
      <View style={styles.barSkillContainer}>
        <View style={styles.barSkillHeader}>
          <Text style={styles.barSkillName}>{skill}</Text>
          <View style={styles.barSkillRating}>
            <Text style={styles.barRatingNumber}>{rating.toFixed(1)}</Text>
            <Text style={styles.barRatingMax}>/5</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: levelColor,
                  shadowColor: levelColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.skillLevelContainer}>
          {getLevelIcon(level)}
          <Text style={[styles.skillLevel, { color: levelColor }]}>
            {level}
          </Text>
        </View>
      </View>
    );
  };
  // --- End BarSkillMeter Sub-Component ---

  return (
    <View style={styles.profileContainer}>
      {/* 1. Profile and Rating */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={StaticGradients.avatarRingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>
                {name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2) // Limit to two initials
                  .join('')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {name}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowUpdateProfileModal(true)}
            >
              <EditIcon color={theme.accent} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userTitle} numberOfLines={1}>
            {email}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <StarIcon size={16} />
              <Text style={styles.overallRating}>
                {overallRating.toFixed(1)}
              </Text>
              <Text style={styles.ratingMax}>/5</Text>
            </View>
            <Text style={styles.ratingText}>Overall Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      {/* 2. Skill Breakdown */}
      <View style={styles.skillsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skill Breakdown</Text>
          <View style={styles.skillPill}>
            <Text style={styles.skillPillText}>Mastery Map</Text>
          </View>
        </View>

        <View style={styles.singleColumnSkillsGrid}>
          {/* Note: In a real app, these props would come from userData */}
          <BarSkillMeter skill="Creativity" rating={4.5} level="EXPERT" />
          <BarSkillMeter skill="Expressive" rating={4.2} level="ADVANCED" />
          <BarSkillMeter skill="Submodali" rating={4.0} level="ADVANCED" />
          <BarSkillMeter skill="Tonality" rating={4.4} level="ADVANCED" />
        </View>
      </View>

      <View style={styles.separator} />

      {/* 3. Key Stats */}
      <View style={styles.statsContainer}>
        {/* Total Sessions */}
        <LinearGradient
          colors={StaticGradients.statsPrimaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <ChartIcon />
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
          <Text style={styles.statSubtext}>Lifetime</Text>
        </LinearGradient>

        {/* Monthly Growth */}
        <LinearGradient
          colors={StaticGradients.statsSuccessGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <TrendingIcon />
          <Text style={styles.statNumber}>+12%</Text>
          <Text style={styles.statLabel}>Monthly Growth</Text>
          <Text style={styles.statSubtext}>This Month</Text>
        </LinearGradient>

        {/* Avg Rating */}
        <LinearGradient
          colors={StaticGradients.statsWarningGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <StarIcon color="#FFFFFF" />
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
          <Text style={styles.statSubtext}>Last 30 days</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

// --- Stylesheet Creation Function ---
const createStyles = (theme, isDark) =>
  StyleSheet.create({
    profileContainer: {
      backgroundColor: theme.card, // Changed to theme.card for consistency
      padding: 16, // Increased padding
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 18, // Slightly increased vertical separation
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatarRing: {
      width: 75, // Slightly larger avatar
      height: 75,
      borderRadius: 40,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInner: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
      backgroundColor: theme.background, // Use theme background inside the ring
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: theme.primary,
      fontSize: 22, // Larger text
      fontFamily: fontFamily.Nunito_ExtraBold,
    },
    profileInfo: {
      flex: 1,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    userName: {
      fontSize: 18, // Larger name font
      color: theme.primary,
      marginRight: 8,
      fontFamily: fontFamily.Nunito_Bold,
    },
    editButton: {
      padding: 4,
    },
    userTitle: {
      fontSize: 12,
      color: theme.secondary,
      marginBottom: 8,
      fontFamily: fontFamily.Nunito_Medium,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(255, 215, 0, 0.1)'
        : 'rgba(255, 215, 0, 0.2)', // Yellow tint for rating badge
      paddingHorizontal: 12,
      paddingVertical: 4, // Reduced vertical padding for height
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? '#6B5A00' : '#FFEB99', // Matching yellow/gold border
      marginRight: 10,
    },
    overallRating: {
      fontSize: 14, // Slightly larger rating text
      fontFamily: fontFamily.Nunito_ExtraBold,
      color: StaticColors.ratingStar,
      marginLeft: 6,
    },
    ratingMax: {
      fontSize: 12,
      color: theme.secondary,
      marginLeft: 2,
      fontFamily: fontFamily.Nunito_Medium,
    },
    ratingText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Regular,
      color: theme.secondary, // Ensure this text is theme-aware
    },

    // --- Skill Breakdown Styles ---
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12, // Reduced margin
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
    skillPill: {
      backgroundColor: theme.background, // Dynamic
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    skillPillText: {
      fontSize: 10,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_SemiBold,
      textTransform: 'uppercase',
    },

    // --- Bar Skill Meter Styles ---
    barSkillContainer: {
      marginBottom: 8,
      padding: 10,
      backgroundColor: theme.background, // Use a lighter/secondary background
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    barSkillHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4, // Reduced margin
    },
    barSkillName: {
      fontSize: 14,
      fontFamily: fontFamily.Nunito_SemiBold,
      color: theme.primary,
      flex: 1,
    },
    barSkillRating: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    barRatingNumber: {
      fontSize: 13,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.accent,
    },
    barRatingMax: {
      fontSize: 11,
      color: theme.secondary,
      marginLeft: 2,
      fontFamily: fontFamily.Nunito_Regular,
    },
    progressBarBackground: {
      height: 6, // Slimmer progress bar
      backgroundColor: theme.border,
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 5,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8, // Reduced opacity for softer glow
      shadowRadius: 3, // Reduced radius
      elevation: 2,
    },
    skillLevelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    skillLevel: {
      fontSize: 10,
      fontFamily: fontFamily.Nunito_Bold,
      textTransform: 'uppercase',
      marginLeft: 4,
    },

    // --- Stats Card Styles ---
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8, // Use gap for spacing between cards
    },
    statCard: {
      flex: 1, // Use flex: 1 instead of fixed width percentage for reliability
      padding: 12,
      borderRadius: 16,
      alignItems: 'center',
      // Gradient cards rely on their built-in LinearGradient shadow for depth
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    statNumber: {
      fontSize: 16, // Slightly larger stat number
      color: '#FFFFFF',
      marginTop: 6, // Increased spacing
      fontFamily: fontFamily.Nunito_ExtraBold,
    },
    statLabel: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.9)',
      fontFamily: fontFamily.Nunito_SemiBold,
      marginBottom: 0,
      textAlign: 'center',
    },
    statSubtext: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      fontFamily: fontFamily.Nunito_Regular,
      marginTop: 2,
    },
  });

export default ProfileHeader;
