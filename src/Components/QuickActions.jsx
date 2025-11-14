import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
// Assuming your ThemeContext.js file is in a folder named 'Context'
import { useTheme } from '../Context/ThemeContext';
import SessionIcon from '../Icons/SessionIcon';
import ChartIcon from '../Icons/ChartIcon';

const ActionGradients = {
  newSession: ['#7A40F2', '#A673FF'],
  analyticsHub: ['#38C172', '#58D68D'],
  selfReview: ['#F56565', '#E33A3A'],
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

  const dynamicStyles = StyleSheet.create({
    actionsContainer: {
      backgroundColor: theme.card,
      padding: 12,
      borderRadius: 20,
      shadowColor: isDark ? theme.cardShadow : theme.cardShadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 15,
      elevation: 10,
    },
    sectionHeader: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary, // Dynamic
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.secondary, // Dynamic
      fontWeight: '500',
    },
    actionsList: {
      gap: 12,
    },
    actionCard: {
      borderRadius: 16,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 100,
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
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    actionTextContainer: {
      flex: 1,
    },
    actionCardTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    actionDescription: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '400',
    },
    actionArrow: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 8,
      borderRadius: 12,
      marginLeft: 8,
    },
    cardDecoration: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
  });

  const ActionCard = ({ action }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (navigation && navigation.navigate) {
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
        style={dynamicStyles.actionCard}
      >
        <View style={dynamicStyles.actionCardContent}>
          <View style={dynamicStyles.actionLeft}>
            <View style={dynamicStyles.actionIconContainer}>{action.icon}</View>

            <View style={dynamicStyles.actionTextContainer}>
              <Text style={dynamicStyles.actionCardTitle}>{action.title}</Text>
              <Text style={dynamicStyles.actionDescription}>
                {action.description}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.actionArrow}>
            <ArrowIcon color="#FFFFFF" />
          </View>

          <View style={dynamicStyles.cardDecoration} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.actionsContainer}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
        <Text style={dynamicStyles.sectionSubtitle}>
          One-tap access to your core workflows
        </Text>
      </View>

      <View style={dynamicStyles.actionsList}>
        {actions.map(action => (
          <ActionCard key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
};

export default QuickActions;
