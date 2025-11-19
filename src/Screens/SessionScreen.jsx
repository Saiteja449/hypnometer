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
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import StarIcon from '../Icons/StarIcon';

/* ScorePill and RatingCard are defined inside SessionScreen so they have access
   to `styles` and `theme` which are created in the component scope. */

const SessionScreen = ({ navigation, route }) => {
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
        setAverages(res.data.average_ratings || res.data.average_rating || null);
      }
      setLoading(false);
    })();
  }, [sessionId]);

  const stylesMemo = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const styles = stylesMemo;
  const palette = useMemo(
    () => ({
      accent: '#7C3AED',
      accentLight: '#F3E8FF',
      teal: '#06B6D4',
      pillBg: '#FBFBFF',
      pillShadow: 'rgba(16,24,40,0.04)',
      overallBg: '#EEF2FF',
      peerAccent: '#F59E0B',
      observerAccent: '#60A5FA',
      linkBorder: '#06B6D4',
    }),
    [],
  );

  const ScorePill = ({ label, value }) => (
    <View style={[styles.scorePill, { backgroundColor: palette.accentLight }] }>
      <Text style={[styles.pillLabel, { color: theme.secondary }]}>{label}</Text>
      <View style={styles.pillValueRow}>
        <StarIcon size={14} color={palette.peerAccent} />
        <Text style={[styles.pillValue, { color: theme.primary }]}> {value}</Text>
      </View>
    </View>
  );

  const RatingCard = ({ item }) => {
    const accentColor = item.rater_type === 'peer' ? palette.peerAccent : palette.observerAccent;
    return (
      <View style={[styles.ratingCard, { backgroundColor: theme.card }]}>
        <View style={[styles.ratingAccent, { backgroundColor: accentColor }]} />
        <View style={styles.ratingHeader}>
        <Text style={[styles.raterType, { color: theme.accent }]}>
          {item.rater_type ? item.rater_type.toUpperCase() : 'RATER'}
        </Text>
        <Text style={[styles.ratingDate, { color: theme.secondary }]}> 
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>

      <View style={styles.scoresRow}>
        <View style={styles.scoreCol}>
          <Text style={[styles.scoreLabel, { color: theme.secondary }]}>Creativity</Text>
          <Text style={[styles.scoreNumber, { color: theme.primary }]}>{item.creativity_score}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={[styles.scoreLabel, { color: theme.secondary }]}>Tonality</Text>
          <Text style={[styles.scoreNumber, { color: theme.primary }]}>{item.tonality_score}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={[styles.scoreLabel, { color: theme.secondary }]}>Submodalities</Text>
          <Text style={[styles.scoreNumber, { color: theme.primary }]}>{item.submodalities_score}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={[styles.scoreLabel, { color: theme.secondary }]}>Overall</Text>
          <Text style={[styles.scoreNumber, { color: theme.primary }]}>{item.overall_experience_score}</Text>
        </View>
      </View>

      {item.comments ? (
        <Text style={[styles.comments, { color: theme.primary }]}>{item.comments}</Text>
      ) : null}
      </View>
    );
  };

  if (!sessionId) {
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader title="Session" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}><Text style={{ color: theme.secondary }}>No session selected</Text></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title={sessionData?.title || 'Session Details'} onBackPress={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topCard}>
            <View style={styles.topRow}>
              <View style={[styles.overallBadge, { backgroundColor: palette.overallBg }]}>
                <Text style={[styles.overallNumber, { color: palette.accent }]}> {averages?.overall ?? averages?.average_rating ?? '-'} </Text>
                <Text style={[styles.overallLabel, { color: theme.secondary }]}>Avg</Text>
              </View>

              <View style={styles.topInfo}>
                <Text style={styles.sessionTitle}>{sessionData?.title}</Text>
                <Text style={styles.sessionMeta}>{sessionData?.session_type} • {sessionData?.client_name}</Text>

                {sessionData?.session_link ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(sessionData.session_link)}
                    style={[styles.linkButton, { borderColor: palette.linkBorder }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.linkText, { color: palette.linkBorder }]}>Open Session Link</Text>
                  </TouchableOpacity>
                ) : null}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                  <ScorePill label="Creativity" value={averages?.creativity ?? '-'} />
                  <ScorePill label="Tonality" value={averages?.tonality ?? '-'} />
                  <ScorePill label="Submodalities" value={averages?.submodalities ?? '-'} />
                  <ScorePill label="Overall" value={averages?.overall ?? averages?.average_rating ?? '-'} />
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>Individual Ratings</Text>
            <Text style={[styles.sectionCount, { color: theme.secondary }]}>{ratings.length} reviews</Text>
          </View>

          <FlatList
            data={ratings}
            keyExtractor={item => `rating-${item.id}`}
            renderItem={({ item }) => <RatingCard item={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 16 },
    loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
    topRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    overallBadge: { width: 86, height: 86, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
    overallNumber: { fontSize: 28, fontFamily: 'Nunito-Bold' },
    overallLabel: { fontSize: 12, fontFamily: 'Nunito-Medium', marginTop: 2 },
    topInfo: { flex: 1 },
    sessionTitle: { fontSize: 18, fontFamily: 'Nunito-Bold', color: theme.primary, marginBottom: 6 },
    sessionMeta: { fontSize: 13, fontFamily: 'Nunito-Medium', color: theme.secondary, marginBottom: 10 },
    linkButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start' },
    linkText: { fontSize: 14, fontFamily: 'Nunito-SemiBold' },
    pillsScroll: { marginTop: 10 },
    scorePill: { minWidth: 110, paddingVertical: 10, paddingHorizontal: 12, marginRight: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    pillLabel: { fontSize: 11, fontFamily: 'Nunito-Bold' },
    pillValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    pillValue: { fontSize: 16, fontFamily: 'Nunito-Bold' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
    sectionTitle: { fontSize: 16, fontFamily: 'Nunito-Bold' },
    sectionCount: { fontSize: 12, fontFamily: 'Nunito-Medium' },
    ratingCard: { padding: 12, borderRadius: 10, borderWidth: 0, borderColor: theme.border, backgroundColor: theme.card, position: 'relative', overflow: 'hidden' },
    ratingAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
    ratingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginLeft: 8 },
    raterType: { fontSize: 12, fontFamily: 'Nunito-Bold' },
    ratingDate: { fontSize: 11 },
    scoresRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    scoreCol: { alignItems: 'center', flex: 1 },
    scoreLabel: { fontSize: 11 },
    scoreNumber: { fontSize: 15, fontFamily: 'Nunito-Bold', marginTop: 6 },
    comments: { marginTop: 10, fontSize: 13, fontFamily: 'Nunito-Regular' },
    sectionHeader: { marginTop: 14, marginBottom: 8 },
  });

export default SessionScreen;
