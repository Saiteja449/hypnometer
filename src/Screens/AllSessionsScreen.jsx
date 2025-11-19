import React, { useState, useMemo, useEffect } from 'react';
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
import { Share } from 'react-native';
import SearchIcon from '../Icons/SearchIcon';
import StarIcon from '../Icons/StarIcon';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import CalendarIcon from '../Icons/CalendarIcon';
import UserIcon from '../Icons/UserIcon';
import SessionIcon from '../Icons/SessionIcon';
// import ChevronRight from '../Icons/ChevronRight'; // Assuming you have a ChevronRight icon or similar

const { width } = Dimensions.get('window');

// Mock data remains the same but will be replaced by 'allSessions' in use
const ALL_SESSIONS_MOCK_DATA = [
  // ... (Your mock data remains here for reference, but the screen uses contextSessions)
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

const AllSessionsScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  // Using contextSessions for live data, falling back to an empty array
  const { sessions: contextSessions, getSessions, userId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      getSessions(userId);
    }
  }, [userId, getSessions]);

  // --- Data Normalization (kept for context/status logic) ---
  const normalizeSessions = sessions => {
    return sessions.map(session => {
      const sessionDateTime = new Date(session.session_datetime);
      const feedbackExpiresAt = new Date(session.feedback_expires_at);
      const now = new Date();
      const hoursSinceSession = (now - sessionDateTime) / (1000 * 60 * 60);
      const isWithinFeedbackWindow = feedbackExpiresAt > now; // still within 24h feedback window
      // Status logic: keep session as 'pending_feedback' (active) until feedback expiry
      let status = 'completed';
      if (isWithinFeedbackWindow) {
        // Show as active/pending while feedback window is open, even if reviewed
        status = 'pending_feedback';
      } else if (session.average_rating) {
        status = 'completed';
      } else if (!session.average_rating && hoursSinceSession > 24) {
        status = 'completed_no_feedback'; // Completed but no rating after window
      } else {
        status = 'pending_other';
      }

      return {
        id: session.id,
        title: session.title,
        sessionType: session.session_type || 'General Session',
        date:
          session.session_datetime?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        dateTime: session.session_datetime,
        duration: '-- mins', // This field isn't consistently populated, keeping placeholder
        status: status,
        rating: session.average_rating || 0,
        feedback: null, // Simplified
        notes: session.notes || session.metaphor_theme || '',
        progress: session.average_rating
          ? Math.round(session.average_rating * 20)
          : 0,
        session_type: session.session_type,
        feedback_link: session.feedback_link,
        metaphor_theme: session.metaphor_theme,
        hoursSinceSession,
        feedback_expires_at: session.feedback_expires_at,
        isFeedbackActive: isWithinFeedbackWindow,
      };
    });
  };

  const allSessions = normalizeSessions(contextSessions || []);
  // --- End Data Normalization ---

  const filteredSessions = useMemo(() => {
    let filtered = allSessions;

    if (filter !== 'all') {
      filtered = filtered.filter(session => {
        if (filter === 'done') {
          return session.status.includes('completed');
        }
        if (filter === 'active') {
          return session.status.includes('pending');
        }
        // Add more specific filter logic if needed
        return true;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        session =>
          session.title.toLowerCase().includes(query) ||
          session.notes.toLowerCase().includes(query) ||
          session.sessionType.toLowerCase().includes(query), // Added sessionType search
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  }, [allSessions, filter, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (userId) {
        await getSessions(userId);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // --- Style Helpers (Kept for consistency, adjusted logic slightly) ---

  const getStatusDisplay = (status, rating) => {
    // Simplified statuses: show 'Active' when within feedback window, otherwise 'Completed'
    if (status === 'pending_feedback') {
      return { text: 'Active', color: '#7C3AED', background: '#F3E8FF' }; // Purple for active
    }
    // For any completed-like status show 'Completed'
    return { text: 'Completed', color: '#10B981', background: '#D1FAE5' }; // Green for completed
  };

  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      content: {
        flex: 1,
        paddingHorizontal: 16, // Use horizontal padding only for content
      },
      // ... (Search Container and Filter Container styles - kept simple)
      searchContainer: {
        marginBottom: 16,
        paddingTop: 16,
      },
      searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 32,
        paddingHorizontal: 16,
        paddingVertical: 6,
      },
      searchTextInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
        color: theme.primary,
        marginLeft: 12,
        backgroundColor: 'transparent',
      },

      filterContent: {
        paddingHorizontal: 0,
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 18,
        gap: 6,
        backgroundColor: isDark ? '#111827' : '#F3F4F6',
      },
      filterTab: {
        backgroundColor: theme.card,
        borderColor: theme.border,
        flex: 1,
        paddingVertical: 8,
        gap: 8,
        borderWidth: 1,
        borderRadius: 18,
      },
      filterTabActive: {
        backgroundColor: theme.accent,
        borderColor: theme.accent,
      },
      filterTabText: {
        fontSize: 14,
        fontFamily: 'Nunito-SemiBold',
        color: theme.secondary,
        textAlign: 'center',
      },
      filterTabTextActive: {
        color: '#FFFFFF',
        fontFamily: 'Nunito-Bold',
      },
      resultsHeader: {
        marginBottom: 14,
        paddingHorizontal: 4,
      },
      resultsText: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        color: theme.secondary,
      },
      listContent: {
        flexGrow: 1,
        paddingBottom: 20,
      },
      // --- NEW/UPDATED CARD STYLES ---
      sessionCard: {
        backgroundColor: theme.card,
        borderRadius: 12, // Slightly smaller radius for modern feel
        padding: 18,
        marginBottom: 16,
        shadowColor: isDark ? theme.primary : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.2 : 0.08,
        shadowRadius: 6,
        elevation: 4,
        borderLeftWidth: 4, // Subtle colored border on the left
        borderColor: theme.border,
      },
      sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      },
      titleContainer: {
        flex: 1,
        marginRight: 10,
      },
      sessionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 4,
      },

      statusBadge: {
        // NEW subtle badge style
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      statusText: {
        fontSize: 12,
        fontFamily: 'Nunito-SemiBold',
      },
      // Horizontal Stats Row
      statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: isDark ? '#1a1f2e' : '#f7f9fb', // Lighter accent background
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: theme.border,
      },
      statItem: {
        flex: 1,
        alignItems: 'center',
      },
      statLabel: {
        fontSize: 11,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
      },
      statValue: {
        fontSize: 15,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      statDivider: {
        width: 1,
        height: 30,
        backgroundColor: theme.border,
      },
      // Feedback Link
      feedbackLinkSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#1e293b' : '#eff6ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#dbeafe',
      },
      feedbackLinkContent: {
        flex: 1,
        marginLeft: 10,
      },
      feedbackLinkLabel: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        color: theme.accent,
        marginBottom: 2,
      },
      feedbackLinkExpiry: {
        fontSize: 12,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
      },
      // Notes Section
      notesSection: {
        marginTop: 10,
        backgroundColor: isDark ? '#1a1f2e' : '#f0f7ff',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#A78BFA', // A gentle purple accent
      },
      notesLabel: {
        fontSize: 11,
        fontFamily: 'Nunito-Bold',
        color: '#A78BFA',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      notesText: {
        fontSize: 13,
        fontFamily: 'Nunito-Regular',
        color: theme.primary,
        lineHeight: 20,
      },
      emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 16,
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
        lineHeight: 22,
      },
    });

  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  // --- Session Card Renderer (Completely Rewritten Layout) ---
  const renderSessionItem = ({ item }) => {
    const {
      text: statusText,
      color: statusColor,
      background: statusBg,
    } = getStatusDisplay(item.status, item.rating);
    const cardBorderColor =
      item.rating > 0
        ? '#F59E0B'
        : item.status === 'pending_feedback'
        ? '#7C3AED'
        : theme.border;

    return (
      <TouchableOpacity
        style={[styles.sessionCard, { borderLeftColor: cardBorderColor }]}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('SessionScreen', {
            sessionId: item.id,
            title: item.title,
          })
        }
      >
        {/* Session Title, Therapist, and Status */}
        <View style={styles.sessionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusBg,
                borderWidth: 1,
                borderColor: statusColor,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>

        {/* Horizontal Stats Row (Date, Rating, Progress) */}
        <View style={styles.statsRow}>
          {/* Date */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Date</Text>
            <View style={styles.statValue}>
              <Text style={styles.statValue}>{item.date}</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          {/* Rating */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rating</Text>
            <View style={styles.statValue}>
              {item.rating > 0 ? (
                <>
                  <StarIcon size={14} color="#F59E0B" />
                  <Text style={styles.statValue}>{item.rating.toFixed(1)}</Text>
                </>
              ) : (
                <Text style={[styles.statValue, { color: theme.secondary }]}>
                  --
                </Text>
              )}
            </View>
          </View>
          <View style={styles.statDivider} />
          {/* Progress (using rating as proxy) */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    item.progress > 70
                      ? '#10B981'
                      : item.progress > 40
                      ? '#F59E0B'
                      : '#EF4444',
                },
              ]}
            >
              {item.progress}%
            </Text>
          </View>
        </View>

        {/* Feedback Link CTA - Prominent for active/pending feedback sessions */}
        {item.status === 'pending_feedback' && item.feedback_link && (
          <TouchableOpacity
            style={styles.feedbackLinkSection}
            onPress={() => {
              Share.share({
                message: `${item.title} — Share this session link:\n\n${item.feedback_link}`,
                url: item.feedback_link,
                title: `Session link: ${item.title}`,
              }).catch(err => console.log('Error sharing:', err));
            }}
            activeOpacity={0.8}
          >
            <SessionIcon size={24} color={theme.accent} />
            <View style={styles.feedbackLinkContent}>
              <Text style={styles.feedbackLinkLabel}>Share session link</Text>
              <Text style={styles.feedbackLinkExpiry}>
                Link expires in {Math.ceil(24 - item.hoursSinceSession)} hours.
              </Text>
            </View>
            {/* <ChevronRight size={20} color={theme.accent} /> */}
          </TouchableOpacity>
        )}

        {/* Notes removed per request (Key Note not shown) */}
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <SessionIcon color={isDark ? '#4B5563' : '#E2E8F0'} size={48} />
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
      <CustomHeader
        title="Session History"
        onBackPress={() => navigation.goBack()}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <SearchIcon color={theme.secondary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search sessions, therapists, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.secondary}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContent}>
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'done', label: 'Completed' },
            { key: 'active', label: 'Active/Pending' },
            // Removed 'with-feedback' as the main two filters cover most use cases
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[
                styles.filterTab,
                filter === tab.key && styles.filterTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tab.key && styles.filterTabTextActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
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
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

export default AllSessionsScreen;
