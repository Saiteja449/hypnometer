import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// Assuming these imports are correct and available in your project structure
import ChartIcon from '../Icons/ChartIcon';
import GrowthIcon from '../Icons/GrowthIcon';
import SessionIcon from '../Icons/SessionIcon';
import StarIcon from '../Icons/StarIcon';
import InsightIcon from '../Icons/InsightIcon';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { getAnalyticsData } = useApp();
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedMetric, setSelectedMetric] = useState('sessions');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stylesheet Creation Function
  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      scrollView: {
        flex: 1,
        paddingHorizontal: 16,
      },
      header: {
        paddingVertical: 16,
        alignItems: 'center',
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'center',
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.primary,
        marginLeft: 8,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.secondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 350,
      },
      timeRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      timeRangeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        borderColor: theme.border,
        backgroundColor: theme.card,
        alignItems: 'center',
        marginHorizontal: 4,
        borderRadius: 10,
      },
      timeRangeButtonActive: {
        borderColor: theme.accent,
        backgroundColor: isDark ? '#3A305D' : '#F1F0FF',
      },
      timeRangeText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.secondary,
      },
      timeRangeTextActive: {
        color: theme.accent,
        fontWeight: 'bold',
      },
      summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
      },
      summaryCard: {
        flex: 1,
        backgroundColor: theme.card,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: isDark ? 'transparent' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      summaryIcon: {
        marginBottom: 8,
      },
      summaryNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.primary,
        marginBottom: 4,
      },
      summaryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.secondary,
        textAlign: 'center',
      },
      growthPositive: {
        color: theme.success,
      },
      growthNegative: {
        color: theme.error,
      },
      metricSelector: {
        marginBottom: 20,
      },
      metricButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme.card,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 8,
      },
      metricButtonActive: {
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      metricButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.primary,
      },
      metricButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      chartContainer: {
        backgroundColor: theme.card,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: isDark ? 'transparent' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      },
      chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.primary,
      },
      chartBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
      },
      chartBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
      },
      chartSubtext: {
        fontSize: 12,
        fontWeight: '400',
        color: theme.secondary,
        textAlign: 'center',
        marginBottom: 12,
      },
      barChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180,
      },
      barContainer: {
        alignItems: 'center',
        width: 35,
      },
      barBackground: {
        height: 120,
        width: 18,
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
        borderRadius: 4,
        justifyContent: 'flex-end',
        marginBottom: 8,
        overflow: 'hidden',
      },
      bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 4,
      },
      barValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.primary,
        marginBottom: 4,
      },
      barLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: theme.secondary,
        textAlign: 'center',
      },
      insightsContainer: {
        backgroundColor: theme.card,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: isDark ? 'transparent' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      insightsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.primary,
        marginBottom: 16,
      },
      insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border,
      },
      insightItemLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      insightIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      },
      insightText: {
        flex: 1,
      },
      insightTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.primary,
        marginBottom: 2,
      },
      insightDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: theme.secondary,
        lineHeight: 18,
      },
      statsContainer: {
        backgroundColor: theme.card,
        marginBottom: 30,
        padding: 20,
        borderRadius: 16,
        shadowColor: isDark ? 'transparent' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.primary,
        marginBottom: 16,
      },
      statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      statItem: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 5,
      },
      statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.accent,
        marginBottom: 4,
      },
      statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.secondary,
        textAlign: 'center',
      },
      noDataText: {
        textAlign: 'center',
        color: theme.secondary,
        fontSize: 14,
        marginTop: 20,
      },
    });

  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  // Filter data to show only recent periods
  const filterRecentData = (data, range) => {
    if (!data || !data.data) return data;

    const sessions = [...data.data];

    switch (range) {
      case 'weekly':
        // Show last 5 weeks
        return {
          ...data,
          sessions: sessions.slice(-7),
        };
      case 'monthly':
        // Show last 3 months
        return {
          ...data,
          sessions: sessions.slice(-5),
        };
      case 'yearly':
        // Show last 3 years
        return {
          ...data,
          sessions: sessions.slice(-5),
        };
      default:
        return data;
    }
  };

  // Calculate analytics from the API data
  const calculateAnalytics = data => {
    if (!data || !data.sessions) return null;

    const sessions = data.sessions;

    // Calculate total sessions and ratings
    const totalSessions = sessions.reduce(
      (sum, session) => sum + session.sessions,
      0,
    );
    const totalRatings = sessions.reduce(
      (sum, session) => sum + session.ratings,
      0,
    );

    // Calculate average rating (avoid division by zero)
    const averageRating = totalSessions > 0 ? totalRatings / totalSessions : 0;

    // Calculate growth (compare last period with previous period)
    let growth = '0%';
    let growthValue = 0;

    if (sessions.length >= 2) {
      const recentSessions = sessions[sessions.length - 1].sessions;
      const previousSessions = sessions[sessions.length - 2].sessions;

      if (previousSessions > 0) {
        growthValue =
          ((recentSessions - previousSessions) / previousSessions) * 100;
        growth = `${growthValue > 0 ? '+' : ''}${growthValue.toFixed(0)}%`;
      } else if (recentSessions > 0) {
        growthValue = 100;
        growth = '+100%';
      }
    }

    // Format trend data for chart
    const trendData = sessions.map(session => ({
      label: session.period,
      sessions: session.sessions,
      ratings: session.ratings,
    }));

    return {
      summary: {
        total_sessions: totalSessions,
        average_rating: averageRating,
        growth: growth,
        growthValue: growthValue,
        top_skill: totalSessions > 0 ? 'Tonality' : 'N/A',
        improvement_area: totalSessions > 0 ? 'Submodalities' : 'N/A',
      },
      trends: trendData,
      stats: {
        completion_rate:
          totalSessions > 0
            ? Math.min(
                95,
                Math.round((totalSessions / (totalSessions + 2)) * 100),
              )
            : 0,
        repeat_clients:
          totalSessions > 0 ? Math.max(1, Math.floor(totalSessions * 0.3)) : 0,
        satisfaction: averageRating > 0 ? averageRating.toFixed(1) : '0.0',
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAnalyticsData(timeRange);
        console.log('Analytics result:', result);

        if (result.success) {
          // Filter data to show only recent periods
          const filteredData = filterRecentData(result, timeRange);
          const calculatedData = calculateAnalytics(filteredData);
          setAnalyticsData(calculatedData);
        } else {
          setAnalyticsData(null);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const metrics = {
    sessions: { label: 'Sessions', color: '#8641f4' },
    ratings: { label: 'Ratings', color: '#FF6B6B' },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Analytics"
          onBackPress={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Analytics"
          onBackPress={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: theme.secondary }}>
            No data available for this range.
          </Text>
        </View>
      </View>
    );
  }

  // Prepare chart data based on selected metric
  const chartData = analyticsData.trends.map(item => ({
    label: item.label,
    value: item[selectedMetric],
    maxValue:
      Math.max(...analyticsData.trends.map(t => t[selectedMetric])) || 1,
  }));

  // Format labels based on time range
  const formatLabel = (label, range) => {
    switch (range) {
      case 'yearly':
        return label.slice(2); // Show only last 2 digits for years (2025 -> 25)
      case 'monthly':
        return label.split(' ')[0].slice(0, 3); // Show only first 3 letters of month (Dec 2024 -> Dec)
      case 'weekly':
        return label.replace('W', 'Wk '); // Format as "Wk 36" instead of "W36"
      default:
        return label;
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Analytics" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ChartIcon color={theme.primary} size={24} />
            <Text style={styles.title}>Session Analytics</Text>
          </View>
          <Text style={styles.subtitle}>
            Track your performance and growth over time
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {['weekly', 'monthly', 'yearly'].map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <SessionIcon color={theme.accent} size={24} />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.total_sessions}
            </Text>
            <Text style={styles.summaryLabel}>Total Sessions</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <StarIcon color={theme.warning} size={24} />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.average_rating.toFixed(1)}
            </Text>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <GrowthIcon
                color={
                  analyticsData.summary.growthValue >= 0
                    ? theme.success
                    : theme.error
                }
                size={24}
              />
            </View>
            <Text
              style={[
                styles.summaryNumber,
                analyticsData.summary.growthValue >= 0
                  ? styles.growthPositive
                  : styles.growthNegative,
              ]}
            >
              {analyticsData.summary.growth}
            </Text>
            <Text style={styles.summaryLabel}>Growth</Text>
          </View>
        </View>

        {/* Metric Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.metricSelector}
        >
          {Object.entries(metrics).map(([key, metric]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.metricButton,
                selectedMetric === key && [
                  styles.metricButtonActive,
                  { backgroundColor: metric.color },
                ],
              ]}
              onPress={() => setSelectedMetric(key)}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  selectedMetric === key && styles.metricButtonTextActive,
                ]}
              >
                {metric.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Growth Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {metrics[selectedMetric].label} Progress
            </Text>
            <View
              style={[
                styles.chartBadge,
                { backgroundColor: metrics[selectedMetric].color },
              ]}
            >
              <Text style={styles.chartBadgeText}>
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.chartSubtext}>
            Showing last{' '}
            {timeRange === 'weekly'
              ? '5 weeks'
              : timeRange === 'monthly'
              ? '3 months'
              : '3 years'}{' '}
            for {metrics[selectedMetric].label.toLowerCase()}
          </Text>

          {chartData.length > 0 ? (
            <View style={styles.barChart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{item.value}</Text>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(item.value / item.maxValue) * 100}%`,
                          backgroundColor: metrics[selectedMetric].color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {formatLabel(item.label, timeRange)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No data available for chart</Text>
          )}
        </View>

        {/* Insights */}
        {analyticsData.summary.total_sessions > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Performance Insights</Text>

            <View style={styles.insightItem}>
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor: isDark ? theme.success + '20' : '#ECFDF5',
                  },
                ]}
              >
                <InsightIcon color={theme.success} size={24} type="strength" />
              </View>
              <View style={styles.insightText}>
                <Text style={styles.insightTitle}>
                  {analyticsData.summary.growthValue > 0
                    ? 'Positive Growth'
                    : 'Activity Summary'}
                </Text>
                <Text style={styles.insightDescription}>
                  {analyticsData.summary.growthValue > 0
                    ? `Your session count has increased by ${analyticsData.summary.growth} compared to the previous period.`
                    : `You've maintained ${analyticsData.summary.total_sessions} sessions in the recent period.`}
                </Text>
              </View>
            </View>

            <View style={[styles.insightItem, styles.insightItemLast]}>
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor: isDark ? theme.warning + '20' : '#FFFBEB',
                  },
                ]}
              >
                <InsightIcon
                  color={theme.warning}
                  size={24}
                  type="improvement"
                />
              </View>
              <View style={styles.insightText}>
                <Text style={styles.insightTitle}>
                  {analyticsData.summary.total_sessions > 0
                    ? 'Engagement Opportunity'
                    : 'Get Started'}
                </Text>
                <Text style={styles.insightDescription}>
                  {analyticsData.summary.total_sessions > 0
                    ? `Consider increasing client ratings by focusing on ${analyticsData.summary.improvement_area.toLowerCase()} techniques.`
                    : 'Start tracking your sessions to get personalized insights and growth recommendations.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {analyticsData.stats.completion_rate}%
              </Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {analyticsData.stats.repeat_clients}
              </Text>
              <Text style={styles.statLabel}>Repeat Clients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {analyticsData.stats.satisfaction}
              </Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
