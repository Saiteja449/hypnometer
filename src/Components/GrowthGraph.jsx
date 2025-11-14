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

const GrowthGraph = () => {
  const { theme, isDark } = useTheme();

  const screenWidth = Dimensions.get('window').width - 40;

  const timeRanges = ['1W', '1M', '3M', '1Y'];
  const [selectedRange, setSelectedRange] = React.useState('1M');

  const getChartData = () => {
    const data = {
      '1W': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [4.1, 4.3, 4.2, 4.4, 4.5, 4.3, 4.6],
      },
      '1M': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [3.2, 3.8, 4.1, 4.3, 4.2, 4.5],
      },
      '3M': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [3.5, 4.0, 4.2, 4.4],
      },
      '1Y': {
        labels: ['2023', '2024'],
        data: [3.8, 4.3],
      },
    };
    return data[selectedRange] || data['1M'];
  };

  const currentData = getChartData();

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
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
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
    const previous = data[data.length - 2] || data[0];
    const growth = ((current - previous) / previous) * 100;
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
      padding: 12,
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
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 2,
    },
    graphSubtitle: {
      fontSize: 14,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
    },
    currentScore: {
      alignItems: 'center',
      backgroundColor: isDark ? theme.background : '#F8FAFF',
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    scoreValue: {
      fontSize: 17,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
      marginBottom: 0,
    },
    scoreLabel: {
      fontSize: 12,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
    },
    timeRangeContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? theme.background : '#F7FAFC',
      padding: 2,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 2,
      borderRadius: 8,
      alignItems: 'center',
    },
    timeRangeButtonActive: {
      backgroundColor: theme.card,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    timeRangeText: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    timeRangeTextActive: {
      color: theme.accent,
      fontFamily: 'Nunito-Bold',
    },
    chartWrapper: {
      alignItems: 'center',
      marginBottom: 12,
    },
    chart: {
      borderRadius: 16,
      marginVertical: 6,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 8,
    },
    metricCard: {
      flex: 1,
      backgroundColor: isDark ? theme.background : '#F8FAFF',
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    metricLabel: {
      fontSize: 12,
      color: theme.secondary,
      fontFamily: 'Nunito-Medium',
      marginRight: 2,
    },
    metricValue: {
      fontSize: 15,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    performanceIndicator: {
      backgroundColor: isDark ? '#332700' : '#FFF9E6',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#665100' : '#FFE999',
    },
    performanceBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginBottom: 6,
      overflow: 'hidden',
    },
    performanceFill: {
      height: '100%',
      backgroundColor: theme.accent,
      borderRadius: 3,
    },
    performanceText: {
      fontSize: 14,
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
            key={range}
            style={[
              dynamicStyles.timeRangeButton,
              selectedRange === range && dynamicStyles.timeRangeButtonActive,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[
                dynamicStyles.timeRangeText,
                selectedRange === range && dynamicStyles.timeRangeTextActive,
              ]}
            >
              {range}
            </Text>
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
