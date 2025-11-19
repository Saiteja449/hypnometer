import React, { useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg'; // Keeping unused imports just in case
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import { fontFamily } from '../utils/common';

const GrowthGraph = () => {
  const { theme, isDark } = useTheme();

  // Calculate screen width once for chart responsiveness
  const screenWidth = Dimensions.get('window').width - 40;

  const timeRanges = ['1W', '1M', '3M', '1Y'];
  const [selectedRange, setSelectedRange] = React.useState('1M');

  const { sessions: contextSessions } = useApp();

  // Helper: parse numeric rating from session object
  const getSessionScore = session => {
    const v =
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
    // ... (Your existing logic for bucketing sessions remains here) ...
    const now = new Date();
    let buckets = [];
    let labels = [];

    if (selectedRange === '1W') {
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
      for (let i = 2; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        buckets.push({ start, end });
        labels.push(start.toLocaleDateString(undefined, { month: 'short' }));
      }
    } else {
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

  const currentData = useMemo(
    () => buildChartFromSessions(contextSessions || []),
    [contextSessions, selectedRange],
  );

  // Helper to correctly derive RGBA color from the accent HEX for chart-kit
  const chartLineColor = (opacity = 1) => {
    const hex = theme.accent.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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

  const chartConfig = useMemo(
    () => ({
      backgroundColor: theme.card,
      backgroundGradientFrom: theme.card,
      backgroundGradientTo: theme.card,

      decimalPlaces: 1,
      color: chartLineColor,
      labelColor: (opacity = 1) => theme.secondary,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: theme.accent,
        fill: theme.card, // Dot center color
      },
      propsForBackgroundLines: {
        strokeDasharray: '', // Solid lines
        stroke: theme.border,
        strokeWidth: 1,
      },
      propsForLabels: {
        fontSize: 10,
        fontFamily: fontFamily.Nunito_Medium,
      },
      // The LineChart needs to know the range, otherwise it can render strangely
      yAxisInterval: 1,
      // Set min/max to ensure a consistent scale (e.g., 0 to 5, or 0 to 10)
      yAxisSuffix: '',
    }),
    [theme],
  );

  const TrendArrow = React.memo(({ trend }) => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d={trend === 'up' ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
        stroke={trend === 'up' ? '#27ae60' : '#e74c3c'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ));

  const calculateMetrics = () => {
    const data = currentData.data;
    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : data[0] || 0;

    let growth = 0;
    if (previous && previous !== 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (previous === 0 && current !== 0) {
      growth = 100;
    }

    const trend = growth >= 0 ? 'up' : 'down';
    const hasData = data.some(val => val > 0);
    const validData = data.filter(v => v !== 0);

    return {
      currentScore: current,
      growth: Math.abs(growth).toFixed(1),
      trend,
      highest: hasData ? Math.max(...validData).toFixed(1) : '0.0',
      average: hasData
        ? (validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(1)
        : '0.0',
    };
  };

  const metrics = calculateMetrics();

  // Stylesheet wrapped in useMemo for optimal performance
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.graphContainer}>
      {/* Header: Title and Current Score */}
      <View style={styles.graphHeader}>
        <View>
          <Text style={styles.sectionTitle}>Growth Progress</Text>
          <Text style={styles.graphSubtitle}>Metaphor Mastery Score</Text>
        </View>
        <View style={styles.currentScore}>
          <Text style={styles.scoreValue}>{metrics.currentScore}</Text>
          <Text style={styles.scoreLabel}>Current</Text>
        </View>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range}
            style={styles.timeRangeButton}
            onPress={() => setSelectedRange(range)}
          >
            <View
              style={[
                styles.timeRangeInner,
                selectedRange === range && {
                  backgroundColor: theme.accent,
                  borderRadius: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  selectedRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Line Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth - 20} // Subtract padding from container
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withHorizontalLines={true}
          withInnerLines={true}
          withOuterLines={false}
          fromZero={true} // Scores should start from 0
        />
      </View>

      {/* Metrics Cards */}
      <View style={styles.metricsContainer}>
        {/* Growth */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Growth</Text>
            <TrendArrow trend={metrics.trend} />
          </View>
          <Text
            style={[
              styles.metricValue,
              { color: metrics.trend === 'up' ? '#27ae60' : '#e74c3c' },
            ]}
          >
            {metrics.trend === 'up' ? '+' : ''}
            {metrics.growth}%
          </Text>
        </View>

        {/* Highest */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Highest</Text>
          <Text style={styles.metricValue}>{metrics.highest}</Text>
        </View>

        {/* Average */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Average</Text>
          <Text style={styles.metricValue}>{metrics.average}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    graphContainer: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 20,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.cardShadowOpacity || 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    graphHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
    graphSubtitle: {
      fontSize: 12,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_Medium,
      marginTop: 2,
    },
    currentScore: {
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#E6F0FF',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#CCE0FF',
    },
    scoreValue: {
      fontSize: 16,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.accent,
    },
    scoreLabel: {
      fontSize: 10,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_Medium,
    },
    timeRangeContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? theme.background : '#F7FAFC',
      padding: 4,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    timeRangeButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },
    timeRangeInner: {
      width: '100%',
      paddingVertical: 6,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeRangeText: {
      fontSize: 12,
      fontFamily: fontFamily.Nunito_Medium,
      color: theme.secondary,
    },
    timeRangeTextActive: {
      color: '#FFFFFF',
      fontFamily: fontFamily.Nunito_Bold,
    },
    chartWrapper: {
      alignItems: 'center',
      marginBottom: 16,
      marginHorizontal: -10,
    },
    chart: {
      borderRadius: 16,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    metricCard: {
      flex: 1,
      backgroundColor: isDark ? theme.background : '#F8FAFF',
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'flex-start',
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 4,
    },
    metricLabel: {
      fontSize: 11,
      color: theme.secondary,
      fontFamily: fontFamily.Nunito_Medium,
    },
    metricValue: {
      fontSize: 14,
      fontFamily: fontFamily.Nunito_Bold,
      color: theme.primary,
    },
  });

export default GrowthGraph;
