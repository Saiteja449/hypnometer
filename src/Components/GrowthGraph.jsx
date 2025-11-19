import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import { fontFamily } from '../utils/common';

const GrowthGraph = () => {
  const { theme, isDark } = useTheme();

  const screenWidth = Dimensions.get('window').width - 40;

  const timeRanges = ['1W', '1M', '3M', '1Y'];
  const [selectedRange, setSelectedRange] = React.useState('1M');

  const ActiveRangeGradient = ['#8A2BE2', '#E28A2B']; // Violet to Gold

  const { sessions: contextSessions } = useApp();

  // Helper: parse numeric rating from session object
  const getSessionScore = session => {
    // common keys where average score might exist
    const v =
      session.average_rating ||
      session.average_rating ||
      session.average_ratings ||
      session.average ||
      session.averageScore ||
      null;
    const parsed = parseFloat(v);
    return Number.isFinite(parsed) ? parsed : null;
  };

  // Build buckets for the selected range and compute average score per bucket
  const buildChartFromSessions = sessions => {
    const now = new Date();
    let buckets = [];
    let labels = [];

    if (selectedRange === '1W') {
      // last 7 days (labels: Mon, Tue...)
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const start = new Date(day.setHours(0, 0, 0, 0));
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        buckets.push({ start, end });
        labels.push(start.toLocaleDateString(undefined, { weekday: 'short' }));
      }
    } else if (selectedRange === '1M') {
      // last 6 weeks
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - i * 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        buckets.push({ start, end });
        labels.push(`Wk ${6 - i}`);
      }
    } else if (selectedRange === '3M') {
      // last 3 months, monthly buckets
      for (let i = 2; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        buckets.push({ start, end });
        labels.push(start.toLocaleDateString(undefined, { month: 'short' }));
      }
    } else {
      // 1Y: last 12 months
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        buckets.push({ start, end });
        labels.push(start.toLocaleDateString(undefined, { month: 'short' }));
      }
    }

    const points = buckets.map(bucket => {
      const bucketSessions = (sessions || []).filter(s => {
        const sd = s.session_datetime
          ? new Date(s.session_datetime)
          : s.date
          ? new Date(s.date)
          : null;
        if (!sd) return false;
        return sd >= bucket.start && sd < bucket.end;
      });
      const scores = bucketSessions
        .map(getSessionScore)
        .filter(v => v !== null && !isNaN(v));
      if (scores.length === 0) return 0;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return parseFloat(avg.toFixed(1));
    });

    return { labels, data: points };
  };

  const currentData = buildChartFromSessions(contextSessions || []);

  const chartLineColor = (opacity = 1) =>
    `rgba(${parseInt(theme.accent.slice(1, 3), 16)}, ${parseInt(
      theme.accent.slice(3, 5),
      16,
    )}, ${parseInt(theme.accent.slice(5, 7), 16)}, ${opacity})`;

  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.data,
        color: chartLineColor,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,

    decimalPlaces: 1,
    color: chartLineColor,
    labelColor: (opacity = 1) =>
      isDark
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(113, 128, 150, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.accent,
      fill: theme.card,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 10,
      fontFamily: fontFamily.Nunito_Medium,
    },
  };

  const TrendArrow = ({ trend }) => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {trend === 'up' ? (
        <Path
          d="M4 10L8 6L12 10"
          stroke="#27ae60"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <Path
          d="M4 6L8 10L12 6"
          stroke="#e74c3c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );

  const calculateMetrics = () => {
    const data = currentData.data;
    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : data[0] || 0;
    let growth = 0;
    if (previous && previous !== 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (previous === 0 && current !== 0) {
      growth = 100; // arbitrary positive growth from zero
    }
    const trend = growth >= 0 ? 'up' : 'down';

    return {
      currentScore: current,
      growth: Math.abs(growth).toFixed(1),
      trend,
      highest: Math.max(...data),
      average: (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1),
    };
  };

  const metrics = calculateMetrics();

  const dynamicStyles = StyleSheet.create({
    graphContainer: {
      backgroundColor: theme.card,
      padding: 10,
      borderRadius: 20,
      shadowColor: isDark ? theme.cardShadow : theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    graphHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 0,
    },
    graphSubtitle: {
      fontSize: 12,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
    },
    currentScore: {
      alignItems: 'center',
      backgroundColor: isDark ? theme.background : '#F8FAFF',
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    scoreValue: {
      fontSize: 15,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
      marginBottom: 0,
    },
    scoreLabel: {
      fontSize: 10,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
    },
    timeRangeContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? theme.background : '#F7FAFC',
      padding: 2,
      borderRadius: 14, // Adjusted borderRadius
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 6,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    timeRangeButtonActive: {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: isDark ? '#4B0082' : '#FFD700',
    },
    timeRangeText: {
      fontSize: 10,
      fontFamily: fontFamily.Nunito_Medium,
      color: theme.secondary,
    },
    timeRangeTextActive: {
      color: '#FFFFFF',
      fontFamily: fontFamily.Nunito_Bold,
    },
    chartWrapper: {
      alignItems: 'center',
      marginBottom: 10,
    },
    chart: {
      borderRadius: 16,
      marginVertical: 4,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      gap: 6,
    },
    metricCard: {
      flex: 1,
      backgroundColor: isDark ? theme.background : '#F8FAFF',
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    metricLabel: {
      fontSize: 10,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
      marginRight: 0,
    },
    metricValue: {
      fontSize: 13,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    performanceIndicator: {
      backgroundColor: isDark ? '#332700' : '#FFF9E6',
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#665100' : '#FFE999',
    },
    performanceBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginBottom: 4,
      overflow: 'hidden',
    },
    performanceFill: {
      height: '100%',
      backgroundColor: theme.accent,
      borderRadius: 3,
    },
    performanceText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: isDark ? '#FFD700' : '#D97706',
      textAlign: 'center',
    },
  });

  return (
    <View style={dynamicStyles.graphContainer}>
      <View style={dynamicStyles.graphHeader}>
        <View>
          <Text style={dynamicStyles.sectionTitle}>Growth Progress</Text>
          <Text style={dynamicStyles.graphSubtitle}>
            Metaphor Mastery Score
          </Text>
        </View>
        <View style={dynamicStyles.currentScore}>
          <Text style={dynamicStyles.scoreValue}>{metrics.currentScore}</Text>
          <Text style={dynamicStyles.scoreLabel}>Current</Text>
        </View>
      </View>

      <View style={dynamicStyles.timeRangeContainer}>
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range} // Add padding styles here if you didn't add them to dynamicStyles.timeRangeButton
            style={dynamicStyles.timeRangeButton}
            onPress={() => setSelectedRange(range)}
          >
            {selectedRange === range ? (
              <View style={dynamicStyles.timeRangeButtonActive}>
                <Text style={dynamicStyles.timeRangeTextActive}>{range}</Text> 
              </View>
            ) : (
              <Text style={dynamicStyles.timeRangeText}>{range}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={dynamicStyles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={dynamicStyles.chart}
          withVerticalLines={true}
          withHorizontalLines={true}
          withInnerLines={true}
          withOuterLines={false}
          fromZero={false}
        />
      </View>

      <View style={dynamicStyles.metricsContainer}>
        <View style={dynamicStyles.metricCard}>
          <View style={dynamicStyles.metricHeader}>
            <Text style={dynamicStyles.metricLabel}>Growth</Text>
            <TrendArrow trend={metrics.trend} />
          </View>
          <Text
            style={[
              dynamicStyles.metricValue,
              { color: metrics.trend === 'up' ? '#27ae60' : '#e74c3c' },
            ]}
          >
            {metrics.trend === 'up' ? '+' : '-'}
            {metrics.growth}%
          </Text>
        </View>

        <View style={dynamicStyles.metricCard}>
          <Text style={dynamicStyles.metricLabel}>Highest</Text>
          <Text style={dynamicStyles.metricValue}>{metrics.highest}</Text>
        </View>

        <View style={dynamicStyles.metricCard}>
          <Text style={dynamicStyles.metricLabel}>Average</Text>
          <Text style={dynamicStyles.metricValue}>{metrics.average}</Text>
        </View>
      </View>
    </View>
  );
};

export default GrowthGraph;
