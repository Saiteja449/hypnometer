import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import SessionCard from '../Components/SessionCard';
import Svg, { Path, Circle } from 'react-native-svg';

const SessionList = ({
  sessions,
  navigation,
  loading = false,
  title = 'Recent Sessions',
  showViewAll = true,
}) => {
  // Empty State Icon
  const EmptyStateIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" stroke="#E2E8F0" strokeWidth="2" />
      <Path
        d="M30 40H50M40 30V50"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M25 25L55 55M55 25L25 55"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <EmptyStateIcon />
      <Text style={styles.emptyTitle}>No Sessions Yet</Text>
      <Text style={styles.emptyDescription}>
        Start by creating your first therapy session to track your progress and
        get feedback.
      </Text>
      <TouchableOpacity
        style={styles.createSessionButton}
        onPress={() => navigation.navigate('NewSessionScreen')}
      >
        <Text style={styles.createSessionText}>Create First Session</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSessionItem = ({ item, index }) => (
    <View style={styles.sessionItemWrapper}>
      <SessionCard
        session={item}
        onPress={() =>
          navigation.navigate('SessionDetail', {
            sessionId: item.id,
            sessionData: item,
          })
        }
        showFeedbackLink={false}
        compact={true}
      />
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.sessionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8641f4" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sessionsContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sessionCountBadge}>
            <Text style={styles.sessionCountText}>{sessions.length}</Text>
          </View>
        </View>
        {sessions.length > 0 && showViewAll && (
          <TouchableOpacity
            style={styles.viewAllButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 12L10 8L6 4"
                stroke="#8641f4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={item => `session-${item.id}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sessionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F2FF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
  },
  sessionCountBadge: {
    backgroundColor: '#8641f4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sessionCountText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#8641f4',
  },
  listContent: {
    flexGrow: 1,
  },
  sessionItemWrapper: {
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
    marginBottom: 24,
  },
  createSessionButton: {
    backgroundColor: '#8641f4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createSessionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
    marginTop: 12,
  },
});

export default SessionList;