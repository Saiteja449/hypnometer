import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Defs, Stop } from 'react-native-svg';

import { useTheme } from '../Context/ThemeContext';
import SessionCard from '../Components/SessionCard';

const StaticColors = {
  accentGradient: ['#8A2BE2', '#4C51BF'],
  emptyIcon: '#4A5568',
  success: '#38A169',
};

const SessionList = ({
  sessions,
  navigation,
  loading = false,
  title = 'Recent Sessions',
  showViewAll = true,
}) => {
  const { theme, isDark } = useTheme();

  const EmptyStateIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" stroke={theme.border} strokeWidth="2" />
      <Path
        d="M30 40H50M40 30V50"
        stroke={theme.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M25 25L55 55M55 25L25 55"
        stroke={theme.border}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const dynamicStyles = StyleSheet.create({
    sessionsContainer: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 20,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      marginBottom: 8,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    sessionCountBadge: {
      backgroundColor: theme.accent,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 16,
      minWidth: 28,
      alignItems: 'center',
    },
    sessionCountText: {
      fontSize: 13,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    viewAllText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.accent,
    },
    listContent: {
      flexGrow: 1,
    },
    sessionItemWrapper: {
      marginBottom: 12,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 20,
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
      marginBottom: 24,
    },
    createSessionButton: {
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 14,
      shadowColor: StaticColors.accentGradient[1],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 6,
    },
    createSessionText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 14,
      color: theme.secondary,
      fontFamily: 'Nunito-Regular',
      marginTop: 12,
    },
  });

  const renderEmptyComponent = () => (
    <View style={dynamicStyles.emptyContainer}>
      <EmptyStateIcon />
      <Text style={dynamicStyles.emptyTitle}>No Sessions Yet</Text>
      <Text style={dynamicStyles.emptyDescription}>
        Start by creating your first therapy session to track your progress and
        get feedback.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('NewSessionScreen')}>
        <LinearGradient
          colors={StaticColors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.createSessionButton}
        >
          <Text style={dynamicStyles.createSessionText}>
            Create First Session
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderSessionItem = ({ item, index }) => (
    <View style={dynamicStyles.sessionItemWrapper}>
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

  if (loading) {
    return (
      <View style={dynamicStyles.sessionsContainer}>
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>{title}</Text>
        </View>
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={dynamicStyles.loadingText}>Loading sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.sessionsContainer}>
      <View style={dynamicStyles.sectionHeader}>
        <View style={dynamicStyles.titleContainer}>
          <Text style={dynamicStyles.sectionTitle}>{title}</Text>
          <View style={dynamicStyles.sessionCountBadge}>
            <Text style={dynamicStyles.sessionCountText}>
              {sessions.length}
            </Text>
          </View>
        </View>
        {sessions.length > 0 && showViewAll && (
          <TouchableOpacity
            style={dynamicStyles.viewAllButton}
            onPress={() => navigation.navigate('AllSessionsScreen')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={dynamicStyles.viewAllText}>View All</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 12L10 8L6 4"
                stroke={theme.accent}
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
        contentContainerStyle={dynamicStyles.listContent}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

export default SessionList;
