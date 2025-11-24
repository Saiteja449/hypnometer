import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

import { useTheme } from '../Context/ThemeContext';
import SessionCard from '../Components/SessionCard';
import { fontFamily } from '../utils/common';

const SessionList = ({
  sessions,
  navigation,
  loading = false,
  title = 'Recent Sessions',
  showViewAll = true,
}) => {
  const { theme, isDark } = useTheme();

  // Move styles to useMemo for performance and theme adaptability
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const EmptyStateIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle
        cx="40"
        cy="40"
        r="38"
        stroke={theme.border}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <Path
        d="M30 40H50M40 30V50"
        stroke={theme.secondary}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <EmptyStateIcon />
      </View>
      <Text style={styles.emptyTitle}>No Sessions Yet</Text>
      <Text style={styles.emptyDescription}>
        Start your first session to begin tracking your progress.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewSessionScreen')}
        style={styles.createButton}
        activeOpacity={0.9}
      >
        <Text style={styles.createButtonText}>Create New Session</Text>
      </TouchableOpacity>
    </View>
  );

  console.log('Sessions', sessions);

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionItemWrapper}>
      {/* Assuming SessionCard handles its own internal styling, 
          we just ensure it fits the container */}
      <SessionCard
        session={item}
        onPress={() =>
          navigation.navigate('SessionDetailScreen', {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {sessions.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{sessions.length}</Text>
            </View>
          )}
        </View>

        {sessions.length > 0 && showViewAll && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('AllSessionsScreen')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>See All</Text>
            <Svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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

      {/* List Section */}
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={item => `session-${item.id}`}
        scrollEnabled={false} // Keep disabled if inside a ScrollView
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        initialNumToRender={3}
      />
    </View>
  );
};

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 20,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.cardShadowOpacity || 0.1,
      shadowRadius: 12,
      elevation: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 18,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
    badge: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#EEF2FF',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E0E7FF',
    },
    badgeText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.accent,
    },
    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    viewAllText: {
      fontSize: 13,
      fontFamily: fontFamily.Nunito_SemiBold,
      color: theme.accent,
    },
    listContent: {
      gap: 12,
    },
    sessionItemWrapper: {
      // Wrapper ensuring shadows inside SessionCard don't get clipped
      // if you add specific layout constraints here
    },
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },

    // Empty State Styles
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
    },
    emptyIconWrap: {
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_Regular,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
      maxWidth: 240,
    },
    createButton: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: fontFamily.Nunito_Bold,
    },
  });

export default SessionList;
