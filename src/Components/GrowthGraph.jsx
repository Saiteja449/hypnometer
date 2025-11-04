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

const GrowthGraph = () => {
  const screenWidth = Dimensions.get('window').width - 40;

  // Time range options
  const timeRanges = ['1W', '1M', '3M', '1Y'];
  const [selectedRange, setSelectedRange] = React.useState('1M');

  // Chart data based on selected range
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

  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.data,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#8641f4',
      fill: '#ffffff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#E2E8F0',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
    },
  };

  // Custom SVG arrow for trend indicator
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

  // Calculate growth metrics
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

  return (
    <View style={styles.graphContainer}>
      {/* Header with title and metrics */}
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
            style={[
              styles.timeRangeButton,
              selectedRange === range && styles.timeRangeButtonActive,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                selectedRange === range && styles.timeRangeTextActive,
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={true}
          withHorizontalLines={true}
          withInnerLines={true}
          withOuterLines={false}
          fromZero={false}
        />
      </View>

      {/* Metrics Cards */}
      <View style={styles.metricsContainer}>
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
            {metrics.trend === 'up' ? '+' : '-'}
            {metrics.growth}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Highest</Text>
          <Text style={styles.metricValue}>{metrics.highest}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Average</Text>
          <Text style={styles.metricValue}>{metrics.average}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F2FF',
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  graphSubtitle: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'Nunito-Medium',
  },
  currentScore: {
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#718096',
    fontFamily: 'Nunito-Medium',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#718096',
  },
  timeRangeTextActive: {
    color: '#8641f4',
    fontFamily: 'Nunito-Bold',
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#718096',
    fontFamily: 'Nunito-Medium',
    marginRight: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#2D3748',
  },
  performanceIndicator: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE999',
  },
  performanceBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    backgroundColor: '#8641f4',
    borderRadius: 3,
  },
  performanceText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#D97706',
    textAlign: 'center',
  },
});

export default GrowthGraph;