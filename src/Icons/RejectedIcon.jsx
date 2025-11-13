import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const RejectedIcon = ({ color, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Default to accent, but rejected has specific color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" /> {/* Hardcoded for rejected */}
      <Path
        d="M15 9L9 15"
        stroke="#EF4444" // Hardcoded for rejected
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9L15 15"
        stroke="#EF4444" // Hardcoded for rejected
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default RejectedIcon;
