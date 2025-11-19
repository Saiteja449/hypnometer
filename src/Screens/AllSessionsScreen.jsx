import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  RefreshControl,
  Share,
} from 'react-native';
// Assuming these imports are correct based on the original code
import SearchIcon from '../Icons/SearchIcon';
import StarIcon from '../Icons/StarIcon';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import SessionIcon from '../Icons/SessionIcon';
import RightArrowIcon from '../Icons/RightArrowIcon';

const { width } = Dimensions.get('window');

const AllSessionsScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { sessions: contextSessions, getSessions, userId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      getSessions(userId);
    }
  }, [userId, getSessions]);

  // --- Data Normalization (Kept robust logic from original) ---
  const normalizeSessions = sessions => {
    return sessions
      .filter(session => session.session_datetime) // Filter out sessions without a date
      .map(session => {
        const sessionDateTime = new Date(session.session_datetime);
        const feedbackExpiresAt = new Date(session.feedback_expires_at);
        const now = new Date();
        const hoursSinceSession = (now - sessionDateTime) / (1000 * 60 * 60);
        const isWithinFeedbackWindow = feedbackExpiresAt > now;

        let status = 'completed';
        let statusDisplay = 'Completed';

        if (isWithinFeedbackWindow) {
          status = 'pending_feedback';
          statusDisplay = 'Active';
        } else if (session.average_rating) {
          status = 'completed_rated';
          statusDisplay = 'Reviewed';
        } else if (!session.average_rating && hoursSinceSession > 24) {
          status = 'completed_no_feedback';
          statusDisplay = 'Completed';
        }

        return {
          id: session.id,
          title: session.title,
          sessionType: session.session_type || 'General Session',
          date: sessionDateTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
          }),
          dateTime: session.session_datetime,
          duration: '-- mins',
          status: status,
          statusDisplay: statusDisplay,
          rating: session.average_rating || 0,
          notes: session.notes || session.metaphor_theme || '',
          // Use rating * 20 for a 0-100% proxy
          progress: session.average_rating
            ? Math.round(session.average_rating * 20)
            : 0,
          feedback_link: session.feedback_link,
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

    // Filter Logic
    if (filter !== 'all') {
      filtered = filtered.filter(session => {
        if (filter === 'done') {
          return session.status.includes('completed');
        }
        if (filter === 'active') {
          return session.status.includes('pending');
        }
        return true;
      });
    }

    // Search Logic
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        session =>
          session.title.toLowerCase().includes(query) ||
          session.notes.toLowerCase().includes(query) ||
          session.sessionType.toLowerCase().includes(query),
      );
    }

    // Sort by date descending (most recent first)
    return filtered.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
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

  // --- Style Helpers ---

  const getStatusColorConfig = (status, rating) => {
    if (status === 'pending_feedback') {
      return {
        text: 'Active',
        textColor: '#7C3AED',
        background: isDark ? '#2E1065' : '#F3E8FF',
        cardBorder: '#7C3AED',
      }; // Purple for active/feedback
    }
    if (status === 'completed_rated' && rating >= 4) {
      return {
        text: 'Reviewed',
        textColor: '#F59E0B',
        background: isDark ? '#451A03' : '#FFFBEB',
        cardBorder: '#F59E0B',
      }; // Gold for rated
    }
    // Completed or Completed/No Feedback
    return {
      text: 'Completed',
      textColor: '#10B981',
      background: isDark ? '#065F46' : '#D1FAE5',
      cardBorder: isDark ? '#1F2937' : '#E5E7EB',
    }; // Green/Grey for completed
  };

  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      content: {
        flex: 1,
        paddingHorizontal: 16,
      },
      // Search Bar
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
        borderRadius: 50, // Fully rounded (pill shape)
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      },
      searchTextInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
        color: theme.primary,
        marginLeft: 10,
        backgroundColor: 'transparent',
      },

      // Segmented Filters
      filterContent: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: isDark ? '#1F2937' : '#E5E7EB', // Segmented control background
        padding: 3,
        overflow: 'hidden',
      },
      filterTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      filterTabActive: {
        backgroundColor: theme.card, // Highlight with card color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      filterTabText: {
        fontSize: 14,
        fontFamily: 'Nunito-SemiBold',
        color: theme.secondary,
        textAlign: 'center',
      },
      filterTabTextActive: {
        color: theme.primary,
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
        paddingBottom: 40,
      },

      // --- NEW/UPDATED CARD STYLES ---
      sessionCard: {
        backgroundColor: theme.card,
        borderRadius: 16, // More rounded for modern touch
        padding: 0, // Padding moved inside sub-elements
        marginBottom: 16,
        // Stronger shadow effect for depth
        shadowColor: isDark ? theme.primary : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.2 : 0.08,
        shadowRadius: 8,
        elevation: 6,
        borderLeftWidth: 5, // Prominent left border
        overflow: 'hidden',
      },
      cardInnerPadding: {
        padding: 18,
      },
      sessionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      titleContainer: {
        flex: 1,
        marginRight: 10,
      },
      sessionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        lineHeight: 22,
      },
      sessionType: {
        fontSize: 13,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        marginTop: 2,
      },
      statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
      },
      statusText: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
      },
      statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: isDark ? '#1F2937' : '#F9FAFB', // Subtle separation background
        borderRadius: 10,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.border,
      },
      statItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 5,
      },
      statLabel: {
        fontSize: 10,
        fontFamily: 'Nunito-SemiBold',
        color: theme.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
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
        height: 35,
        backgroundColor: theme.border,
      },

      feedbackLinkSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#1E3A8A' : '#DBEAFE', // Strong blue background
        padding: 15,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      },
      feedbackLinkContent: {
        flex: 1,
        marginLeft: 10,
      },
      feedbackLinkLabel: {
        fontSize: 15,
        fontFamily: 'Nunito-Bold',
        color: isDark ? '#BFDBFE' : '#1E40AF',
        marginBottom: 2,
      },
      feedbackLinkExpiry: {
        fontSize: 12,
        fontFamily: 'Nunito-Medium',
        color: isDark ? '#93C5FD' : '#3B82F6',
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

  const renderSessionItem = ({ item }) => {
    const {
      text: statusText,
      textColor: statusColor,
      background: statusBg,
      cardBorder,
    } = getStatusColorConfig(item.status, item.rating);

    const expiryDate = new Date(item.feedback_expires_at);
    const msRemaining = expiryDate - new Date();
    const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));
    const expiryText =
      hoursRemaining > 0
        ? `Link expires in ${hoursRemaining} hours`
        : 'Feedback window closed';

    return (
      <View
        style={[
          styles.sessionCard,
          { borderLeftColor: cardBorder, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={styles.cardInnerPadding}
          onPress={() =>
            navigation.navigate('SessionDetailScreen', {
              sessionId: item.id,
              title: item.title,
            })
          }
          activeOpacity={0.9}
        >
          <View style={styles.sessionHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.sessionTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.sessionType}>{item.sessionType}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusBg,
                  borderColor: statusColor,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Date */}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Date</Text>
              <Text style={styles.statValue}>{item.date}</Text>
            </View>
            <View style={styles.statDivider} />

            {/* Rating */}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.statValue}>
                {item.rating > 0 ? (
                  <>
                    <StarIcon size={14} color="#F59E0B" />
                    <Text style={styles.statValue}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.statValue, { color: theme.secondary }]}>
                    N/A
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.statDivider} />

            {/* Progress */}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      item.progress >= 80
                        ? '#10B981'
                        : item.progress >= 50
                        ? '#F59E0B'
                        : '#EF4444',
                  },
                ]}
              >
                {item.progress}%
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 3. Feedback Link CTA - Prominent section for active sessions */}
        {item.status === 'pending_feedback' && item.feedback_link && (
          <TouchableOpacity
            style={styles.feedbackLinkSection}
            onPress={() => {
              Share.share({
                message: `Share this session link for feedback: ${item.title}\n\n${item.feedback_link}`,
                url: item.feedback_link,
                title: `Session Link: ${item.title}`,
              }).catch(err => console.log('Error sharing:', err));
            }}
            activeOpacity={0.8}
          >
            <SessionIcon size={24} color={isDark ? '#BFDBFE' : '#1E40AF'} />
            <View style={styles.feedbackLinkContent}>
              <Text style={styles.feedbackLinkLabel}>Share Feedback Link</Text>
              <Text style={styles.feedbackLinkExpiry}>{expiryText}</Text>
            </View>
            <RightArrowIcon size={20} color={isDark ? '#BFDBFE' : '#1E40AF'} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <SessionIcon color={isDark ? '#4B5563' : '#E2E8F0'} size={48} />
      <Text style={styles.emptyTitle}>No Sessions Found</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery || filter !== 'all'
          ? 'Try adjusting your search or filter criteria.'
          : 'Your therapy session history will appear here.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="Session History"
        onBackPress={() => navigation.goBack()}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <SearchIcon color={theme.secondary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search by title, type, or notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.secondary + '90'}
            />
          </View>
        </View>

        {/* Segmented Filters */}
        <View style={styles.filterContent}>
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'done', label: 'Completed' },
            { key: 'active', label: 'Active' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[
                styles.filterTab,
                filter === tab.key && styles.filterTabActive,
              ]}
              activeOpacity={0.9}
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

        {/* Session List */}
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
