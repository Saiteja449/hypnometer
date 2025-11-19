import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';
import SessionIcon from '../Icons/SessionIcon';
import ChartIcon from '../Icons/ChartIcon';
import { fontFamily } from '../utils/common';

const ActionGradients = {
  newSession: ['#7A40F2', '#A673FF'], // Purple
  analyticsHub: ['#38C172', '#58D68D'], // Green
  selfReview: ['#F56565', '#E33A3A'], // Red
};

// --- SVG Icons ---
const ArrowIcon = ({ color }) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M3 8H13M13 8L9 4M13 8L9 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const QuickActions = ({ navigation }) => {
  const { theme, isDark } = useTheme();

  // Memoize dynamic styles based on theme changes
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const actions = [
    {
      id: 1,
      title: 'New Session',
      icon: <SessionIcon color="#FFFFFF" />,
      screen: 'NewSessionScreen',
      colors: ActionGradients.newSession,
      description: 'Create and log new therapy sessions',
    },
    {
      id: 2,
      title: 'Analytics Hub',
      icon: <ChartIcon color="#FFFFFF" />,
      screen: 'AnalyticsScreen',
      colors: ActionGradients.analyticsHub,
      description: 'View performance insights and growth metrics',
    },
    // {
    //   id: 3,
    //   title: 'Self Review',
    //   icon: <ReviewIcon color="#FFFFFF" />,
    //   screen: 'SelfAssessmentScreen',
    //   colors: ActionGradients.selfReview,
    //   description: 'Reflect and rate your session performance',
    // },
  ];

  const ActionCard = ({ action }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (navigation && navigation.navigate) {
          // Use standard navigation pattern
          navigation.navigate(action.screen);
        } else {
          console.log(`Navigating to ${action.screen}`);
        }
      }}
    >
      <LinearGradient
        colors={action.colors}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.actionCard}
      >
        {/* Decoration Element */}
        <View style={styles.cardDecoration} />

        {/* Card Content */}
        <View style={styles.actionCardContent}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>{action.icon}</View>

            <View style={styles.actionTextContainer}>
              <Text style={styles.actionCardTitle}>{action.title}</Text>
              <Text style={styles.actionDescription} numberOfLines={1}>
                {action.description}
              </Text>
            </View>
          </View>

          <View style={styles.actionArrow}>
            <ArrowIcon color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions </Text>
        <Text style={styles.sectionSubtitle}>
          One-tap access to your core workflows
        </Text>
      </View>

      <View style={styles.actionsList}>
        {actions.map(action => (
          <ActionCard key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
};

// --- Stylesheet Creation Function ---
const createStyles = (theme, isDark) =>
  StyleSheet.create({
    actionsContainer: {
      backgroundColor: theme.card,
      padding: 16, // Increased padding for a more spacious look
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 }, // Slightly softer shadow
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionHeader: {
      marginBottom: 16, // Increased margin
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_Medium,
      marginTop: 2,
    },
    actionsList: {
      gap: 12, // Increased gap between cards
    },
    actionCard: {
      borderRadius: 16,
      padding: 16, // Increased padding
      position: 'relative',
      overflow: 'hidden',
    },
    actionCardContent: {
      position: 'relative',
      zIndex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      // Use a slightly darker/more subtle background for the icon container
      backgroundColor: 'rgba(0,0,0,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12, // Increased margin
    },
    actionTextContainer: {
      flex: 1,
    },
    actionCardTitle: {
      fontSize: 16, // Slightly larger title
      fontFamily: fontFamily.Nunito_Bold,
      color: '#FFFFFF',
      marginBottom: 2,
    },
    actionDescription: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.7)', // Slightly more transparent for better contrast
      fontFamily: fontFamily.Nunito_Regular,
    },
    actionArrow: {
      backgroundColor: 'rgba(0,0,0,0.15)', // More subtle background for the arrow
      padding: 8,
      borderRadius: 14,
      marginLeft: 10,
    },
    cardDecoration: {
      position: 'absolute',
      top: -60,
      right: -60,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(255,255,255,0.08)', // Brighter, larger decoration circle
    },
  });

export default QuickActions;
