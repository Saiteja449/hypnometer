import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const PhoneIcon = ({ color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92V19.92C22 20.52 21.49 21.03 20.89 21.05C20.39 21.07 19.89 21.09 19.39 21.09C10.73 21.09 3.42 13.78 3.42 5.12C3.42 4.62 3.44 4.12 3.46 3.62C3.48 3.02 3.99 2.51 4.59 2.51H7.59C8.19 2.51 8.69 2.98 8.71 3.57C8.73 4.07 8.75 4.57 8.75 5.07C8.75 7.56 9.53 9.88 10.89 11.83C12.25 13.78 14.12 15.25 16.25 16.02C16.75 16.19 17.25 16.34 17.75 16.47C18.33 16.62 18.79 17.11 18.79 17.71V20.71"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PhoneIcon;
