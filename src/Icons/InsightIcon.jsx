import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const InsightIcon = ({ type, size = 24 }) => {
  const { theme } = useTheme();
  const successColor = theme.success;
  const warningColor = theme.warning;

  if (type === 'strength') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M14.5 2.5C14.5 2.5 16 4.5 16 7C16 9.5 14 11.5 12 11.5C10 11.5 8 9.5 8 7C8 4.5 9.5 2.5 9.5 2.5"
          stroke={successColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M12 14V20"
          stroke={successColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M8 18H16"
          stroke={successColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={warningColor} strokeWidth="2" />
      <Path
        d="M12 8V12M12 16H12.01"
        stroke={warningColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default InsightIcon;
