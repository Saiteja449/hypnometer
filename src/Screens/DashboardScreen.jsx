import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import ProfileHeader from '../Components/ProfileHeader';
import QuickActions from '../Components/QuickActions';
import GrowthGraph from '../Components/GrowthGraph';
import SessionList from '../Components/SessionList';
import CustomHeader from '../Components/CustomHeader';
import UpdateProfileModal from '../Components/UpdateProfileModal'; // Import the new modal component

import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext'; // Import useApp to get user data
import { TouchableOpacity, Text } from 'react-native'; // Import TouchableOpacity and Text

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, getUserDetails } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        overallRating: user.overallRating || 0,
        skills: user.skills || {},
        totalSessions: user.totalSessions || 0,
        monthlyGrowth: user.monthlyGrowth || '0%',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        profile_photo: user.profile_photo,
      });
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserDetails(user.id); // Refresh user data from AppContext
    loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleProfileUpdateSuccess = async () => {
    await getUserDetails(user.id);
    loadDashboardData();
  };

  const getStyles = theme =>
    StyleSheet.create({
      screenContainer: {
        flex: 1,
        backgroundColor: theme.background,
      },
      scrollViewContent: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 30,
      },
      componentWrapper: {
        marginBottom: 12,
      },
      updateProfileButton: {
        backgroundColor: theme.accent,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
      },
      updateProfileButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
      },
    });

  const styles = getStyles(theme);

  return (
    <View style={styles.screenContainer}>
      <CustomHeader
        title="Dashboard"
        showLogoutButton={true}
        showThemeToggle={true}
      />
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
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.componentWrapper}>
          <ProfileHeader
            userData={userData}
            setShowUpdateProfileModal={setShowUpdateProfileModal}
          />
        </View>
        <View style={styles.componentWrapper}>
          <QuickActions navigation={navigation} />
        </View>
        <View style={styles.componentWrapper}>
          <GrowthGraph />
        </View>
        <View style={styles.componentWrapper}>
          <SessionList
            sessions={recentSessions}
            navigation={navigation}
            title="Recent Sessions"
            showViewAll={true}
          />
        </View>
      </ScrollView>

      {userData && (
        <UpdateProfileModal
          isVisible={showUpdateProfileModal}
          onClose={() => setShowUpdateProfileModal(false)}
          currentUser={userData}
          onUpdateSuccess={handleProfileUpdateSuccess}
        />
      )}
    </View>
  );
};

export default DashboardScreen;
