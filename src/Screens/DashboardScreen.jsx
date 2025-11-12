import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import ProfileHeader from '../Components/ProfileHeader';
import QuickActions from '../Components/QuickActions';
import GrowthGraph from '../Components/GrowthGraph';
import SessionList from '../Components/SessionList';
import CustomHeader from '../Components/CustomHeader';

import { useTheme } from '../Context/ThemeContext';

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setUserData({
      name: 'Dr. Sarah Wilson',
      overallRating: 4.3,
      skills: {
        creativity: 4.5,
        expressiveness: 4.2,
        submodalities: 4.0,
        tonality: 4.4,
        overall: 4.3,
      },
      totalSessions: 47,
      monthlyGrowth: '+12%',
    });

    setRecentSessions([
      {
        id: 1,
        title: 'Anxiety Relief Session',
        type: 'Anxiety',
        date: '2024-01-15',
        avgRating: 4.5,
        ratings: [4, 5, 4, 5, 5],
      },
      {
        id: 2,
        title: 'Confidence Building',
        type: 'Confidence',
        date: '2024-01-14',
        avgRating: 4.2,
        ratings: [4, 4, 3, 5, 5],
      },
      {
        id: 3,
        title: 'Trauma Processing',
        type: 'Trauma',
        date: '2024-01-13',
        avgRating: 4.8,
        ratings: [5, 5, 5, 4, 5],
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const dynamicStyles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
    },
    componentWrapper: {
      marginBottom: 16,
    },
  });

  return (
    <View style={dynamicStyles.screenContainer}>
      <CustomHeader title="Dashboard" />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
            progressBackgroundColor={theme.card}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollViewContent}
      >
        <View style={dynamicStyles.componentWrapper}>
          <ProfileHeader userData={userData} />
        </View>
        <View style={dynamicStyles.componentWrapper}>
          <QuickActions navigation={navigation} />
        </View>
        <View style={dynamicStyles.componentWrapper}>
          <GrowthGraph />
        </View>
        <View style={dynamicStyles.componentWrapper}>
          <SessionList
            sessions={recentSessions}
            navigation={navigation}
            title="Recent Sessions"
            showViewAll={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
