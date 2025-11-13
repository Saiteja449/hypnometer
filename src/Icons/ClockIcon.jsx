import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const ClockIcon = ({ color, size = 24 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={iconColor} strokeWidth="2" />
      <Path
        d="M12 6V12L16 14"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ClockIcon;
