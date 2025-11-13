import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../globalcss';

export const CompactSkillMeter = ({ skill, rating, size = 'medium' }) => {
  const getSkillColor = skillName => {
    const colors = {
      Creativity: '#FF6B6B',
      Expressiveness: '#4ECDC4',
      Submodalities: '#45B7D1',
      Tonality: '#96CEB4',
      Overall: '#8641f4',
    };
    return colors[skillName] || '#8641f4';
  };

  const getSkillIcon = skillName => {
    const icons = {
      Creativity: '🎨',
      Expressiveness: '🎭',
      Submodalities: '🌀',
      Tonality: '🎤',
      Overall: '⭐',
    };
    return icons[skillName] || '⭐';
  };

  const containerSize =
    size === 'small'
      ? styles.compactSmall
      : size === 'large'
      ? styles.compactLarge
      : styles.compactMedium;

  return (
    <View style={[styles.compactContainer, containerSize]}>
      <View style={styles.compactIcon}>
        <Text style={styles.compactIconText}>{getSkillIcon(skill)}</Text>
      </View>
      <View style={styles.compactInfo}>
        <Text style={styles.compactSkillName} numberOfLines={1}>
          {skill}
        </Text>
        <View style={styles.compactProgressBar}>
          <View
            style={[
              styles.compactProgressFill,
              {
                width: `${(rating / 5) * 100}%`,
                backgroundColor: getSkillColor(skill),
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.compactRating}>{rating.toFixed(1)}</Text>
    </View>
  );
};
