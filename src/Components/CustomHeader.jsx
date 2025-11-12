import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { useTheme } from '../Context/ThemeContext';

const { width } = Dimensions.get('window');

const CustomHeader = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = true,
  showBorder = true,
  centerTitle = false,
  showThemeToggle = true,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const backgroundColor = theme.card;
  const titleColor = theme.primary;
  const subtitleColor = theme.secondary;
  const borderColor = theme.border;

  const hasLeftIcon = showBackButton && onBackPress;
  const hasRightIcon = showThemeToggle;
  const shouldCenterTitle = centerTitle || (!hasLeftIcon && !hasRightIcon);

  const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19L5 12L12 5"
        stroke={titleColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ThemeToggleIcon = () => (
    <TouchableOpacity onPress={toggleTheme} style={styles.rightButton}>
      <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={titleColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDark ? (
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ) : (
          <>
            <Circle cx="12" cy="12" r="5" fill="none" stroke={titleColor} />
            <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </>
        )}
      </Svg>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor },
        showBorder && { borderBottomColor: borderColor, borderBottomWidth: 1 },
      ]}
    >
      <View style={styles.leftSection}>
        {hasLeftIcon && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BackIcon />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.centerSection,
          shouldCenterTitle && styles.centerSectionCentered,
        ]}
      >
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: subtitleColor }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {showThemeToggle && <ThemeToggleIcon />}
      </View>
    </View>
  );
};

export const AnalyticsHeader = ({ onBackPress }) => {
  const { theme } = useTheme();
  const iconColor = theme.accent;

  const ChartIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

  return (
    <CustomHeader
      title="Session Analytics"
      subtitle="Track your performance and growth over time"
      onBackPress={onBackPress}
      showBorder={false}
    />
  );
};

export const AssessmentHeader = ({ onBackPress }) => {
  const { theme } = useTheme();
  const iconColor = theme.accent;

  const AssessmentIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12L11 14L15 10M12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 11.2 17.2 13.2 15.8 14.5C15.8 14.5 15.8 14.5 15.7 14.6L12 18L8.3 14.6C8.3 14.6 8.3 14.5 8.2 14.5C6.8 13.2 6 11.2 6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3Z"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <CustomHeader
      title="Self Assessment"
      subtitle="Reflect on your recent session performance"
      onBackPress={onBackPress}
      showBorder={false}
    />
  );
};

export const SessionHeader = ({ onBackPress }) => {
  const { theme } = useTheme();
  const iconColor = theme.accent;

  const SessionIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={iconColor}
        strokeWidth="2"
      />
      <Path
        d="M8 2V6M16 2V6M3 10H21"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <CustomHeader
      title="Create New Session"
      subtitle="Track your hypnotherapy sessions and get feedback"
      onBackPress={onBackPress}
      showBorder={false}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  centerSectionCentered: {
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
  },
  rightButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginTop: 2,
    textAlign: 'left',
  },
});

export default CustomHeader;
