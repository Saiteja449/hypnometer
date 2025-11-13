import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../globalcss';

const RatingStars = ({ rating, size = 16, showNumber = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Text
            key={index}
            style={[
              styles.star,
              {
                fontSize: size,
                color:
                  index < fullStars
                    ? '#FFD700'
                    : index === fullStars && hasHalfStar
                    ? '#FFD700'
                    : '#DDD',
              },
            ]}
          >
            {index < fullStars
              ? '★'
              : index === fullStars && hasHalfStar
              ? '★'
              : '☆'}
          </Text>
        ))}
      </View>
      {showNumber && (
        <Text style={[styles.ratingText, { fontSize: size - 2 }]}>
          {rating?.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

export default RatingStars;
