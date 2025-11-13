import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const LockIcon = ({ color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LockIcon;
