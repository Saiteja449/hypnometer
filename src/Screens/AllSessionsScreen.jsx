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
import SearchIcon from '../Icons/SearchIcon';
import SessionIcon from '../Icons/SessionIcon';
import StarIcon from '../Icons/StarIcon';
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
      return hasFeedback ? theme.colors.success : theme.colors.warning;
    }
    return theme.colors.secondary;
  };

  const getStatusText = (status, hasFeedback) => {
    if (status === 'completed') {
      return hasFeedback ? 'Reviewed' : 'Awaiting Review';
    }
    return 'In Progress';
  };

  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 6,
        elevation: 2,
      },
      searchTextInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
        color: theme.colors.text,
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
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 8,
        marginRight: 8,
        minWidth: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      filterTabActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
        paddingHorizontal: 22,
      },
      filterTabText: {
        fontSize: 14,
        fontFamily: 'Nunito-SemiBold',
        color: theme.colors.textSecondary,
        lineHeight: 18,
      },
      filterTabTextActive: {
        color: theme.colors.buttonText,
      },
      resultsHeader: {
        marginBottom: 16,
        paddingHorizontal: 4,
      },
      resultsText: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.colors.textSecondary,
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
        backgroundColor: isDark
          ? theme.colors.accent + '20'
          : theme.colors.accent + '10',
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isDark ? 0.4 : 0.2,
        shadowRadius: 5,
        elevation: 3,
      },
      sessionCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 15,
        padding: 20,
        shadowColor: theme.colors.shadow,
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
        color: theme.colors.text,
        marginBottom: 4,
      },
      therapistName: {
        fontSize: 14,
        fontFamily: 'Nunito-SemiBold',
        color: theme.colors.accent,
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
        color: theme.colors.buttonText,
      },
      sessionDetails: {
        marginBottom: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
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
        color: theme.colors.textSecondary,
      },
      detailValue: {
        fontSize: 14,
        fontFamily: 'Nunito-SemiBold',
        color: theme.colors.text,
      },
      ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      ratingText: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        color: theme.colors.text,
      },
      feedbackSection: {
        backgroundColor: isDark ? '#1F2937' : '#F8FAFF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.accent,
      },
      feedbackLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
        color: theme.colors.accent,
        marginBottom: 4,
      },
      feedbackText: {
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
        color: theme.colors.text,
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
        color: theme.colors.textSecondary,
      },
      progressPercentage: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        color: theme.colors.text,
      },
      progressBar: {
        height: 8,
        backgroundColor: theme.colors.border,
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
        color: theme.colors.text,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
      },
      emptyDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: 'Nunito-Regular',
        textAlign: 'center',
        lineHeight: 20,
      },
    });



  const renderSessionItem = ({ item }) => {
    const isCompletedAndReviewed = item.status === 'completed' && item.feedback;
    const cardGlowStyle = isCompletedAndReviewed
      ? styles.sessionCardWrapperGlow
      : {};

    return (
      <View style={[styles.sessionCardWrapper, cardGlowStyle]}>
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
                {
                  backgroundColor: getStatusColor(item.status, item.feedback),
                },
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
                  <StarIcon size={16} color={theme.colors.warning} />
                </View>
              </View>
            )}
          </View>

          {item.feedback && (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackLabel}>
                Therapist Feedback:
              </Text>
              <Text style={styles.feedbackText} numberOfLines={2}>
                {item.feedback}
              </Text>
            </View>
          )}

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>
                {item.progress}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor:
                      item.progress > 70
                        ? theme.colors.success
                        : item.progress > 40
                        ? theme.colors.warning
                        : theme.colors.error,
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
    <View style={styles.emptyContainer}>
      <SessionIcon color={isDark ? '#4B5563' : '#E2E8F0'} />
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
      <StatusBar
        backgroundColor={theme.colors.accent}
        barStyle={isDark ? 'light-content' : 'light-content'}
      />
      <CustomHeader
        title="All Sessions"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <SearchIcon color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search sessions, therapists, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
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
              onPress={() => setFilter(tab.key)}
              style={[
                styles.filterTab,
                filter === tab.key && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tab.key && styles.filterTabTextActive,
                ]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
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
              tintColor={theme.colors.accent}
              colors={[theme.colors.accent]}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

export default AllSessionsScreen;
