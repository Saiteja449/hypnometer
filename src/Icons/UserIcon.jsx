import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const UserIcon = ({ color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={iconColor} strokeWidth="2" />
      <Path
        d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default UserIcon;
