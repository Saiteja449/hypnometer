import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const QuickActions = ({ navigation }) => {
  // SVG Icons (unchanged)
  const PlusIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const AnalyticsIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3V21H21"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 15L11 9L15 13L19 7"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ReviewIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20H21M3 6L10.5 13.5L13.5 10.5L21 18M3 6V18H21V6H3Z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ArrowIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const actions = [
    {
      id: 1,
      title: 'New Session',
      icon: <PlusIcon />,
      screen: 'NewSessionScreen',
      color: '#8641f4',
      description: 'Create and log new therapy sessions'
    },
    {
      id: 2,
      title: 'Analytics',
      icon: <AnalyticsIcon />,
      screen: 'AnalyticsScreen',
      color: '#41b884',
      description: 'View performance insights and growth'
    },
    {
      id: 3,
      title: 'Self Review',
      icon: <ReviewIcon />,
      screen: 'SelfAssessmentScreen',
      color: '#f44182',
      description: 'Reflect on your session performance'
    },
  ];

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.sectionSubtitle}>
          One-tap access to key features
        </Text>
      </View>

      <View style={styles.actionsList}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { backgroundColor: action.color }]}
            onPress={() => navigation.navigate(action.screen)}
            activeOpacity={0.9}
          >
            <View style={styles.actionCardContent}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconContainer}>
                  {action.icon}
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionCardTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </View>
              <View style={styles.actionArrow}>
                <ArrowIcon />
              </View>
            </View>

            {/* Decorative elements */}
            <View style={styles.cardDecoration} />
            <View style={[styles.cardDot, styles.cardDot1]} />
            <View style={[styles.cardDot, styles.cardDot2]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F2FF',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'Nunito-Medium',
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Nunito-Medium',
  },
  actionArrow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginLeft: 12,
  },
  cardDecoration: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardDot1: {
    top: 25,
    right: 25,
  },
  cardDot2: {
    top: 45,
    right: 45,
    width: 4,
    height: 4,
  },
});

export default QuickActions;