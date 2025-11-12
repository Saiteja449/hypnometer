import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
// Assuming your ThemeContext.js file is in a folder named 'Context'
import { useTheme } from '../Context/ThemeContext';

const ActionGradients = {
  newSession: ['#7A40F2', '#A673FF'],
  analyticsHub: ['#38C172', '#58D68D'],
  selfReview: ['#F56565', '#E33A3A'],
};

// --- SVG Icons ---
const PlusIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AnalyticsIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3V21H21"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 15L11 9L15 13L19 7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ReviewIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20H21M3 6L10.5 13.5L13.5 10.5L21 18M3 6V18H21V6H3Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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
      icon: <PlusIcon color="#FFFFFF" />,
      screen: 'NewSessionScreen',
      colors: ActionGradients.newSession,
      description: 'Create and log new therapy sessions',
    },
    {
      id: 2,
      title: 'Analytics Hub',
      icon: <AnalyticsIcon color="#FFFFFF" />,
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
      padding: 16,
      borderRadius: 20,
      shadowColor: isDark ? theme.cardShadow : theme.cardShadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 15,
      elevation: 10,
    },
    sectionHeader: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary, // Dynamic
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.secondary, // Dynamic
      fontWeight: '500',
    },
    actionsList: {
      gap: 16,
    },
    actionCard: {
      borderRadius: 16,
      padding: 20,
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
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    actionTextContainer: {
      flex: 1,
    },
    actionCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '400',
    },
    actionArrow: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 10,
      borderRadius: 12,
      marginLeft: 12,
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
