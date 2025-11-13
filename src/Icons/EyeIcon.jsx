import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const EyeIcon = ({ open = false, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <Path
            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="3" stroke={iconColor} strokeWidth="2" />
        </>
      ) : (
        <>
          <Path
            d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 2 12 2 12C2.825 10.58 4.06 8.94 5.66 7.66M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 22 12 22 12C21.393 13.135 20.404 14.37 19.06 15.06"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 2L22 22"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
};

export default EyeIcon;
