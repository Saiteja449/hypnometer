import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import CustomHeader from '../Components/CustomHeader';

const { width } = Dimensions.get('window');

const AllSessionsScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed', 'with-feedback'
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in real app, this would come from your backend or route params
  const allSessions = [
    {
      id: '1',
      title: 'Anxiety Management Session',
      therapist: 'Dr. Sarah Wilson',
      date: '2024-01-15',
      duration: '45 mins',
      status: 'completed',
      rating: 4.5,
      feedback:
        'Great progress shown in managing anxiety triggers. Client demonstrated improved coping mechanisms.',
      notes: 'Focused on breathing techniques and cognitive restructuring.',
      progress: 85,
    },
    {
      id: '2',
      title: 'Stress Relief Therapy',
      therapist: 'Dr. Mike Johnson',
      date: '2024-01-12',
      duration: '60 mins',
      status: 'completed',
      rating: 5,
      feedback:
        'Excellent session. Client showed remarkable improvement in stress management.',
      notes: 'Introduced progressive muscle relaxation techniques.',
      progress: 90,
    },
    {
      id: '3',
      title: 'Sleep Disorder Consultation',
      therapist: 'Dr. Emily Chen',
      date: '2024-01-10',
      duration: '30 mins',
      status: 'pending',
      rating: null,
      feedback: null,
      notes: 'Initial assessment completed. Waiting for client feedback.',
      progress: 60,
    },
    {
      id: '4',
      title: 'Confidence Building',
      therapist: 'Dr. David Brown',
      date: '2024-01-08',
      duration: '50 mins',
      status: 'completed',
      rating: 4,
      feedback:
        'Good progress in self-confidence. More work needed on public speaking anxiety.',
      notes: 'Role-playing exercises for social situations.',
      progress: 75,
    },
    {
      id: '5',
      title: 'Pain Management Session',
      therapist: 'Dr. Sarah Wilson',
      date: '2024-01-05',
      duration: '45 mins',
      status: 'completed',
      rating: 4.8,
      feedback:
        'Significant reduction in reported pain levels. Client responding well to techniques.',
      notes: 'Focused on visualization and mindfulness.',
      progress: 88,
    },
    {
      id: '6',
      title: 'Phobia Treatment',
      therapist: 'Dr. Mike Johnson',
      date: '2024-01-03',
      duration: '55 mins',
      status: 'pending',
      rating: null,
      feedback: null,
      notes: 'Systematic desensitization in progress.',
      progress: 45,
    },
  ];

  const filteredSessions = useMemo(() => {
    let filtered = allSessions;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(session => {
        if (filter === 'with-feedback') {
          return session.feedback !== null;
        }
        return session.status === filter;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        session =>
          session.title.toLowerCase().includes(query) ||
          session.therapist.toLowerCase().includes(query) ||
          session.notes.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [allSessions, filter, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status, hasFeedback) => {
    if (status === 'completed') {
      return hasFeedback ? '#10B981' : '#F59E0B';
    }
    return '#6B7280';
  };

  const getStatusText = (status, hasFeedback) => {
    if (status === 'completed') {
      return hasFeedback ? 'Reviewed' : 'Awaiting Review';
    }
    return 'In Progress';
  };

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() =>
        navigation.navigate('SessionDetail', {
          sessionId: item.id,
          sessionData: item,
        })
      }
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.therapistName}>{item.therapist}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status, item.feedback) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(item.status, item.feedback)}
          </Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
        {item.rating && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rating:</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}/5</Text>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </Svg>
            </View>
          </View>
        )}
      </View>

      {item.feedback && (
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>Therapist Feedback:</Text>
          <Text style={styles.feedbackText} numberOfLines={2}>
            {item.feedback}
          </Text>
        </View>
      )}

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercentage}>{item.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%`,
                backgroundColor:
                  item.progress > 70
                    ? '#10B981'
                    : item.progress > 40
                    ? '#F59E0B'
                    : '#EF4444',
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="40" r="38" stroke="#E2E8F0" strokeWidth="2" />
        <Path
          d="M30 40H50M40 30V50"
          stroke="#E2E8F0"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.emptyTitle}>No Sessions Found</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery || filter !== 'all'
          ? 'Try adjusting your search or filter criteria'
          : 'No therapy sessions available yet'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8641f4" barStyle="light-content" />
      <CustomHeader
        title="All Sessions"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
              <Path
                d="M21 21L16.65 16.65"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search sessions, therapists, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'In Progress' },
            { key: 'with-feedback', label: 'With Feedback' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                filter === tab.key && styles.filterTabActive,
              ]}
              onPress={() => setFilter(tab.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sessions Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredSessions.length} session
            {filteredSessions.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Sessions List */}
        <FlatList
          data={filteredSessions}
          renderItem={renderSessionItem}
          keyExtractor={item => `all-session-${item.id}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#8641f4',
    borderColor: '#8641f4',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  therapistName: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
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
  sessionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#1F2937',
  },
  feedbackSection: {
    backgroundColor: '#F8FAFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8641f4',
  },
  feedbackLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#8641f4',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    lineHeight: 18,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AllSessionsScreen;
