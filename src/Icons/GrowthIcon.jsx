import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const GrowthIcon = ({ size = 20, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.success;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6H23V12"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default GrowthIcon;
