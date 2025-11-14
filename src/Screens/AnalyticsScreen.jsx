import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import ChartIcon from '../Icons/ChartIcon';
import GrowthIcon from '../Icons/GrowthIcon';
import SessionIcon from '../Icons/SessionIcon';
import StarIcon from '../Icons/StarIcon';
import InsightIcon from '../Icons/InsightIcon';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext'; // Import useTheme

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme(); // Use the theme context
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const metrics = {
    overall: { label: 'Overall Rating', color: '#8641f4' },
    creativity: { label: 'Creativity', color: '#FF6B6B' },
    expressiveness: { label: 'Expressiveness', color: '#4ECDC4' },
    submodalities: { label: 'Submodalities', color: '#45B7D1' },
    tonality: { label: 'Tonality', color: '#96CEB4' },
  };

  const analyticsData = {
    summary: {
      totalSessions: 47,
      averageRating: 4.3,
      growth: '+12%',
      topSkill: 'Creativity',
      improvementArea: 'Submodalities',
    },
    trends: [
      { month: 'Jan', rating: 4.1 },
      { month: 'Feb', rating: 4.2 },
      { month: 'Mar', rating: 4.0 },
      { month: 'Apr', rating: 4.3 },
      { month: 'May', rating: 4.4 },
      { month: 'Jun', rating: 4.5 },
    ],
  };

  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      scrollView: {
        flex: 1,
      },
      header: {
        padding: 12,
        paddingBottom: 6,
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      title: {
        fontSize: 20,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginLeft: 8,
      },
      subtitle: {
        fontSize: 16,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        lineHeight: 22,
      },
      timeRangeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 16,
      },
      timeRangeButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
        alignItems: 'center',
        marginHorizontal: 1,
        borderRadius: 12,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 3,
        elevation: 1,
      },
      timeRangeButtonActive: {
        borderWidth: 2,
        borderColor: theme.accent,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
      },
      timeRangeText: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
      },
      timeRangeTextActive: {
        color: theme.accent,
        fontFamily: 'Nunito-SemiBold',
      },
      summaryGrid: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 16,
        gap: 6,
      },
      summaryCard: {
        flex: 1,
        backgroundColor: theme.card,
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      summaryIcon: {
        marginBottom: 4,
      },
      summaryNumber: {
        fontSize: 20,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 2,
      },
      summaryLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
      },
      growthPositive: {
        color: theme.success,
      },
      metricSelector: {
        marginBottom: 16,
        paddingHorizontal: 12,
      },
      metricButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: theme.card,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 6,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 3,
        elevation: 1,
      },
      metricButtonActive: {
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
      metricButtonText: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
      },
      metricButtonTextActive: {
        color: theme.buttonText,
        fontFamily: 'Nunito-SemiBold',
      },
      chartContainer: {
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 20,
        padding: 16,
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      chartTitle: {
        fontSize: 17,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
      },
      chartBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
      },
      chartBadgeText: {
        fontSize: 12,
        fontFamily: 'Nunito-SemiBold',
        color: theme.buttonText,
      },
      chartPlaceholder: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: isDark ? theme.background : theme.border,
        borderRadius: 12,
        marginBottom: 20,
      },
      chartIcon: {
        marginBottom: 10,
      },
      chartPlaceholderText: {
        fontSize: 15,
        fontFamily: 'Nunito-SemiBold',
        color: theme.primary,
        marginBottom: 4,
      },
      chartSubtext: {
        fontSize: 12,
        fontFamily: 'Nunito-Regular',
        color: theme.secondary,
        textAlign: 'center',
      },
      barChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 200,
        paddingHorizontal: 10,
      },
      barContainer: {
        alignItems: 'center',
        flex: 1,
      },
      barBackground: {
        height: 150,
        width: 12,
        backgroundColor: isDark ? '#374151' : '#F3F4F6',
        borderRadius: 6,
        justifyContent: 'flex-end',
        marginBottom: 8,
      },
      bar: {
        width: 12,
        borderRadius: 6,
        minHeight: 8,
      },
      barLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        marginBottom: 4,
      },
      barValue: {
        fontSize: 10,
        fontFamily: 'Nunito-SemiBold',
        color: theme.primary,
      },
      insightsContainer: {
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 20,
        padding: 16,
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      insightsTitle: {
        fontSize: 17,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 12,
      },
      insightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
      },
      insightIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        // Specific colors for icons are kept, but backgrounds are adjusted
      },
      insightText: {
        flex: 1,
      },
      insightTitle: {
        fontSize: 15,
        fontFamily: 'Nunito-SemiBold',
        color: theme.primary,
        marginBottom: 2,
      },
      insightDescription: {
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
        color: theme.secondary,
        lineHeight: 20,
      },
      statsContainer: {
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 30,
        padding: 16,
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      statsTitle: {
        fontSize: 17,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 12,
      },
      statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      statItem: {
        alignItems: 'center',
        flex: 1,
      },
      statNumber: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        color: theme.accent, // Use theme accent color
        marginBottom: 2,
      },
      statLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        textAlign: 'center',
      },
    });

  return (
    <View style={styles.container}>
      <CustomHeader title="Analytics" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ChartIcon />
            <Text style={styles.title}>Session Analytics</Text>
          </View>
          <Text style={styles.subtitle}>
            Track your performance and growth over time
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {['week', 'month', 'year'].map(range => (
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
              <SessionIcon />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.totalSessions}
            </Text>
            <Text style={styles.summaryLabel}>Total Sessions</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <StarIcon />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.averageRating}
            </Text>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <GrowthIcon />
            </View>
            <Text style={[styles.summaryNumber, styles.growthPositive]}>
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

          <View style={styles.chartPlaceholder}>
            <View style={styles.chartIcon}>
              <ChartIcon />
            </View>
            <Text style={styles.chartPlaceholderText}>Performance Trends</Text>
            <Text style={styles.chartSubtext}>
              Showing {timeRange}ly trends for{' '}
              {metrics[selectedMetric].label.toLowerCase()}
            </Text>
          </View>

          {/* Simple bar chart representation */}
          <View style={styles.barChart}>
            {analyticsData.trends.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(item.rating / 5) * 80}%`,
                        backgroundColor: metrics[selectedMetric].color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
                <Text style={styles.barValue}>{item.rating}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Performance Insights</Text>

          <View style={styles.insightItem}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: isDark ? '#1F2937' : '#ECFDF5' },
              ]}
            >
              <InsightIcon type="strength" />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Strongest Skill</Text>
              <Text style={styles.insightDescription}>
                Your {analyticsData.summary.topSkill} scores are consistently
                high across all sessions
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: isDark ? '#3E2D2D' : '#FFFBEB' },
              ]}
            >
              <InsightIcon type="improvement" />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Area for Improvement</Text>
              <Text style={styles.insightDescription}>
                Focus on {analyticsData.summary.improvementArea} techniques to
                enhance client engagement
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>92%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Repeat Clients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.7</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
