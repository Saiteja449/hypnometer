import React, { useState, useEffect } from 'react';
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
  Modal,
  Image,
} from 'react-native';

import CustomHeader from '../../Components/CustomHeader';
import { useTheme } from '../../Context/ThemeContext';
import AdminIcon from '../../Icons/AdminIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import BlockedIcon from '../../Icons/BlockedIcon';
import EmailIconAdmin from '../../Icons/EmailIconAdmin';
import PendingIcon from '../../Icons/PendingIcon';
import RejectedIcon from '../../Icons/RejectedIcon';
import SearchIcon from '../../Icons/SearchIcon';
import SettingsIcon from '../../Icons/SettingsIcon';
import UsersIcon from '../../Icons/UsersIcon';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Admin profile data
  const adminProfile = {
    name: 'Admin User',
    email: 'admin123@gmail.com',
    role: 'Platform Administrator',
    profilePhoto: null, // You can add a profile image URL here
  };

  // Mock data - In real app, this would come from your backend
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      qualification: 'Certified Hypnotherapist',
      yearsOfExperience: '5',
      specialization: ['Anxiety', 'Stress'],
      licenseNumber: 'HT123456',
      bio: 'Experienced hypnotherapist specializing in anxiety and stress management.',
      status: 'pending', // pending, approved, rejected, blocked
      signupDate: '2024-01-15',
      profilePhoto: null,
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 987-6543',
      qualification: 'Clinical Hypnotherapist',
      yearsOfExperience: '8',
      specialization: ['Weight Loss', 'Confidence'],
      licenseNumber: 'HT789012',
      bio: 'Dedicated to helping clients achieve their weight loss and confidence goals.',
      status: 'pending',
      signupDate: '2024-01-14',
      profilePhoto: null,
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 456-7890',
      qualification: 'Therapeutic Hypnotist',
      yearsOfExperience: '3',
      specialization: ['Smoking', 'Sleep'],
      licenseNumber: 'HT345678',
      bio: 'Specialized in smoking cessation and sleep disorder treatments.',
      status: 'approved',
      signupDate: '2024-01-10',
      profilePhoto: null,
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@example.com',
      phone: '+1 (555) 234-5678',
      qualification: 'Hypnosis Practitioner',
      yearsOfExperience: '6',
      specialization: ['Pain Management', 'Phobias'],
      licenseNumber: 'HT901234',
      bio: 'Focused on pain management and phobia treatment through hypnosis.',
      status: 'rejected',
      signupDate: '2024-01-12',
      profilePhoto: null,
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 345-6789',
      qualification: 'Master Hypnotherapist',
      yearsOfExperience: '12',
      specialization: ['Performance', 'Regression'],
      licenseNumber: 'HT567890',
      bio: 'Master hypnotherapist with extensive experience in performance enhancement.',
      status: 'blocked',
      signupDate: '2024-01-08',
      profilePhoto: null,
    },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedTab]);

  const loadUsers = () => {
    // Simulate API call
    setUsers(mockUsers);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(user => user.status === selectedTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.qualification.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  };

  const handleApprove = userId => {
    Alert.alert('Approve User', 'Are you sure you want to approve this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => updateUserStatus(userId, 'approved'),
      },
    ]);
  };

  const handleReject = userId => {
    Alert.alert('Reject User', 'Are you sure you want to reject this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        onPress: () => updateUserStatus(userId, 'rejected'),
      },
    ]);
  };

  const handleBlock = userId => {
    Alert.alert('Block User', 'Are you sure you want to block this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        onPress: () => updateUserStatus(userId, 'blocked'),
      },
    ]);
  };

  const handleUnblock = userId => {
    Alert.alert('Unblock User', 'Are you sure you want to unblock this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        onPress: () => updateUserStatus(userId, 'approved'),
      },
    ]);
  };

  const updateUserStatus = (userId, status) => {
    setUsers(
      users.map(user => (user.id === userId ? { ...user, status } : user)),
    );
  };

  const viewUserDetails = user => {
    setSelectedUser(user);
    setModalVisible(true);
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
        return status;
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Profile Section */}
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
                  <AdminIcon color={theme.accent} />
                )}
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{adminProfile.name}</Text>
                <View style={styles.emailContainer}>
                  <EmailIconAdmin color={theme.secondary} />
                  <Text style={styles.profileEmail}>{adminProfile.email}</Text>
                </View>
                <Text style={styles.profileRole}>{adminProfile.role}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <SettingsIcon color={theme.accent} />
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <SearchIcon color={theme.secondary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search users by name, email"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.secondary}
            />
          </View>
        </View>

        {/* Tabs */}
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
            <PendingIcon color={getStatusColor('pending')} />
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
            <ApprovedIcon color={getStatusColor('approved')} />
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
            <RejectedIcon color={getStatusColor('rejected')} />
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
            <BlockedIcon color={getStatusColor('blocked')} />
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

        {/* Users List */}
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
                    <Text style={styles.userQualification}>
                      {user.qualification}
                    </Text>
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
                    <Text style={styles.detailLabel}>Experience: </Text>
                    {user.yearsOfExperience} years
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Specializations: </Text>
                    {user.specialization.join(', ')}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>License: </Text>
                    {user.licenseNumber}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Signup Date: </Text>
                    {user.signupDate}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => viewUserDetails(user)}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>

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

                    {(user.status === 'rejected' ||
                      user.status === 'blocked') && (
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

      {/* User Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>User Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.modalUserName}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                  <Text style={styles.modalEmail}>{selectedUser.email}</Text>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>
                      Personal Information
                    </Text>
                    <Text style={styles.detailItem}>
                      Phone: {selectedUser.phone}
                    </Text>
                    <Text style={styles.detailItem}>
                      Qualification: {selectedUser.qualification}
                    </Text>
                    <Text style={styles.detailItem}>
                      Experience: {selectedUser.yearsOfExperience} years
                    </Text>
                    <Text style={styles.detailItem}>
                      License: {selectedUser.licenseNumber}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Specializations</Text>
                    <View style={styles.specializations}>
                      {selectedUser.specialization.map((spec, index) => (
                        <View key={index} style={styles.specTag}>
                          <Text style={styles.specText}>{spec}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Bio</Text>
                    <Text style={styles.bioText}>{selectedUser.bio}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <Text style={styles.detailItem}>
                      Signup Date: {selectedUser.signupDate}
                    </Text>
                    <Text style={styles.detailItem}>
                      Status:{' '}
                      <Text
                        style={{ color: getStatusColor(selectedUser.status) }}
                      >
                        {getStatusText(selectedUser.status)}
                      </Text>
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  {selectedUser.status === 'pending' && (
                    <>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalApproveButton]}
                        onPress={() => {
                          handleApprove(selectedUser.id);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalApproveButtonText}>
                          Approve
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalRejectButton]}
                        onPress={() => {
                          handleReject(selectedUser.id);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalRejectButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {selectedUser.status === 'approved' && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalBlockButton]}
                      onPress={() => {
                        handleBlock(selectedUser.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalBlockButtonText}>
                        Block User
                      </Text>
                    </TouchableOpacity>
                  )}

                  {selectedUser.status === 'blocked' && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalApproveButton]}
                      onPress={() => {
                        handleUnblock(selectedUser.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalApproveButtonText}>
                        Unblock User
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 4,
    },
    statLabel: {
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
      paddingVertical: 6,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 10,
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
      marginRight: 6,
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
      marginLeft: 4,
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
      padding: 14,
      marginBottom: 10,
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
      marginBottom: 2,
    },
    userQualification: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    statusBadge: {
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    userDetails: {
      marginBottom: 10,
    },
    detailText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginBottom: 2,
    },
    detailLabel: {
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    viewButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 6,
    },
    actionButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
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
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    rejectButtonText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    blockButtonText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 16,
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 16,
      width: '100%',
      maxHeight: '80%',
      shadowColor: isDark ? theme.cardShadow : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? theme.cardShadowOpacity : 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    closeButton: {
      fontSize: 18,
      color: theme.secondary,
      padding: 4,
    },
    modalBody: {
      padding: 20,
    },
    modalUserName: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 2,
    },
    modalEmail: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 16,
    },
    detailSection: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 6,
    },
    detailItem: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginBottom: 2,
    },
    specializations: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    specTag: {
      backgroundColor: isDark ? theme.background : '#F6EEFF',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
    },
    specText: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.accent,
    },
    bioText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      lineHeight: 20,
    },
    modalActions: {
      flexDirection: 'row',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 10,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalApproveButton: {
      backgroundColor: theme.success,
    },
    modalRejectButton: {
      backgroundColor: theme.danger,
    },
    modalBlockButton: {
      backgroundColor: theme.secondary,
    },
    modalApproveButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    modalRejectButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    modalBlockButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
  });

export default AdminDashboard;
