// components/CustomHeader.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CustomHeader = ({
  title,
  subtitle,
  onBackPress,
  onRightPress,
  rightIcon,
  showBackButton = true,
  backgroundColor = '#FFFFFF',
  titleColor = '#1F2937',
  subtitleColor = '#6B7280',
  showBorder = true,
  centerTitle = false,
}) => {
  // Default Back Icon
  const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19L5 12L12 5"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor },
        showBorder && styles.headerBorder,
      ]}
    >
      <View style={styles.leftSection}>
        {showBackButton && onBackPress && (
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
          centerTitle && styles.centerSectionCentered,
        ]}
      >
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Section - Action Button */}
      <View style={styles.rightSection}>
        {rightIcon && onRightPress && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Pre-built header variants
export const AnalyticsHeader = ({ onBackPress, onRightPress }) => {
  const ChartIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3V19H21"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14L10 11L13 15L17 9"
        stroke="#8641f4"
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
      onRightPress={onRightPress}
      rightIcon={<ChartIcon />}
      backgroundColor="#f8f9fa"
      showBorder={false}
    />
  );
};

export const AssessmentHeader = ({ onBackPress, onRightPress }) => {
  const AssessmentIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12L11 14L15 10M12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 11.2 17.2 13.2 15.8 14.5C15.8 14.5 15.8 14.5 15.7 14.6L12 18L8.3 14.6C8.3 14.6 8.3 14.5 8.2 14.5C6.8 13.2 6 11.2 6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3Z"
        stroke="#8641f4"
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
      onRightPress={onRightPress}
      rightIcon={<AssessmentIcon />}
      backgroundColor="#f8f9fa"
      showBorder={false}
    />
  );
};

export const SessionHeader = ({ onBackPress, onRightPress }) => {
  const SessionIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M8 2V6M16 2V6M3 10H21"
        stroke="#8641f4"
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
      onRightPress={onRightPress}
      rightIcon={<SessionIcon />}
      backgroundColor="#f8f9fa"
      showBorder={false}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 80,
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  centerSectionCentered: {
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  rightButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginTop: 2,
    textAlign: 'left',
  },
});

export default CustomHeader;