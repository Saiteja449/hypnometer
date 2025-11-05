import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');

// SVG Icon Components (unchanged)
const StarIcon = ({ size = 16, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const TrophyIcon = ({ size = 16, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 4h-3V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H3c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2 0 2.21 1.79 4 4 4v1h-2c-.55 0-1 .45-1 1v2h6v-2c0-.55-.45-1-1-1h-2v-1c2.21 0 4-1.79 4-4 1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2V5c0-.55-.45-1-1-1zM5 8V6h2v2.82C6.55 8.4 6 7.74 6 7c0-.73.55-1.38 1-1.82V6h1c.55 0 1 .45 1 1s-.45 1-1 1H5zm13 1c0 .55-.45 1-1 1h-1v1c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-1H8c-.55 0-1-.45-1-1s.45-1 1-1h1V6h2v2h2V6h2v2h1c.55 0 1 .45 1 1v1z" />
  </Svg>
);

const ChartIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </Svg>
);

const TrendingIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </Svg>
);

const GrowthIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </Svg>
);

const EditIcon = ({ size = 14, color = '#8641f4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

const ExpertIcon = ({ size = 12, color = '#27ae60' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" fill="none" />
  </Svg>
);

const AdvancedIcon = ({ size = 12, color = '#3498db' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
  </Svg>
);

const ProficientIcon = ({ size = 12, color = '#f39c12' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
  </Svg>
);

const BeginnerIcon = ({ size = 12, color = '#e74c3c' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
  </Svg>
);

const DefaultIcon = ({ size = 12, color = '#8641f4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="8" />
    <Circle cx="12" cy="12" r="3" fill="#FFFFFF" />
  </Svg>
);

const ProfileHeader = ({ userData, onEditProfile }) => {
  if (!userData) return null;

  // Custom Bar Skill Meter Component
  const BarSkillMeter = ({ skill, rating, level }) => {
    const percentage = (rating / 5) * 100;

    const getLevelColor = level => {
      switch (level) {
        case 'EXPERT':
          return '#27ae60';
        case 'ADVANCED':
          return '#3498db';
        case 'PROFICIENT':
          return '#f39c12';
        case 'BEGINNER':
          return '#e74c3c';
        default:
          return '#8641f4';
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
          return <DefaultIcon />;
      }
    };

    return (
      <View style={styles.barSkillContainer}>
        <View style={styles.barSkillHeader}>
          <Text style={styles.barSkillName}>{skill}</Text>
          <View style={styles.barSkillRating}>
            <Text style={styles.barRatingNumber}>{rating}</Text>
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
                  backgroundColor: getLevelColor(level),
                },
              ]}
            />
          </View>

          {/* Progress Markers */}
          <View style={styles.progressMarkers}>
            {[1, 2, 3, 4, 5].map(marker => (
              <View
                key={marker}
                style={[
                  styles.progressMarker,
                  marker * 20 <= percentage && styles.progressMarkerActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.skillLevelContainer}>
          {getLevelIcon(level)}
          <Text style={[styles.skillLevel, { color: getLevelColor(level) }]}>
            {level}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGradient}>
            <Text style={styles.avatarText}>
              {userData.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>Dr. Sarah Wilson</Text>
            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
              <EditIcon />
            </TouchableOpacity>
          </View>
          <Text style={styles.userTitle}>Certified Hypnotherapist</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <StarIcon size={14} />
              <Text style={styles.overallRating}>4.3</Text>
              <Text style={styles.ratingMax}>/5</Text>
            </View>
            <Text style={styles.ratingText}>Overall Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skill Breakdown</Text>
          <View style={styles.skillPill}>
            <Text style={styles.skillPillText}>Mastery Level</Text>
          </View>
        </View>

        <View style={styles.skillsGrid}>
          <View style={styles.skillColumn}>
            <BarSkillMeter skill="Creativity" rating={4.5} level="EXPERT" />

            <BarSkillMeter skill="Expressive" rating={4.2} level="ADVANCED" />
          </View>

          <View style={styles.skillColumn}>
            <BarSkillMeter skill="Submodali" rating={4.0} level="ADVANCED" />

            <BarSkillMeter skill="Tonality" rating={4.4} level="ADVANCED" />
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <ChartIcon size={16} color="#FFFFFF" />
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
          <Text style={styles.statSubtext}>Lifetime</Text>
        </View>

        <View style={[styles.statCard, styles.statCardSuccess]}>
          <TrendingIcon size={16} color="#FFFFFF" />
          <Text style={styles.statNumber}>+12%</Text>
          <Text style={styles.statLabel}>Monthly Growth</Text>
          <Text style={styles.statSubtext}>This Month</Text>
        </View>

        <View style={[styles.statCard, styles.statCardWarning]}>
          <StarIcon size={16} color="#FFFFFF" />
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
          <Text style={styles.statSubtext}>Last 30 days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8641f4',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
    fontFamily: 'Nunito-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE999',
    marginRight: 8,
  },
  overallRating: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#D97706',
    marginLeft: 4,
  },
  ratingMax: {
    fontSize: 12,
    color: '#D97706',
    marginLeft: 2,
    fontFamily: 'Nunito-Regular',
  },
  ratingText: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'Nunito-Regular',
  },
  skillsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
  },
  skillPill: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillPillText: {
    fontSize: 12,
    color: '#4A5568',
    fontFamily: 'Nunito-SemiBold',
  },
  skillsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillColumn: {
    width: '48%',
  },

  // Bar Skill Meter Styles
  barSkillContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barSkillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barSkillName: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#2D3748',
    flex: 1,
  },
  barSkillRating: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  barRatingNumber: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
  },
  barRatingMax: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 2,
    fontFamily: 'Nunito-Regular',
  },
  progressBarContainer: {
    marginBottom: 6,
    position: 'relative',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  progressMarkers: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: 2,
    paddingHorizontal: 2,
  },
  progressMarker: {
    width: 2,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
  },
  progressMarkerActive: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  skillLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillLevel: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
    marginLeft: 4,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '31%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardPrimary: {
    backgroundColor: '#8641f4',
  },
  statCardSuccess: {
    backgroundColor: '#4ECDC4',
  },
  statCardWarning: {
    backgroundColor: '#FF6B6B',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 6,
    color: '#FFFFFF',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  achievementContainer: {
    alignItems: 'center',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE999',
    width: '100%',
    justifyContent: 'center',
  },
  achievementText: {
    alignItems: 'center',
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#D97706',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#B45309',
    fontFamily: 'Nunito-Regular',
  },
});

export default ProfileHeader;
