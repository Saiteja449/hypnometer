import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const EmailIcon = ({ color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent; // Use prop color or theme.accent

  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EmailIcon;
