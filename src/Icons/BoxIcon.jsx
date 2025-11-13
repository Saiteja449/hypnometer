import React from 'react';
import { Svg, Rect } from 'react-native-svg';

const BoxIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="1"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

export default BoxIcon;
