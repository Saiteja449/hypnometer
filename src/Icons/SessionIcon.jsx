import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const SessionIcon = ({ size = 20, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.accent;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M8 2V6M16 2V6M3 10H21"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SessionIcon;
