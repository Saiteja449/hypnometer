import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const PendingIcon = ({ color, size = 20 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Default to accent, but pending has specific color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" /> {/* Hardcoded for pending */}
      <Path
        d="M12 6V12L16 14"
        stroke="#F59E0B" // Hardcoded for pending
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PendingIcon;
