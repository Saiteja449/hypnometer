import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';

import CustomHeader from '../../Components/CustomHeader';
import { useTheme } from '../../Context/ThemeContext';
import { useApp } from '../../Context/AppContext';
import AdminIcon from '../../Icons/AdminIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import BlockedIcon from '../../Icons/BlockedIcon';
import EmailIconAdmin from '../../Icons/EmailIconAdmin';
import PendingIcon from '../../Icons/PendingIcon';
import RejectedIcon from '../../Icons/RejectedIcon';
import SearchIcon from '../../Icons/SearchIcon';
import SettingsIcon from '../../Icons/SettingsIcon';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const { theme, isDark } = useTheme();
  const { allUsers, fetchAllUsers, user } = useApp();
  const styles = getStyles(theme, isDark);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);

  console.log('user', user);
  const adminProfile = {
    name: `${user?.first_name} ${user?.last_name}`,
    email: user?.email,
    role: 'Platform Administrator',
    profilePhoto: null,
  };

  const loadUsers = useCallback(async () => {
    try {
      await fetchAllUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again later.');
    }
  }, [fetchAllUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const formattedUsers = allUsers.map(user => ({
      ...user,
      firstName: user.first_name || 'N/A',
      lastName: user.last_name || '',
      status: user.status === null ? 'pending' : user.status,
    }));
    setUsers(formattedUsers);
  }, [allUsers]);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (selectedTab !== 'all') {
      filtered = filtered.filter(user => user.status === selectedTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedTab]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleUpdateStatus = (userId, newStatus) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );

    console.log(`API Call: Setting user ${userId} status to ${newStatus}`);
  };

  const handleApprove = userId => {
    Alert.alert('Approve User', 'Are you sure you want to approve this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => handleUpdateStatus(userId, 'approved'),
      },
    ]);
  };

  const handleReject = userId => {
    Alert.alert('Reject User', 'Are you sure you want to reject this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', onPress: () => handleUpdateStatus(userId, 'rejected') },
    ]);
  };

  const handleBlock = userId => {
    Alert.alert('Block User', 'Are you sure you want to block this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', onPress: () => handleUpdateStatus(userId, 'blocked') },
    ]);
  };

  const handleUnblock = userId => {
    Alert.alert('Unblock User', 'Are you sure you want to unblock this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        onPress: () => handleUpdateStatus(userId, 'approved'),
      },
    ]);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'rejected':
        return theme.danger;
      case 'blocked':
        return theme.secondary;
      default:
        return theme.secondary;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      case 'blocked':
        return 'Blocked';
      default:
        return 'N/A';
    }
  };

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length,
    blocked: users.filter(u => u.status === 'blocked').length,
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Admin Dashboard" />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                {adminProfile.profilePhoto ? (
                  <Image
                    source={{ uri: adminProfile.profilePhoto }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <AdminIcon color={theme.accent} size={30} />
                )}
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{adminProfile.name}</Text>
                <View style={styles.emailContainer}>
                  <EmailIconAdmin color={theme.secondary} size={14} />
                  <Text style={styles.profileEmail}>{adminProfile.email}</Text>
                </View>
                <Text style={styles.profileRole}>{adminProfile.role}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <SettingsIcon color={theme.accent} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>{stats.total}</Text>
              <Text style={styles.profileStatLabel}>Total Users</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>{stats.pending}</Text>
              <Text style={styles.profileStatLabel}>Pending</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>{stats.approved}</Text>
              <Text style={styles.profileStatLabel}>Approved</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <SearchIcon color={theme.secondary} size={20} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search users by name, email"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.secondary}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
            onPress={() => setSelectedTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'all' && styles.tabTextActive,
              ]}
            >
              All Users ({stats.total})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
            onPress={() => setSelectedTab('pending')}
          >
            <PendingIcon
              color={
                selectedTab === 'pending'
                  ? theme.buttonText
                  : getStatusColor('pending')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'pending' && styles.tabTextActive,
              ]}
            >
              Pending ({stats.pending})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'approved' && styles.tabActive]}
            onPress={() => setSelectedTab('approved')}
          >
            <ApprovedIcon
              color={
                selectedTab === 'approved'
                  ? theme.buttonText
                  : getStatusColor('approved')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'approved' && styles.tabTextActive,
              ]}
            >
              Approved ({stats.approved})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'rejected' && styles.tabActive]}
            onPress={() => setSelectedTab('rejected')}
          >
            <RejectedIcon
              color={
                selectedTab === 'rejected'
                  ? theme.buttonText
                  : getStatusColor('rejected')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'rejected' && styles.tabTextActive,
              ]}
            >
              Rejected ({stats.rejected})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'blocked' && styles.tabActive]}
            onPress={() => setSelectedTab('blocked')}
          >
            <BlockedIcon
              color={
                selectedTab === 'blocked'
                  ? theme.buttonText
                  : getStatusColor('blocked')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'blocked' && styles.tabTextActive,
              ]}
            >
              Blocked ({stats.blocked})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'No users found matching your search'
                  : `No ${
                      selectedTab === 'all' ? '' : selectedTab
                    } users found`}
              </Text>
            </View>
          ) : (
            filteredUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(user.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(user.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.userDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Phone: </Text>
                    {user.phone || 'N/A'}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Signup Date: </Text>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <View style={styles.actionButtons}>
                    {user.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.approveButton]}
                          onPress={() => handleApprove(user.id)}
                        >
                          <Text style={styles.approveButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => handleReject(user.id)}
                        >
                          <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {user.status === 'approved' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.blockButton]}
                        onPress={() => handleBlock(user.id)}
                      >
                        <Text style={styles.blockButtonText}>Block</Text>
                      </TouchableOpacity>
                    )}

                    {user.status === 'blocked' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleUnblock(user.id)}
                      >
                        <Text style={styles.approveButtonText}>Unblock</Text>
                      </TouchableOpacity>
                    )}

                    {user.status === 'rejected' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleApprove(user.id)}
                      >
                        <Text style={styles.approveButtonText}>Approve</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    profileSection: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark ? theme.background : '#F6EEFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      borderWidth: 2,
      borderColor: theme.accent,
    },
    avatarImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    profileDetails: {
      flex: 1,
    },
    profileName: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 2,
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    profileEmail: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginLeft: 4,
    },
    profileRole: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.accent,
      backgroundColor: isDark ? theme.background : '#F6EEFF',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    settingsButton: {
      padding: 6,
      backgroundColor: isDark ? theme.background : '#F6EEFF',
      borderRadius: 8,
    },
    profileStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },
    profileStat: {
      alignItems: 'center',
      flex: 1,
    },
    profileStatNumber: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
      marginBottom: 1,
    },
    profileStatLabel: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    searchContainer: {
      marginBottom: 16,
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 10,
      paddingVertical: 0,
    },
    tabsContainer: {
      marginBottom: 16,
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.card,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
      marginLeft: 6,
    },
    tabTextActive: {
      color: theme.buttonText,
    },
    usersList: {
      marginBottom: 16,
    },
    emptyState: {
      backgroundColor: theme.card,
      padding: 30,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
    },
    userCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    userHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    userInfo: {
      flex: 1,
      marginRight: 10,
    },
    userName: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 4,
    },

    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
      textTransform: 'uppercase',
    },
    userDetails: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
      marginBottom: 10,
    },
    detailText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginBottom: 4,
    },

    detailLabel: {
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    approveButton: {
      backgroundColor: theme.success,
    },
    rejectButton: {
      backgroundColor: theme.danger,
    },
    blockButton: {
      backgroundColor: theme.secondary,
    },
    approveButtonText: {
      fontSize: 13,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    rejectButtonText: {
      fontSize: 13,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    blockButtonText: {
      fontSize: 13,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
  });

export default AdminDashboard;
