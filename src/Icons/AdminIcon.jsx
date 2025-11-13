import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';

const AdminIcon = ({ color, size = 24 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.accent;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M2.905 18.249C3.827 16.653 5.153 15.327 6.749 14.405C8.345 13.483 10.147 13 12 13C13.853 13 15.655 13.483 17.251 14.405C18.847 15.327 20.173 16.653 21.095 18.249"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="9" r="1" fill={iconColor} />
      <Path
        d="M12 12V13"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default AdminIcon;
