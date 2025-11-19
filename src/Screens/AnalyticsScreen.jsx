import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
// Assuming these imports are correct
import ChartIcon from '../Icons/ChartIcon';
import GrowthIcon from '../Icons/GrowthIcon';
import SessionIcon from '../Icons/SessionIcon';
import StarIcon from '../Icons/StarIcon';
import InsightIcon from '../Icons/InsightIcon';
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
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

  // --- Stylesheet Creation Function (Optimized UI) ---
  const getStyles = (theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      scrollView: {
        flex: 1,
        paddingHorizontal: 16, // Use horizontal padding on scroll view
      },
      header: {
        paddingVertical: 16, // Increased vertical padding
        alignItems: 'center',
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'center',
      },
      title: {
        fontSize: 22, // Slightly larger title
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginLeft: 8,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 350,
      },
      // ✨ Time Range Selector Refinement
      timeRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 0,
      },
      timeRangeButton: {
        flex: 1,
        paddingVertical: 8, // Reduced vertical padding
        paddingHorizontal: 12,
        borderWidth: 1.5, // Thicker default border
        borderColor: theme.border,
        backgroundColor: theme.card,
        alignItems: 'center',
        marginHorizontal: 4, // Tighter spacing
        borderRadius: 10, // Slightly smaller radius for pill
      },
      timeRangeButtonActive: {
        borderColor: theme.accent, // Highlight border
        backgroundColor: isDark ? '#3A305D' : '#F1F0FF', // Subtle active background
      },
      timeRangeText: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
      },
      timeRangeTextActive: {
        color: theme.accent,
        fontFamily: 'Nunito-Bold', // Bolder active text
      },
      // ✨ Summary Grid Refinement
      summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12, // Increased gap
        paddingHorizontal: 0,
      },
      summaryCard: {
        flex: 1,
        backgroundColor: theme.card,
        padding: 16, // Increased padding
        borderRadius: 16, // Consistent border radius
        alignItems: 'center',
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 4 }, // Stronger shadow for depth
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      summaryIcon: {
        marginBottom: 8, // Increased spacing
      },
      summaryNumber: {
        fontSize: 24, // Larger number
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 4,
      },
      summaryLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-SemiBold', // Bolder label
        color: theme.secondary,
        textAlign: 'center',
      },
      growthPositive: {
        color: theme.success, // Use theme success color
      },
      // ✨ Metric Selector Refinement
      metricSelector: {
        marginBottom: 20,
        paddingHorizontal: 0,
      },
      metricButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme.card,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 8, // Tighter spacing
      },
      metricButtonActive: {
        borderColor: 'transparent', // Active button border is hidden/replaced by background color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      metricButtonText: {
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        color: theme.primary,
      },
      metricButtonTextActive: {
        color: '#FFFFFF', // White text on colored background
        fontFamily: 'Nunito-Bold',
      },
      // ✨ Chart Container Refinement
      chartContainer: {
        backgroundColor: theme.card,
        marginBottom: 20,
        padding: 20, // Increased padding
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16, // Increased spacing
      },
      chartTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
      },
      chartBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16, // More rounded badge
      },
      chartBadgeText: {
        fontSize: 12,
        fontFamily: 'Nunito-SemiBold',
        color: '#FFFFFF',
      },
      chartPlaceholder: {
        // Removed placeholder box to only show the chart
        alignItems: 'center',
        paddingVertical: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
        marginBottom: 10,
      },
      chartIcon: {
        marginBottom: 10,
        // Removed ChartIcon component from the actual chart view
        display: 'none',
      },
      chartPlaceholderText: {
        display: 'none', // Hide placeholder text
      },
      chartSubtext: {
        fontSize: 12,
        fontFamily: 'Nunito-Regular',
        color: theme.secondary,
        textAlign: 'center',
        marginBottom: 12, // Add space below subtext
      },
      // ✨ Bar Chart Refinement
      barChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180, // Slightly less height
        paddingHorizontal: 0,
      },
      barContainer: {
        alignItems: 'center',
        width: 30, // Fixed width for container
      },
      barBackground: {
        height: 120, // Reduced height for background
        width: 14, // Wider bar
        backgroundColor: isDark ? '#374151' : '#E5E7EB', // Lighter background color
        borderRadius: 4,
        justifyContent: 'flex-end',
        marginBottom: 8,
        overflow: 'hidden', // Ensures inner bar stays within bounds
      },
      bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 4, // Smaller min height
      },
      barValue: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold', // Bolder value
        color: theme.primary,
        marginBottom: 4,
      },
      barLabel: {
        fontSize: 11,
        fontFamily: 'Nunito-Medium',
        color: theme.secondary,
        textAlign: 'center',
      },
      // ✨ Insights Container Refinement
      insightsContainer: {
        backgroundColor: theme.card,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      insightsTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        color: theme.primary,
        marginBottom: 16,
      },
      insightItem: {
        flexDirection: 'row',
        alignItems: 'center', // Align items center vertically
        paddingVertical: 12, // Increased vertical padding
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border,
      },
      insightItemLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      insightIcon: {
        width: 44, // Slightly larger icon container
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15, // Increased spacing
        // Specific colors for backgrounds:
      },
      insightText: {
        flex: 1,
      },
      insightTitle: {
        fontSize: 15,
        fontFamily: 'Nunito-Bold', // Bolder title
        color: theme.primary,
        marginBottom: 2,
      },
      insightDescription: {
        fontSize: 13, // Slightly smaller description
        fontFamily: 'Nunito-Regular',
        color: theme.secondary,
        lineHeight: 18,
      },
      // ✨ Stats Container Refinement
      statsContainer: {
        backgroundColor: theme.card,
        marginBottom: 30,
        padding: 20,
        borderRadius: 16,
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 6,
      },
      statsTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
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
        fontSize: 24, // Larger number
        fontFamily: 'Nunito-Bold',
        color: theme.accent,
        marginBottom: 4,
      },
      statLabel: {
        fontSize: 12,
        fontFamily: 'Nunito-SemiBold',
        color: theme.secondary,
        textAlign: 'center',
      },
    });
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.container}>
      <CustomHeader title="Analytics" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // Add padding to bottom of scroll content
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

        {/* --- 1. Time Range Selector --- */}
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

        {/* --- 2. Summary Grid --- */}
        <View style={styles.summaryGrid}>
          {/* Total Sessions */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <SessionIcon color={theme.accent} size={24} />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.totalSessions}
            </Text>
            <Text style={styles.summaryLabel}>Total Sessions</Text>
          </View>

          {/* Average Rating */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <StarIcon color={theme.warning} size={24} />
            </View>
            <Text style={styles.summaryNumber}>
              {analyticsData.summary.averageRating}
            </Text>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
          </View>

          {/* Growth */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <GrowthIcon color={theme.success} size={24} />
            </View>
            <Text style={[styles.summaryNumber, styles.growthPositive]}>
              {analyticsData.summary.growth}
            </Text>
            <Text style={styles.summaryLabel}>Growth</Text>
          </View>
        </View>

        {/* --- 3. Metric Selector --- */}
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

        {/* --- 4. Growth Chart --- */}
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

          {/* Simple bar chart representation */}
          <Text style={styles.chartSubtext}>
            Showing {timeRange}ly trends for{' '}
            {metrics[selectedMetric].label.toLowerCase()}
          </Text>

          <View style={styles.barChart}>
            {analyticsData.trends.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      {
                        // Calculate height relative to the max bar height (120) and max rating (5.0)
                        height: `${(item.rating / 5) * 100}%`,
                        backgroundColor: metrics[selectedMetric].color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{item.rating.toFixed(1)}</Text>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- 5. Insights --- */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Performance Insights</Text>

          {/* Strongest Skill Insight */}
          <View style={styles.insightItem}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: isDark ? theme.success + '20' : '#ECFDF5' }, // Green tint
              ]}
            >
              {/* Assuming InsightIcon takes a 'type' prop or defaults to a relevant icon */}
              <InsightIcon color={theme.success} size={24} type="strength" />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Strongest Skill</Text>
              <Text style={styles.insightDescription}>
                Your **{analyticsData.summary.topSkill}** scores are
                consistently high across all sessions. Keep leveraging this
                strength!
              </Text>
            </View>
          </View>

          {/* Area for Improvement Insight */}
          <View style={[styles.insightItem, styles.insightItemLast]}>
            <View
              style={[
                styles.insightIcon,
                { backgroundColor: isDark ? theme.warning + '20' : '#FFFBEB' }, // Yellow tint
              ]}
            >
              <InsightIcon color={theme.warning} size={24} type="improvement" />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Area for Improvement</Text>
              <Text style={styles.insightDescription}>
                Focus on **{analyticsData.summary.improvementArea}** techniques
                to enhance client engagement and depth of trance.
              </Text>
            </View>
          </View>
        </View>

        {/* --- 6. Additional Stats --- */}
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
