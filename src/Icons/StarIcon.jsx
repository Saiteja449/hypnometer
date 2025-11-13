import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const StarIcon = ({ size = 24, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.warning; // Default to theme.warning if no color prop is passed

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </Svg>
  );
};

export default StarIcon;
