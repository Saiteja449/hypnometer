import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const SearchIcon = ({ color, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.secondary; // Search icon is usually secondary color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={iconColor} strokeWidth="2" />
      <Path
        d="M21 21L16.65 16.65"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
