import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const EmailIconAdmin = ({ color, size = 16 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.secondary; // This email icon uses secondary color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M2 6L12 13L22 6"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EmailIconAdmin;
