// ProfileHeader.js
import React from 'react';
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

const StaticGradients = {
  avatarRingGradient: ['#E28A2B', '#8A2BE2'], // Gold to Violet
  statsPrimaryGradient: ['#4C51BF', '#6B46C1'], // Deep Blue Gradient
  statsSuccessGradient: ['#38A169', '#48BB78'], // Green Gradient
  statsWarningGradient: ['#DD6B20', '#ED8936'], // Orange Gradient
};

const StaticColors = {
  ratingStar: '#FFD700',
  expert: '#2ECC71',
  advanced: '#3498DB',
  proficient: '#F39C12',
  beginner: '#E74C3C',
};

const StarIcon = ({ size = 16, color = StaticColors.ratingStar }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const ChartIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </Svg>
);

const TrendingIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </Svg>
);

const EditIcon = ({ size = 18, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

const ExpertIcon = ({ size = 14, color = StaticColors.expert }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" fill="none" />
  </Svg>
);

const AdvancedIcon = ({ size = 14, color = StaticColors.advanced }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
  </Svg>
);

const ProficientIcon = ({ size = 14, color = StaticColors.proficient }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
  </Svg>
);

const BeginnerIcon = ({ size = 14, color = StaticColors.beginner }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
  </Svg>
);

const DefaultIcon = ({ size = 14, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="8" />
    <Circle cx="12" cy="12" r="3" fill="#FFFFFF" />
  </Svg>
);

const ProfileHeader = ({ userData, onEditProfile }) => {
  const { theme, isDark } = useTheme();

  const name = 'Dr. Sarah Wilson';
  const title = 'Certified Hypnotherapist';
  const overallRating = 4.3;

  if (!userData) return null;
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
          return <DefaultIcon color={theme.accent} />;
      }
    };

    const levelColor = getLevelColor(level);

    return (
      <View style={dynamicStyles.barSkillContainer}>
        <View style={dynamicStyles.barSkillHeader}>
          <Text style={dynamicStyles.barSkillName}>{skill}</Text>
          <View style={dynamicStyles.barSkillRating}>
            <Text style={dynamicStyles.barRatingNumber}>{rating}</Text>
            <Text style={dynamicStyles.barRatingMax}>/5</Text>
          </View>
        </View>

        <View style={dynamicStyles.progressBarContainer}>
          <View style={dynamicStyles.progressBarBackground}>
            <View
              style={[
                dynamicStyles.progressBarFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: levelColor,
                  shadowColor: levelColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={dynamicStyles.skillLevelContainer}>
          {getLevelIcon(level)}
          <Text style={[dynamicStyles.skillLevel, { color: levelColor }]}>
            {level}
          </Text>
        </View>
      </View>
    );
  };

  const dynamicStyles = StyleSheet.create({
    profileContainer: {
      backgroundColor: theme.background, // Dynamic
      padding: 12,
      borderRadius: 20,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border, // Dynamic border color
      marginVertical: 16,
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
      width: 70,
      height: 70,
      borderRadius: 35,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInner: {
      width: '100%',
      height: '100%',
      borderRadius: 35,
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: theme.primary,
      fontSize: 20,
      fontWeight: '700',
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
      fontSize: 16,
      color: theme.primary, // Dynamic
      marginRight: 8,
      fontFamily: fontFamily.Nunito_Bold,
    },
    editButton: {
      padding: 4,
    },
    userTitle: {
      fontSize: 12,
      color: theme.secondary, // Dynamic
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
      backgroundColor: isDark ? '#3D3D3D' : theme.card, // Slight variation on badge
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border, // Dynamic
      marginRight: 8,
    },
    overallRating: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Bold,
      color: StaticColors.ratingStar, // Static
      marginLeft: 6,
    },
    ratingMax: {
      fontSize: 14,
      color: theme.secondary, // Dynamic
      marginLeft: 2,
      fontFamily: fontFamily.Nunito_Medium,
    },
    ratingText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Regular,
    },
    skillsContainer: {
      // No change
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
    skillPill: {
      backgroundColor: theme.card, // Dynamic
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    skillPillText: {
      fontSize: 10,
      color: theme.secondary, // Dynamic
      fontFamily: fontFamily.Nunito_SemiBold,
      textTransform: 'uppercase',
    },
    singleColumnSkillsGrid: {},

    barSkillContainer: {
      marginBottom: 8,
      padding: 10,
      backgroundColor: theme.card, // Dynamic
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border, // Dynamic
    },
    barSkillHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    barSkillName: {
      fontSize: 14,
      fontFamily: fontFamily.Nunito_SemiBold,
      color: theme.primary, // Dynamic
      flex: 1,
    },
    barSkillRating: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    barRatingNumber: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.accent, // Dynamic
    },
    barRatingMax: {
      fontSize: 12,
      color: theme.secondary, // Dynamic
      marginLeft: 0,
      fontFamily: fontFamily.Nunito_Regular,
    },
    progressBarContainer: {
      marginBottom: 4,
      position: 'relative',
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 5,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 3,
    },
    skillLevelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    skillLevel: {
      fontSize: 10,
      fontFamily: fontFamily.Nunito_Bold,
      textTransform: 'uppercase',
      marginLeft: 4,
    },

    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 0,
    },
    statCard: {
      width: '31%',
      padding: 10,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    statNumber: {
      fontSize: 14,
      color: '#FFFFFF',
      marginTop: 4,
      fontFamily: fontFamily.Nunito_ExtraBold,
    },
    statLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.9)',
      fontFamily: fontFamily.Nunito_SemiBold,
      marginBottom: 2,
      textAlign: 'center',
    },
    statSubtext: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      fontFamily: fontFamily.Nunito_Regular,
    },
  });

  return (
    <View style={dynamicStyles.profileContainer}>
      <View style={dynamicStyles.profileHeader}>
        <View style={dynamicStyles.avatarContainer}>
          <LinearGradient
            colors={StaticGradients.avatarRingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={dynamicStyles.avatarRing}
          >
            <View style={dynamicStyles.avatarInner}>
              <Text style={dynamicStyles.avatarText}>
                {name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={dynamicStyles.profileInfo}>
          <View style={dynamicStyles.nameContainer}>
            <Text style={dynamicStyles.userName}>{name}</Text>
            <TouchableOpacity
              style={dynamicStyles.editButton}
              onPress={onEditProfile}
            >
              <EditIcon color={theme.accent} />
            </TouchableOpacity>
          </View>
          <Text style={dynamicStyles.userTitle}>{title}</Text>

          <View style={dynamicStyles.ratingContainer}>
            <View style={dynamicStyles.ratingBadge}>
              <StarIcon size={18} />
              <Text style={dynamicStyles.overallRating}>
                {overallRating.toFixed(1)}
              </Text>
              <Text style={dynamicStyles.ratingMax}>/5</Text>
            </View>
            <Text style={dynamicStyles.ratingText}>Overall Rating</Text>
          </View>
        </View>
      </View>

      <View style={dynamicStyles.separator} />

      <View style={dynamicStyles.skillsContainer}>
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>Skill Breakdown</Text>
          <View style={dynamicStyles.skillPill}>
            <Text style={dynamicStyles.skillPillText}>Mastery Map</Text>
          </View>
        </View>

        <View style={dynamicStyles.singleColumnSkillsGrid}>
          <BarSkillMeter skill="Creativity" rating={4.5} level="EXPERT" />
          <BarSkillMeter skill="Expressive" rating={4.2} level="ADVANCED" />
          <BarSkillMeter skill="Submodali" rating={4.0} level="ADVANCED" />
          <BarSkillMeter skill="Tonality" rating={4.4} level="ADVANCED" />
        </View>
      </View>

      <View style={dynamicStyles.separator} />

      <View style={dynamicStyles.statsContainer}>
        <LinearGradient
          colors={StaticGradients.statsPrimaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.statCard}
        >
          <ChartIcon />
          <Text style={dynamicStyles.statNumber}>47</Text>
          <Text style={dynamicStyles.statLabel}>Total Sessions</Text>
          <Text style={dynamicStyles.statSubtext}>Lifetime</Text>
        </LinearGradient>

        <LinearGradient
          colors={StaticGradients.statsSuccessGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.statCard}
        >
          <TrendingIcon />
          <Text style={dynamicStyles.statNumber}>+12%</Text>
          <Text style={dynamicStyles.statLabel}>Monthly Growth</Text>
          <Text style={dynamicStyles.statSubtext}>This Month</Text>
        </LinearGradient>

        <LinearGradient
          colors={StaticGradients.statsWarningGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.statCard}
        >
          <StarIcon />
          <Text style={dynamicStyles.statNumber}>4.8</Text>
          <Text style={dynamicStyles.statLabel}>Avg Rating</Text>
          <Text style={dynamicStyles.statSubtext}>Last 30 days</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ProfileHeader;
