import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const ChartIcon = ({ size = 24, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3V19H21"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14L10 11L13 15L17 9"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChartIcon;
