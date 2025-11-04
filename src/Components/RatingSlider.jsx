import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from '../globalcss';

const RatingSlider = ({ skill, icon, rating, onRatingChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillIcon}>{icon}</Text>
        <Text style={styles.skillName}>{skill}</Text>
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      </View>

      <Slider
        value={rating}
        onValueChange={onRatingChange}
        minimumValue={0}
        maximumValue={5}
        step={0.5}
        minimumTrackTintColor="#8641f4"
        maximumTrackTintColor="#f0f0f0"
        thumbTintColor="#8641f4"
      />

      <View style={styles.ratingLabels}>
        {[0,1,2,3,4,5].map(num => (
          <Text key={num} style={styles.ratingLabel}>{num}</Text>
        ))}
      </View>
    </View>
  );
};

export default RatingSlider;
