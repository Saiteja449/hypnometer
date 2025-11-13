import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const ApprovedIcon = ({ color, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Default to accent, but approved has specific color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" /> {/* Hardcoded for approved */}
      <Path
        d="M8 12L11 15L16 9"
        stroke="#10B981" // Hardcoded for approved
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ApprovedIcon;
