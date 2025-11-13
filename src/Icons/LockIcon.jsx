import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const LockIcon = ({ color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Use prop color or theme.accent

  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="10"
        width="18"
        height="12"
        rx="3"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15" r="2" fill={iconColor} />
    </Svg>
  );
};

export default LockIcon;
