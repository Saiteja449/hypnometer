import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const ApprovalIcon = ({ color, size = 120 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" />
      <Path
        d="M8 12L11 15L16 9"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="8" r="1" fill={iconColor} />
      <Path
        d="M12 12V15"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default ApprovalIcon;
