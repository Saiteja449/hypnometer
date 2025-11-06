import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import ProfileHeader from '../Components/ProfileHeader';
import { styles } from '../globalcss';
import QuickActions from '../Components/QuickActions';
import GrowthGraph from '../Components/GrowthGraph';
import SessionList from '../Components/SessionList';
import CustomHeader from '../Components/CustomHeader';

const DashboardScreen = ({ navigation }) => {
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
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Dashboard" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <ProfileHeader userData={userData} />
        <QuickActions navigation={navigation} />
        <GrowthGraph />
        <SessionList sessions={recentSessions} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
