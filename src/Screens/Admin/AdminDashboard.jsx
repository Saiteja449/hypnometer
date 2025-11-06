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
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import CustomHeader from '../../Components/CustomHeader';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
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
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      case 'blocked':
        return '#6B7280';
      default:
        return '#6B7280';
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

  // SVG Icons
  const UsersIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const PendingIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" />
      <Path
        d="M12 6V12L16 14"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ApprovedIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" />
      <Path
        d="M8 12L11 15L16 9"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const RejectedIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
      <Path
        d="M15 9L9 15"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9L15 15"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const BlockedIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2" />
      <Path
        d="M18 6L6 18"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const SearchIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
      <Path
        d="M21 21L16.65 16.65"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const AdminIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M2.905 18.249C3.827 16.653 5.153 15.327 6.749 14.405C8.345 13.483 10.147 13 12 13C13.853 13 15.655 13.483 17.251 14.405C18.847 15.327 20.173 16.653 21.095 18.249"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="9" r="1" fill="#8641f4" />
      <Path
        d="M12 12V13"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const EmailIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="#6B7280"
        strokeWidth="2"
      />
      <Path
        d="M2 6L12 13L22 6"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const SettingsIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.4 15C19.2662 15.3052 19.1948 15.6352 19.1905 15.9696C19.1862 16.304 19.2491 16.6354 19.3746 16.9442C19.5001 17.253 19.6854 17.5325 19.9188 17.7659C20.1522 17.9993 20.4317 18.1846 20.7405 18.3101C21.0493 18.4356 21.3807 18.4985 21.7151 18.4942C22.0495 18.4899 22.3795 18.4185 22.6847 18.2847L21.2847 16.8847C21.1052 16.7052 21.0049 16.4609 21.0049 16.2059C21.0049 15.9508 21.1052 15.7065 21.2847 15.527C21.4642 15.3475 21.7085 15.2472 21.9636 15.2472C22.2186 15.2472 22.4629 15.3475 22.6424 15.527L24.0424 16.927C24.1762 16.6218 24.2476 16.2918 24.2519 15.9574C24.2562 15.623 24.1933 15.2916 24.0678 14.9828C23.9423 14.674 23.757 14.3945 23.5236 14.1611C23.2902 13.9277 23.0107 13.7424 22.7019 13.6169C22.3931 13.4914 22.0617 13.4285 21.7273 13.4328C21.3929 13.4371 21.0629 13.5085 20.7577 13.6423L19.3577 12.2423C19.1782 12.0628 19.0779 11.8185 19.0779 11.5634C19.0779 11.3084 19.1782 11.0641 19.3577 10.8846C19.5372 10.7051 19.7815 10.6048 20.0366 10.6048C20.2916 10.6048 20.5359 10.7051 20.7154 10.8846L22.1154 12.2846C22.4206 12.1508 22.7506 12.0794 23.085 12.0751C23.4194 12.0708 23.7508 12.1337 24.0596 12.2592C24.3684 12.3847 24.6479 12.57 24.8813 12.8034C25.1147 13.0368 25.3 13.3163 25.4255 13.6251C25.551 13.9339 25.6139 14.2653 25.6096 14.5997C25.6053 14.9341 25.5339 15.2641 25.4001 15.5693L26.8001 16.9693C26.9796 17.1488 27.0799 17.3931 27.0799 17.6482C27.0799 17.9032 26.9796 18.1475 26.8001 18.327C26.6206 18.5065 26.3763 18.6068 26.1212 18.6068C25.8662 18.6068 25.6219 18.5065 25.4424 18.327L24.0424 16.927"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

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
                  <AdminIcon />
                )}
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{adminProfile.name}</Text>
                <View style={styles.emailContainer}>
                  <EmailIcon />
                  <Text style={styles.profileEmail}>{adminProfile.email}</Text>
                </View>
                <Text style={styles.profileRole}>{adminProfile.role}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <SettingsIcon />
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
            <SearchIcon />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search users by name, email"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
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
            <PendingIcon />
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
            <ApprovedIcon />
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
            <RejectedIcon />
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
            <BlockedIcon />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Profile Section Styles
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    backgroundColor: '#F6EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#8641f4',
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
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  profileRole: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#8641f4',
    backgroundColor: '#F6EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#F6EEFF',
    borderRadius: 8,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
    marginBottom: 2,
  },
  profileStatLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  // Existing styles remain the same...
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#8641f4',
    borderColor: '#8641f4',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  usersList: {
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  userQualification: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#8641f4',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  userDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    marginBottom: 4,
  },
  detailLabel: {
    fontFamily: 'Nunito-SemiBold',
    color: '#1F2937',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#8641f4',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  blockButton: {
    backgroundColor: '#6B7280',
  },
  approveButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  rejectButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  blockButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 20,
    color: '#6B7280',
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalUserName: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalEmail: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    marginBottom: 4,
  },
  specializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specTag: {
    backgroundColor: '#F6EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specText: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#8641f4',
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalApproveButton: {
    backgroundColor: '#10B981',
  },
  modalRejectButton: {
    backgroundColor: '#EF4444',
  },
  modalBlockButton: {
    backgroundColor: '#6B7280',
  },
  modalApproveButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  modalRejectButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  modalBlockButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
});

export default AdminDashboard;
