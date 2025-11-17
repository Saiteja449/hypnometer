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
  Modal,
  Animated,
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
  const { allUsers, fetchAllUsers, user, updateUserStatus } = useApp();
  const styles = getStyles(theme, isDark);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    actionType: '', // 'approve', 'reject', 'block', 'unblock'
    targetUserId: null,
  });

  const [processingModal, setProcessingModal] = useState({
    visible: false,
    text: 'Processing...',
  });

  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Animation for dots
  const dotAnimation = new Animated.Value(0);

  console.log('user', user);
  const adminProfile = {
    name: `${user?.first_name} ${user?.last_name}`,
    email: user?.email,
    role: 'Platform Administrator',
    profilePhoto: null,
  };

  // Start dot animation
  const startDotAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [dotAnimation]);

  // Stop dot animation
  const stopDotAnimation = useCallback(() => {
    dotAnimation.stopAnimation();
    dotAnimation.setValue(0);
  }, [dotAnimation]);

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
      status:
        user.status === null || user.status === '' ? 'Pending' : user.status,
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

  const showConfirmationModal = (
    title,
    message,
    actionType,
    targetUserId,
    onConfirm,
  ) => {
    setConfirmationModal({
      visible: true,
      title,
      message,
      onConfirm,
      actionType,
      targetUserId,
    });
  };

  const hideConfirmationModal = () => {
    setConfirmationModal({
      visible: false,
      title: '',
      message: '',
      onConfirm: null,
      actionType: '',
      targetUserId: null,
    });
  };

  const showProcessingModal = (text = 'Processing...') => {
    setProcessingModal({
      visible: true,
      text,
    });
    startDotAnimation();
  };

  const hideProcessingModal = () => {
    setProcessingModal({
      visible: false,
      text: 'Processing...',
    });
    stopDotAnimation();
  };

  const showSuccessModal = (title, message) => {
    setSuccessModal({
      visible: true,
      title,
      message,
    });
  };

  const hideSuccessModal = () => {
    setSuccessModal({
      visible: false,
      title: '',
      message: '',
    });
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    showProcessingModal(`Updating user status to ${newStatus}...`);
    try {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
        // Update local state with normalized status
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, status: newStatus.toLowerCase() }
              : user,
          ),
        );
        await loadUsers();
        hideProcessingModal();
        showSuccessModal(
          'Success',
          `User status updated to ${newStatus} successfully!`,
        );
      }
    } catch (error) {
      console.error(
        'Failed to update user status:',
        error.response?.data || error.message,
      );
      hideProcessingModal();
      Alert.alert('Error', 'Failed to update user status. Please try again.');
    }
  };

  const handleApprove = userId => {
    showConfirmationModal(
      'Approve User',
      'Are you sure you want to approve this user?',
      'approve',
      userId,
      () => handleUpdateStatus(userId, 'Approved'),
    );
  };

  const handleReject = userId => {
    showConfirmationModal(
      'Reject User',
      'Are you sure you want to reject this user?',
      'reject',
      userId,
      () => handleUpdateStatus(userId, 'Rejected'),
    );
  };

  const handleBlock = userId => {
    showConfirmationModal(
      'Block User',
      'Are you sure you want to block this user?',
      'block',
      userId,
      () => handleUpdateStatus(userId, 'Blocked'),
    );
  };

  const handleUnblock = userId => {
    showConfirmationModal(
      'Unblock User',
      'Are you sure you want to unblock this user?',
      'unblock',
      userId,
      () => handleUpdateStatus(userId, 'Approved'),
    );
  };

  const getActionButtonStyle = actionType => {
    switch (actionType) {
      case 'approve':
        return [styles.confirmButton, { backgroundColor: theme.success }];
      case 'reject':
        return [styles.confirmButton, { backgroundColor: theme.danger }];
      case 'block':
        return [styles.confirmButton, { backgroundColor: theme.secondary }];
      case 'unblock':
        return [styles.confirmButton, { backgroundColor: theme.success }];
      default:
        return [styles.confirmButton, { backgroundColor: theme.accent }];
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return theme.success;
      case 'Pending':
        return theme.warning;
      case 'Rejected':
        return theme.danger;
      case 'Blocked':
        return theme.secondary;
      default:
        return theme.secondary;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'Approved':
        return 'Approved';
      case 'Pending':
        return 'Pending Review';
      case 'Rejected':
        return 'Rejected';
      case 'Blocked':
        return 'Blocked';
      default:
        return 'N/A';
    }
  };

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === 'Pending').length,
    approved: users.filter(u => u.status === 'Approved').length,
    rejected: users.filter(u => u.status === 'Rejected').length,
    blocked: users.filter(u => u.status === 'Blocked').length,
  };

  // Animated dots for processing modal
  const renderAnimatedDots = () => {
    const dot1Opacity = dotAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    });

    const dot2Opacity = dotAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.3, 1],
    });

    const dot3Opacity = dotAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.3, 0.3],
    });

    return (
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    );
  };

  // Function to render action buttons based on user status
  const renderActionButtons = user => {
    switch (user.status) {
      case 'Pending':
        return (
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
        );

      case 'Approved':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.blockButton]}
            onPress={() => handleBlock(user.id)}
          >
            <Text style={styles.blockButtonText}>Block</Text>
          </TouchableOpacity>
        );

      case 'Blocked':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleUnblock(user.id)}
          >
            <Text style={styles.approveButtonText}>Unblock</Text>
          </TouchableOpacity>
        );

      case 'Rejected':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(user.id)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
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
        {/* Profile Section */}
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

        {/* Search Section */}
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

        {/* Tabs Section */}
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
            style={[styles.tab, selectedTab === 'Pending' && styles.tabActive]}
            onPress={() => setSelectedTab('Pending')}
          >
            <PendingIcon
              color={
                selectedTab === 'Pending'
                  ? theme.buttonText
                  : getStatusColor('Pending')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Pending' && styles.tabTextActive,
              ]}
            >
              Pending ({stats.pending})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Approved' && styles.tabActive]}
            onPress={() => setSelectedTab('Approved')}
          >
            <ApprovedIcon
              color={
                selectedTab === 'Approved'
                  ? theme.buttonText
                  : getStatusColor('Approved')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Approved' && styles.tabTextActive,
              ]}
            >
              Approved ({stats.approved})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Rejected' && styles.tabActive]}
            onPress={() => setSelectedTab('Rejected')}
          >
            <RejectedIcon
              color={
                selectedTab === 'Rejected'
                  ? theme.buttonText
                  : getStatusColor('Rejected')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Rejected' && styles.tabTextActive,
              ]}
            >
              Rejected ({stats.rejected})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Blocked' && styles.tabActive]}
            onPress={() => setSelectedTab('Blocked')}
          >
            <BlockedIcon
              color={
                selectedTab === 'Blocked'
                  ? theme.buttonText
                  : getStatusColor('Blocked')
              }
              size={16}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Blocked' && styles.tabTextActive,
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
                    {renderActionButtons(user)}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideConfirmationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>{confirmationModal.title}</Text>
            <Text style={styles.modalMessage}>{confirmationModal.message}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={hideConfirmationModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getActionButtonStyle(confirmationModal.actionType)}
                onPress={() => {
                  hideConfirmationModal();
                  if (confirmationModal.onConfirm) {
                    confirmationModal.onConfirm();
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>
                  {confirmationModal.actionType === 'approve' && 'Approve'}
                  {confirmationModal.actionType === 'reject' && 'Reject'}
                  {confirmationModal.actionType === 'block' && 'Block'}
                  {confirmationModal.actionType === 'unblock' && 'Unblock'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Processing Modal */}
      <Modal
        visible={processingModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideProcessingModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.processingModal}>
            <Text style={styles.processingText}>{processingModal.text}</Text>
            {renderAnimatedDots()}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <ApprovedIcon color={theme.success} size={40} />
            </View>
            <Text style={styles.successModalTitle}>{successModal.title}</Text>
            <Text style={styles.successModalMessage}>
              {successModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.successButton]}
              onPress={hideSuccessModal}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
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
      paddingVertical: 12,
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
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    confirmationModal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    processingModal: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
      height: 150,
    },
    successModal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 350,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    successIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark ? theme.background : '#F0F9F0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    successModalTitle: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.success,
      marginBottom: 12,
      textAlign: 'center',
    },
    successModalMessage: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: isDark ? theme.background : '#F0F0F0',
      borderWidth: 1,
      borderColor: theme.border,
      flex: 1,
    },
    confirmButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
    },
    successButton: {
      backgroundColor: theme.success,
      paddingHorizontal: 40,
      paddingVertical: 14,
      borderRadius: 12,
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
    },
    confirmButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    successButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.buttonText,
    },
    processingText: {
      fontSize: 18,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accent,
      marginHorizontal: 4,
    },
  });

export default AdminDashboard;
