// components/Common/SkillMeter.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from '../../globalcss';

const SkillMeter = ({ skill, rating, showLabel = true, showRating = true }) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animate the progress bar when component mounts or rating changes
    Animated.timing(progressAnim, {
      toValue: (rating / 5) * 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [rating]);

  const getSkillIcon = skillName => {
    const icons = {
      Creativity: '🎨',
      Expressiveness: '🎭',
      Submodalities: '🌀',
      Tonality: '🎤',
      Overall: '💫',
    };
    return icons[skillName] || '⭐';
  };

  const getSkillColor = skillName => {
    const colors = {
      Creativity: '#FF6B6B',
      Expressiveness: '#4ECDC4',
      Submodalities: '#45B7D1',
      Tonality: '#96CEB4',
      Overall: '#FFEAA7',
    };
    return colors[skillName] || '#8641f4';
  };

  const getRatingColor = rating => {
    if (rating >= 4) return '#27ae60'; // Green for excellent
    if (rating >= 3) return '#f39c12'; // Orange for good
    return '#e74c3c'; // Red for needs improvement
  };

  const interpolateColor = progressAnim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['#e74c3c', '#f39c12', '#27ae60'],
  });

  return (
    <View style={styles.skillContainer}>
      {showLabel && (
        <View style={styles.skillHeader}>
          <View style={styles.skillInfo}>
            <Text style={styles.skillIcon}>{getSkillIcon(skill)}</Text>
            <Text style={styles.skillName}>{skill}</Text>
          </View>
          {showRating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
              <Text style={styles.ratingMax}>/5</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: getSkillColor(skill),
              },
            ]}
          />
        </View>

        {/* Progress markers */}
        <View style={styles.progressMarkers}>
          <View style={styles.marker} />
          <View style={styles.marker} />
          <View style={styles.marker} />
          <View style={styles.marker} />
        </View>
      </View>

      {/* Skill level indicator */}
      <View style={styles.skillLevelContainer}>
        <Text style={[styles.skillLevel, { color: getRatingColor(rating) }]}>
          {rating >= 4.5
            ? 'Expert'
            : rating >= 4
            ? 'Advanced'
            : rating >= 3
            ? 'Proficient'
            : rating >= 2
            ? 'Developing'
            : 'Beginner'}
        </Text>
      </View>
    </View>
  );
};

export default SkillMeter;