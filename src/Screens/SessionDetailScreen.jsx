import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext'; // Uses your new ThemeContext
import { useApp } from '../Context/AppContext';
import StarIcon from '../Icons/StarIcon';

const { width } = Dimensions.get('window');

const SessionDetailScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { getSessionRatings } = useApp();
  const sessionId = route?.params?.sessionId;

  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    (async () => {
      if (!sessionId) return;
      setLoading(true);
      const res = await getSessionRatings(sessionId);
      if (res.success && res.data) {
        setSessionData(res.data.session || res.data);
        setRatings(res.data.ratings || []);
        setAverages(
          res.data.average_ratings || res.data.average_rating || null,
        );
      }
      setLoading(false); // Removed timeout for snappier feel
    })();
  }, [sessionId]);

  // --- Helper: Formats numbers safely ---
  const formatScore = val => {
    const num = Number(val);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  // --- Component: Stat Card (Replaces ScorePill) ---
  const StatCard = ({ label, value, icon }) => (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
        },
      ]}
    >
      <View
        style={[
          styles.statIconWrap,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F4F8' },
        ]}
      >
        {/* You can swap icons based on label if you have them */}
        <StarIcon size={24} color={theme.accent} />
      </View>
      <Text style={[styles.statValue, { color: theme.primary }]}>
        {formatScore(value)}
      </Text>
      <Text style={[styles.statLabel, { color: theme.secondary }]}>
        {label}
      </Text>
    </View>
  );

  // --- Component: Review Card ---
  const ReviewCard = ({ item }) => {
    const isPeer = item.rater_type === 'peer';
    // Dynamic badge color based on type
    const badgeBg = isPeer
      ? 'rgba(245, 158, 11, 0.15)'
      : 'rgba(96, 165, 250, 0.15)'; // Orange vs Blue tint
    const badgeColor = isPeer ? '#F59E0B' : '#60A5FA';

    return (
      <View
        style={[
          styles.reviewCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        {/* Header: Type and Date */}
        <View style={styles.reviewHeader}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>
              {item.rater_type ? item.rater_type.toUpperCase() : 'REVIEWER'}
            </Text>
          </View>
          <Text style={[styles.reviewDate, { color: theme.secondary }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Scores Grid */}
        <View
          style={[
            styles.scoreGrid,
            { borderTopColor: theme.border, borderBottomColor: theme.border },
          ]}
        >
          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.secondary }]}>
              Creativity
            </Text>
            <Text style={[styles.gridValue, { color: theme.primary }]}>
              {formatScore(item.creativity_score)}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.secondary }]}>
              Tonality
            </Text>
            <Text style={[styles.gridValue, { color: theme.primary }]}>
              {formatScore(item.tonality_score)}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.secondary }]}>
              Submods
            </Text>
            <Text style={[styles.gridValue, { color: theme.primary }]}>
              {formatScore(item.submodalities_score)}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.accent }]}>
              Total
            </Text>
            <Text
              style={[
                styles.gridValue,
                { color: theme.accent, fontWeight: '800' },
              ]}
            >
              {formatScore(item.overall_experience_score)}
            </Text>
          </View>
        </View>

        {/* Comments */}
        {item.comments ? (
          <View
            style={[
              styles.commentBox,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
              },
            ]}
          >
            <Text style={[styles.commentText, { color: theme.primary }]}>
              "{item.comments}"
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  if (!sessionId) return null;

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Session Insights"
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HERO SECTION --- */}
          <View
            style={[
              styles.heroCard,
              { backgroundColor: theme.card, shadowColor: theme.cardShadow },
            ]}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroInfo}>
                <Text style={[styles.sessionTitle, { color: theme.primary }]}>
                  {sessionData?.title || 'Untitled Session'}
                </Text>
                <Text style={[styles.clientName, { color: theme.secondary }]}>
                  with {sessionData?.client_name || 'Client'} •{' '}
                  {sessionData?.session_type}
                </Text>
              </View>

              {/* Overall Score Badge */}
              <View
                style={[styles.overallBadge, { borderColor: theme.accent }]}
              >
                <Text style={[styles.overallScore, { color: theme.accent }]}>
                  {formatScore(averages?.overall ?? averages?.average_rating)}
                </Text>
                <View style={[styles.starRow]}>
                  <StarIcon size={12} color={theme.accent} filled />
                </View>
              </View>
            </View>

            {sessionData?.session_link && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.accent }]}
                onPress={() => Linking.openURL(sessionData.session_link)}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionButtonText, { color: '#FFF' }]}>
                  Open Recording
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- STATS ROW --- */}
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Breakdown
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            {/* PASS RAW NUMBERS HERE - The component handles formatting */}
            <StatCard label="Creativity" value={averages?.creativity} />
            <StatCard label="Tonality" value={averages?.tonality} />
            <StatCard label="Submodalities" value={averages?.submodalities} />
            <StatCard label="Expressiveness" value={averages?.expressiveness} />
          </ScrollView>

          {/* --- REVIEWS LIST --- */}
          <View style={styles.listHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.primary, marginBottom: 0 },
              ]}
            >
              Feedback History
            </Text>
            <Text style={[styles.countText, { color: theme.secondary }]}>
              {ratings.length} Reviews
            </Text>
          </View>

          <FlatList
            data={ratings}
            scrollEnabled={false} // Letting parent ScrollView handle scrolling
            keyExtractor={item => `r-${item.id}`}
            renderItem={({ item }) => <ReviewCard item={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            ListEmptyComponent={
              <View style={[styles.emptyState, { borderColor: theme.border }]}>
                <Text style={{ color: theme.secondary }}>
                  No feedback recorded yet.
                </Text>
              </View>
            }
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Hero Section
    heroCard: {
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4, // Android shadow
    },
    heroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    heroInfo: {
      flex: 1,
      paddingRight: 16,
    },
    sessionTitle: {
      fontSize: 22,
      fontFamily: 'Nunito-Bold',
      lineHeight: 28,
      marginBottom: 4,
    },
    clientName: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
    },
    overallBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderRadius: 16,
      width: 60,
      height: 60,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF',
    },
    overallScore: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
    },
    starRow: {
      marginTop: -2,
    },
    actionButton: {
      width: '100%',
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      fontFamily: 'Nunito-Bold',
      fontSize: 14,
    },

    // Stats
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      marginBottom: 12,
    },
    statsScroll: {
      paddingBottom: 24, // Space for shadow
      paddingRight: 20,
    },
    statCard: {
      width: 110,
      padding: 12,
      marginRight: 12,
      borderRadius: 16,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
      alignItems: 'center',
    },
    statIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: 'Nunito-Medium',
    },

    // Review List
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 12,
    },
    countText: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
    },
    reviewCard: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 10,
      fontFamily: 'Nunito-Bold',
    },
    reviewDate: {
      fontSize: 11,
      fontFamily: 'Nunito-Regular',
    },
    scoreGrid: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 12,
      marginBottom: 12,
    },
    gridItem: {
      flex: 1,
      alignItems: 'center',
    },
    gridLabel: {
      fontSize: 10,
      marginBottom: 4,
      fontFamily: 'Nunito-Bold',
    },
    gridValue: {
      fontSize: 14,
      fontFamily: 'Nunito-Bold',
    },
    commentBox: {
      padding: 12,
      borderRadius: 8,
    },
    commentText: {
      fontSize: 13,
      fontFamily: 'Nunito-Regular',
      lineHeight: 20,
      fontStyle: 'italic',
    },
    emptyState: {
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 12,
    },
  });

export default SessionDetailScreen;
