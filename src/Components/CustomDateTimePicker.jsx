import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext'; // Assuming this is where useTheme comes from
import LeftArrowIcon from '../Icons/LeftArrowIcon';
import RightArrowIcon from '../Icons/RightArrowIcon';

const CustomDateTimePicker = ({
  visible,
  date,
  onDateChange,
  onClose,
  openstate,
}) => {
  const { theme, isDark } = useTheme(); // Use context for theme
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [mode, setMode] = useState(openstate || 'date'); // 'date' or 'time'
  const [currentMonth, setCurrentMonth] = useState(
    date ? date.getMonth() : new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    date ? date.getFullYear() : new Date().getFullYear(),
  );

  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);
  const { height } = Dimensions.get('window');

  // Constants
  const ITEM_HEIGHT = 45; // Adjusted height for better scroll appearance

  // --- Effects ---

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [date, visible]);

  // Auto-scroll logic for Time Picker (simulating native picker)
  useEffect(() => {
    if (visible && mode === 'time') {
      const currentHour = selectedDate.getHours();
      const currentMinute = selectedDate.getMinutes();

      // Calculate scroll position (centered view)
      const hourIndex = currentHour;
      const minuteIndex = currentMinute;

      const scrollToCenter = (ref, index, count) => {
        if (ref.current) {
          // Calculate offset to center the item (index * ITEM_HEIGHT - (container_height / 2) + (item_height / 2))
          // TimePicker height is 180, item is 45. 180/2 = 90. 45/2 = 22.5. Center offset: 90 - 22.5 = 67.5 (approx 2 items)
          const offset = index * ITEM_HEIGHT - (90 - ITEM_HEIGHT / 2);
          ref.current.scrollTo({ y: offset, animated: true });
        }
      };

      // Delay scroll slightly to ensure the modal is fully rendered
      setTimeout(() => {
        scrollToCenter(hourScrollRef, hourIndex, 24);
        scrollToCenter(minuteScrollRef, minuteIndex, 60);
      }, 300);
    }
  }, [visible, mode, selectedDate]);

  // --- Calendar Logic ---

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = day => {
    if (day) {
      const newDate = new Date(
        currentYear,
        currentMonth,
        day,
        selectedDate.getHours(),
        selectedDate.getMinutes(),
      );
      setSelectedDate(newDate);
    }
  };

  // --- Time Logic ---

  const handleTimeChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(parseInt(value));
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value));
    }
    setSelectedDate(newDate);
  };

  // Handlers for month navigation
  const goToPreviousMonth = () => {
    setSelectedDate(prevDate => {
      const newMonth = prevDate.getMonth() === 0 ? 11 : prevDate.getMonth() - 1;
      const newYear =
        prevDate.getMonth() === 0
          ? prevDate.getFullYear() - 1
          : prevDate.getFullYear();
      const newDay = Math.min(
        prevDate.getDate(),
        getDaysInMonth(newMonth, newYear),
      );
      return new Date(
        newYear,
        newMonth,
        newDay,
        prevDate.getHours(),
        prevDate.getMinutes(),
      );
    });
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    setCurrentYear(prev => (currentMonth === 0 ? prev - 1 : prev));
  };

  const goToNextMonth = () => {
    setSelectedDate(prevDate => {
      const newMonth = prevDate.getMonth() === 11 ? 0 : prevDate.getMonth() + 1;
      const newYear =
        prevDate.getMonth() === 11
          ? prevDate.getFullYear() + 1
          : prevDate.getFullYear();
      const newDay = Math.min(
        prevDate.getDate(),
        getDaysInMonth(newMonth, newYear),
      );
      return new Date(
        newYear,
        newMonth,
        newDay,
        prevDate.getHours(),
        prevDate.getMinutes(),
      );
    });
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    setCurrentYear(prev => (currentMonth === 11 ? prev + 1 : prev));
  };

  // --- Confirmation ---

  const handleConfirm = () => {
    onDateChange(selectedDate);
    onClose();
  };

  // --- Data and Formatting ---

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const formatDate = d => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  };

  const formatTime = d => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // --- Styles (Updated UI) ---

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
    },
    pickerContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24, // More rounded corners
      borderTopRightRadius: 24,
      paddingVertical: 20,
      paddingHorizontal: 20,
      maxHeight: height * 0.8, // Limit height on smaller screens
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      // Removed border for a cleaner look
    },
    headerText: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    // ✨ Mode Toggle
    modeToggleContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
      paddingHorizontal: 0,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 12, // Increased padding
      borderRadius: 12, // Pill shape corners
      alignItems: 'center',
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    modeButtonActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    modeButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
      marginLeft: 6,
    },
    modeButtonTextActive: {
      color: '#FFFFFF',
    },
    // ✨ Selected Display
    selectedDisplay: {
      backgroundColor: isDark ? theme.background : theme.border + '50', // Light contrast background
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 20,
      alignItems: 'center',
    },
    selectedText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 4,
    },
    selectedSubText: {
      fontSize: 15,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    // Calendar styles
    monthYearHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    monthYearText: {
      fontSize: 18,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    navButton: {
      padding: 8, // Square button
      borderRadius: 10,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayNamesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 8,
      paddingHorizontal: 0,
    },
    dayNameCell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
    },
    dayNameText: {
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50, // Perfect circle
      marginVertical: 2,
    },
    dayCellText: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
    },
    dayCellSelected: {
      backgroundColor: theme.accent,
    },
    dayCellSelectedText: {
      color: '#FFFFFF',
      fontFamily: 'Nunito-Bold',
    },
    dayCellDisabled: {
      backgroundColor: 'transparent',
    },
    dayCellDisabledText: {
      color: theme.border + '90', // Slightly visible empty days
    },
    dayCellToday: {
      borderWidth: 2,
      borderColor: theme.accent, // Border for today
    },
    // ✨ Time styles
    timeContainer: {
      marginBottom: 16,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 16,
      marginBottom: 0,
    },
    timeColumn: {
      flex: 1,
    },
    timeLabel: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    timePicker: {
      height: 180, // Larger height to show more options
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      backgroundColor: theme.background,
      overflow: 'hidden',
    },
    timePickerItem: {
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    timePickerItemText: {
      fontSize: 18, // Larger font size
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
    },
    timePickerItemActive: {
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    // ✨ Button Styles
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: theme.accent,
      alignItems: 'center',
    },
    confirmButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: '#FFFFFF',
    },
  });

  // --- Render Functions ---

  const renderCalendar = () => {
    const today = new Date();
    const isToday = day => {
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
    };

    const isSelected = day => {
      return (
        day === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear()
      );
    };

    return (
      <View>
        <View style={styles.monthYearHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPreviousMonth}
          >
            <LeftArrowIcon width={20} height={20} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
            <RightArrowIcon width={20} height={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dayNamesContainer}>
          {dayNames.map(dayName => (
            <View key={dayName} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{dayName}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !day && styles.dayCellDisabled,
                day && isSelected(day) && styles.dayCellSelected,
                day && isToday(day) && !isSelected(day) && styles.dayCellToday,
              ]}
              onPress={() => handleDateSelect(day)}
              disabled={!day}
              activeOpacity={day ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.dayCellText,
                  !day && styles.dayCellDisabledText,
                  day && isSelected(day) && styles.dayCellSelectedText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderTimePicker = () => {
    const currentHour = selectedDate.getHours().toString().padStart(2, '0');
    const currentMinute = selectedDate.getMinutes().toString().padStart(2, '0');

    // Helper to render the time scroll view
    const renderTimeScroll = (data, type, scrollRef, currentValue) => (
      <View style={styles.timeColumn}>
        <Text style={styles.timeLabel}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <ScrollView
          ref={scrollRef}
          style={styles.timePicker}
          contentContainerStyle={{
            paddingTop: styles.timePicker.height / 2 - ITEM_HEIGHT / 2,
            paddingBottom: styles.timePicker.height / 2 - ITEM_HEIGHT / 2,
          }}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {data.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.timePickerItem,
                currentValue === value && {
                  backgroundColor: theme.accent + '20',
                },
              ]}
              onPress={() => handleTimeChange(type, value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timePickerItemText,
                  currentValue === value && styles.timePickerItemActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );

    return (
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          {renderTimeScroll(hours, 'hour', hourScrollRef, currentHour)}
          {renderTimeScroll(minutes, 'minute', minuteScrollRef, currentMinute)}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      {/* Backdrop to close modal */}
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Modal Content container, stops propagation */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          style={styles.pickerContainer}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {mode === 'date' ? 'Select Date' : 'Select Time'}
            </Text>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'date' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('date')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'date' && styles.modeButtonTextActive,
                ]}
              >
                📅 Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'time' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('time')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'time' && styles.modeButtonTextActive,
                ]}
              >
                🕐 Time
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Date/Time Display */}
          <View style={styles.selectedDisplay}>
            <Text style={styles.selectedText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.selectedSubText}>
              {formatTime(selectedDate)}
            </Text>
          </View>

          {/* Date Picker or Time Picker Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: height * 0.4, marginBottom: 16 }} // Dynamic max height
          >
            {mode === 'date' ? renderCalendar() : renderTimePicker()}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomDateTimePicker;
