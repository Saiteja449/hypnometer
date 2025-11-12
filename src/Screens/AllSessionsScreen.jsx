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
import { useTheme } from '../Context/ThemeContext';

const { width } = Dimensions.get('window');

const AllSessionsScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

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

    if (filter !== 'all') {
      filtered = filtered.filter(session => {
        if (filter === 'with-feedback') {
          return session.feedback !== null;
        }
        return session.status === filter;
      });
    }

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
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status, hasFeedback) => {
    if (status === 'completed') {
      return hasFeedback ? theme.success : theme.warning;
    }
    return theme.secondary;
  };

  const getStatusText = (status, hasFeedback) => {
    if (status === 'completed') {
      return hasFeedback ? 'Reviewed' : 'Awaiting Review';
    }
    return 'In Progress';
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 6,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 12,
      backgroundColor: 'transparent',
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterContent: {
      paddingHorizontal: 4,
    },
    filterTab: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: theme.card,
      borderRadius: 8,
      marginRight: 8,
      minWidth: 100,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterTabActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
      paddingHorizontal: 22,
    },
    filterTabText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
      lineHeight: 18,
    },
    filterTabTextActive: {
      color: '#FFFFFF',
    },
    resultsHeader: {
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    resultsText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    sessionCardWrapper: {
      marginBottom: 16,
      borderRadius: 16,
      padding: 1,
      backgroundColor: 'transparent',
    },
    sessionCardWrapperGlow: {
      backgroundColor: isDark ? theme.accent + '20' : theme.accent + '10',
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    sessionCard: {
      backgroundColor: theme.card,
      borderRadius: 15,
      padding: 20,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
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
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 4,
    },
    therapistName: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    sessionDetails: {
      marginBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    detailLabel: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    detailValue: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    feedbackSection: {
      backgroundColor: isDark ? '#1F2937' : '#F8FAFF',
      padding: 12,
      borderRadius: 10,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.accent,
    },
    feedbackLabel: {
      fontSize: 12,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
      marginBottom: 4,
    },
    feedbackText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      lineHeight: 20,
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
      color: theme.secondary,
    },
    progressPercentage: {
      fontSize: 14,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 14,
      color: theme.secondary,
      fontFamily: 'Nunito-Regular',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  const SearchIcon = ({ color }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path
        d="M21 21L16.65 16.65"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const PlusIcon = ({ color }) => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" stroke={color} strokeWidth="2" />
      <Path
        d="M30 40H50M40 30V50"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const renderSessionItem = ({ item }) => {
    const isCompletedAndReviewed = item.status === 'completed' && item.feedback;
    const cardGlowStyle = isCompletedAndReviewed
      ? dynamicStyles.sessionCardWrapperGlow
      : {};

    return (
      <View style={[dynamicStyles.sessionCardWrapper, cardGlowStyle]}>
        <TouchableOpacity
          style={dynamicStyles.sessionCard}
          onPress={() =>
            navigation.navigate('SessionDetail', {
              sessionId: item.id,
              sessionData: item,
            })
          }
        >
          <View style={dynamicStyles.sessionHeader}>
            <View style={dynamicStyles.sessionInfo}>
              <Text style={dynamicStyles.sessionTitle}>{item.title}</Text>
              <Text style={dynamicStyles.therapistName}>{item.therapist}</Text>
            </View>
            <View
              style={[
                dynamicStyles.statusBadge,
                {
                  backgroundColor: getStatusColor(item.status, item.feedback),
                },
              ]}
            >
              <Text style={dynamicStyles.statusText}>
                {getStatusText(item.status, item.feedback)}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.sessionDetails}>
            <View style={dynamicStyles.detailRow}>
              <Text style={dynamicStyles.detailLabel}>Date:</Text>
              <Text style={dynamicStyles.detailValue}>{item.date}</Text>
            </View>
            <View style={dynamicStyles.detailRow}>
              <Text style={dynamicStyles.detailLabel}>Duration:</Text>
              <Text style={dynamicStyles.detailValue}>{item.duration}</Text>
            </View>
            {item.rating && (
              <View style={dynamicStyles.detailRow}>
                <Text style={dynamicStyles.detailLabel}>Rating:</Text>
                <View style={dynamicStyles.ratingContainer}>
                  <Text style={dynamicStyles.ratingText}>{item.rating}/5</Text>
                  <Svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={theme.warning}
                  >
                    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </Svg>
                </View>
              </View>
            )}
          </View>

          {item.feedback && (
            <View style={dynamicStyles.feedbackSection}>
              <Text style={dynamicStyles.feedbackLabel}>
                Therapist Feedback:
              </Text>
              <Text style={dynamicStyles.feedbackText} numberOfLines={2}>
                {item.feedback}
              </Text>
            </View>
          )}

          <View style={dynamicStyles.progressSection}>
            <View style={dynamicStyles.progressHeader}>
              <Text style={dynamicStyles.progressLabel}>Progress</Text>
              <Text style={dynamicStyles.progressPercentage}>
                {item.progress}%
              </Text>
            </View>
            <View style={dynamicStyles.progressBar}>
              <View
                style={[
                  dynamicStyles.progressFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor:
                      item.progress > 70
                        ? theme.success
                        : item.progress > 40
                        ? theme.warning
                        : theme.error,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={dynamicStyles.emptyContainer}>
      <PlusIcon color={isDark ? '#4B5563' : '#E2E8F0'} />
      <Text style={dynamicStyles.emptyTitle}>No Sessions Found</Text>
      <Text style={dynamicStyles.emptyDescription}>
        {searchQuery || filter !== 'all'
          ? 'Try adjusting your search or filter criteria'
          : 'No therapy sessions available yet'}
      </Text>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        backgroundColor={theme.accent}
        barStyle={isDark ? 'light-content' : 'light-content'}
      />
      <CustomHeader
        title="All Sessions"
        onBackPress={() => navigation.goBack()}
      />

      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.searchContainer}>
          <View style={dynamicStyles.searchInput}>
            <SearchIcon color={theme.secondary} />
            <TextInput
              style={dynamicStyles.searchTextInput}
              placeholder="Search sessions, therapists, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.secondary}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.filterContainer}
          contentContainerStyle={dynamicStyles.filterContent}
        >
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'In Progress' },
            { key: 'with-feedback', label: 'With Feedback' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[
                dynamicStyles.filterTab,
                filter === tab.key && dynamicStyles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  dynamicStyles.filterTabText,
                  filter === tab.key && dynamicStyles.filterTabTextActive,
                ]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={dynamicStyles.resultsHeader}>
          <Text style={dynamicStyles.resultsText}>
            **{filteredSessions.length}** session
            {filteredSessions.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        <FlatList
          data={filteredSessions}
          renderItem={renderSessionItem}
          keyExtractor={item => `all-session-${item.id}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={dynamicStyles.listContent}
        />
      </View>
    </View>
  );
};

export default AllSessionsScreen;
