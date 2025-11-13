import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const BlockedIcon = ({ color, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Default to accent, but blocked has specific color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2" /> {/* Hardcoded for blocked */}
      <Path
        d="M18 6L6 18"
        stroke="#6B7280" // Hardcoded for blocked
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BlockedIcon;
