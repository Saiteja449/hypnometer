import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
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

  // Dynamic Stylesheet
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginLeft: 12,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      lineHeight: 22,
    },
    timeRangeContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: 'center',
      marginHorizontal: 4,
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
      paddingHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryIcon: {
      marginBottom: 8,
    },
    summaryNumber: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 4,
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
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    metricButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.card,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 8,
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
      color: '#FFFFFF',
      fontFamily: 'Nunito-SemiBold',
    },
    chartContainer: {
      backgroundColor: theme.card,
      marginHorizontal: 20,
      marginBottom: 24,
      padding: 20,
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
      marginBottom: 16,
    },
    chartTitle: {
      fontSize: 18,
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
      color: '#FFFFFF',
    },
    chartPlaceholder: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: isDark ? theme.background : theme.subCard,
      borderRadius: 12,
      marginBottom: 20,
    },
    chartIcon: {
      marginBottom: 12,
    },
    chartPlaceholderText: {
      fontSize: 16,
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
      marginHorizontal: 20,
      marginBottom: 24,
      padding: 20,
      borderRadius: 16,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    insightsTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 16,
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
    },
    insightIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      // Specific colors for icons are kept, but backgrounds are adjusted
    },
    insightText: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 4,
    },
    insightDescription: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      lineHeight: 20,
    },
    statsContainer: {
      backgroundColor: theme.card,
      marginHorizontal: 20,
      marginBottom: 40,
      padding: 20,
      borderRadius: 16,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statsTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 16,
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
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.accent, // Use theme accent color
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      textAlign: 'center',
    },
  });

  // SVG Icons (updated to use theme colors where appropriate)
  const ChartIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3V19H21"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14L10 11L13 15L17 9"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const GrowthIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke={theme.success}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6H23V12"
        stroke={theme.success}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const SessionIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={theme.accent}
        strokeWidth="2"
      />
      <Path
        d="M8 2V6M16 2V6M3 10H21"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const StarIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"
        stroke="#FFD700"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const InsightIcon = ({ type }) => {
    const successColor = theme.success;
    const warningColor = theme.warning;
    if (type === 'strength') {
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M14.5 2.5C14.5 2.5 16 4.5 16 7C16 9.5 14 11.5 12 11.5C10 11.5 8 9.5 8 7C8 4.5 9.5 2.5 9.5 2.5"
            stroke={successColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M12 14V20"
            stroke={successColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M8 18H16"
            stroke={successColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );
    }
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={warningColor} strokeWidth="2" />
        <Path
          d="M12 8V12M12 16H12.01"
          stroke={warningColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <CustomHeader title="Analytics" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={dynamicStyles.scrollView}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.headerContent}>
            <ChartIcon />
            <Text style={dynamicStyles.title}>Session Analytics</Text>
          </View>
          <Text style={dynamicStyles.subtitle}>
            Track your performance and growth over time
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={dynamicStyles.timeRangeContainer}>
          {['week', 'month', 'year'].map(range => (
            <TouchableOpacity
              key={range}
              style={[
                dynamicStyles.timeRangeButton,
                timeRange === range && dynamicStyles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  dynamicStyles.timeRangeText,
                  timeRange === range && dynamicStyles.timeRangeTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Grid */}
        <View style={dynamicStyles.summaryGrid}>
          <View style={dynamicStyles.summaryCard}>
            <View style={dynamicStyles.summaryIcon}>
              <SessionIcon />
            </View>
            <Text style={dynamicStyles.summaryNumber}>
              {analyticsData.summary.totalSessions}
            </Text>
            <Text style={dynamicStyles.summaryLabel}>Total Sessions</Text>
          </View>

          <View style={dynamicStyles.summaryCard}>
            <View style={dynamicStyles.summaryIcon}>
              <StarIcon />
            </View>
            <Text style={dynamicStyles.summaryNumber}>
              {analyticsData.summary.averageRating}
            </Text>
            <Text style={dynamicStyles.summaryLabel}>Avg Rating</Text>
          </View>

          <View style={dynamicStyles.summaryCard}>
            <View style={dynamicStyles.summaryIcon}>
              <GrowthIcon />
            </View>
            <Text
              style={[
                dynamicStyles.summaryNumber,
                dynamicStyles.growthPositive,
              ]}
            >
              {analyticsData.summary.growth}
            </Text>
            <Text style={dynamicStyles.summaryLabel}>Growth</Text>
          </View>
        </View>

        {/* Metric Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.metricSelector}
        >
          {Object.entries(metrics).map(([key, metric]) => (
            <TouchableOpacity
              key={key}
              style={[
                dynamicStyles.metricButton,
                selectedMetric === key && [
                  dynamicStyles.metricButtonActive,
                  { backgroundColor: metric.color },
                ],
              ]}
              onPress={() => setSelectedMetric(key)}
            >
              <Text
                style={[
                  dynamicStyles.metricButtonText,
                  selectedMetric === key &&
                    dynamicStyles.metricButtonTextActive,
                ]}
              >
                {metric.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Growth Chart */}
        <View style={dynamicStyles.chartContainer}>
          <View style={dynamicStyles.chartHeader}>
            <Text style={dynamicStyles.chartTitle}>
              {metrics[selectedMetric].label} Progress
            </Text>
            <View
              style={[
                dynamicStyles.chartBadge,
                { backgroundColor: metrics[selectedMetric].color },
              ]}
            >
              <Text style={dynamicStyles.chartBadgeText}>
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.chartPlaceholder}>
            <View style={dynamicStyles.chartIcon}>
              <ChartIcon />
            </View>
            <Text style={dynamicStyles.chartPlaceholderText}>
              Performance Trends
            </Text>
            <Text style={dynamicStyles.chartSubtext}>
              Showing {timeRange}ly trends for{' '}
              {metrics[selectedMetric].label.toLowerCase()}
            </Text>
          </View>

          {/* Simple bar chart representation */}
          <View style={dynamicStyles.barChart}>
            {analyticsData.trends.map((item, index) => (
              <View key={index} style={dynamicStyles.barContainer}>
                <View style={dynamicStyles.barBackground}>
                  <View
                    style={[
                      dynamicStyles.bar,
                      {
                        height: `${(item.rating / 5) * 80}%`,
                        backgroundColor: metrics[selectedMetric].color,
                      },
                    ]}
                  />
                </View>
                <Text style={dynamicStyles.barLabel}>{item.month}</Text>
                <Text style={dynamicStyles.barValue}>{item.rating}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={dynamicStyles.insightsContainer}>
          <Text style={dynamicStyles.insightsTitle}>Performance Insights</Text>

          <View style={dynamicStyles.insightItem}>
            <View
              style={[
                dynamicStyles.insightIcon,
                { backgroundColor: isDark ? '#1F2937' : '#ECFDF5' },
              ]}
            >
              <InsightIcon type="strength" />
            </View>
            <View style={dynamicStyles.insightText}>
              <Text style={dynamicStyles.insightTitle}>Strongest Skill</Text>
              <Text style={dynamicStyles.insightDescription}>
                Your {analyticsData.summary.topSkill} scores are consistently
                high across all sessions
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.insightItem}>
            <View
              style={[
                dynamicStyles.insightIcon,
                { backgroundColor: isDark ? '#3E2D2D' : '#FFFBEB' },
              ]}
            >
              <InsightIcon type="improvement" />
            </View>
            <View style={dynamicStyles.insightText}>
              <Text style={dynamicStyles.insightTitle}>
                Area for Improvement
              </Text>
              <Text style={dynamicStyles.insightDescription}>
                Focus on {analyticsData.summary.improvementArea} techniques to
                enhance client engagement
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View style={dynamicStyles.statsContainer}>
          <Text style={dynamicStyles.statsTitle}>Quick Stats</Text>
          <View style={dynamicStyles.statsGrid}>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statNumber}>92%</Text>
              <Text style={dynamicStyles.statLabel}>Completion Rate</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statNumber}>18</Text>
              <Text style={dynamicStyles.statLabel}>Repeat Clients</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statNumber}>4.7</Text>
              <Text style={dynamicStyles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
