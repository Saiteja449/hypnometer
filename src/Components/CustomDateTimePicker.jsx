import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import LeftArrowIcon from '../Icons/LeftArrowIcon';
import RightArrowIcon from '../Icons/RightArrowIcon';

const CustomDateTimePicker = ({ visible, date, onDateChange, onClose, theme }) => {
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [mode, setMode] = useState('date'); // 'date' or 'time'
  const [currentMonth, setCurrentMonth] = useState(date ? date.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(date ? date.getFullYear() : new Date().getFullYear());

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [date, visible]);

  // Get days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
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

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day, selectedDate.getHours(), selectedDate.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const handleTimeChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(parseInt(value));
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value));
    }
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onDateChange(selectedDate);
    onClose();
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 16,
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerText: {
      fontSize: 18,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    modeToggleContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modeButtonActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    modeButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
    },
    modeButtonTextActive: {
      color: '#FFFFFF',
    },
    // Calendar styles
    monthYearHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    monthYearText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    navButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navButtonText: {
      fontSize: 18,
      color: theme.primary,
    },
    dayNamesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    dayNameCell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
    },
    dayNameText: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
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
      borderRadius: 8,
      marginBottom: 4,
    },
    dayCellText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
    },
    dayCellSelected: {
      backgroundColor: theme.accent,
    },
    dayCellSelectedText: {
      color: '#FFFFFF',
      fontFamily: 'Nunito-SemiBold',
    },
    dayCellDisabled: {
      backgroundColor: 'transparent',
    },
    dayCellDisabledText: {
      color: theme.border,
    },
    dayCellToday: {
      borderWidth: 2,
      borderColor: theme.accent,
    },
    // Time styles
    timeContainer: {
      marginBottom: 16,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 16,
      marginBottom: 16,
    },
    timeColumn: {
      flex: 1,
    },
    timeLabel: {
      fontSize: 12,
      fontFamily: 'Nunito-SemiBold',
      color: theme.secondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    timePicker: {
      height: 150,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.background,
      overflow: 'hidden',
    },
    timePickerItem: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timePickerItemText: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    timePickerItemActive: {
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    selectedDisplay: {
      backgroundColor: theme.background,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginBottom: 16,
      alignItems: 'center',
    },
    selectedText: {
      fontSize: 16,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 4,
    },
    selectedSubText: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.accent,
      alignItems: 'center',
    },
    confirmButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: '#FFFFFF',
    },
  });

  const formatDate = (d) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderCalendar = () => {
    const today = new Date();
    const isToday = (day) => {
      return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    };

    const isSelected = (day) => {
      return day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
    };

    return (
      <View>
        <View style={styles.monthYearHeader}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
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
          {dayNames.map((dayName) => (
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

    return (
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Hour</Text>
            <ScrollView
              style={styles.timePicker}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              {hours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.timePickerItem,
                    currentHour === hour && { backgroundColor: `${theme.accent}20` },
                  ]}
                  onPress={() => handleTimeChange('hour', hour)}
                >
                  <Text
                    style={[
                      styles.timePickerItemText,
                      currentHour === hour && styles.timePickerItemActive,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Minute</Text>
            <ScrollView
              style={styles.timePicker}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={minute}
                  style={[
                    styles.timePickerItem,
                    currentMinute === minute && { backgroundColor: `${theme.accent}20` },
                  ]}
                  onPress={() => handleTimeChange('minute', minute)}
                >
                  <Text
                    style={[
                      styles.timePickerItemText,
                      currentMinute === minute && styles.timePickerItemActive,
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.pickerContainer}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {mode === 'date' ? 'Select Date' : 'Select Time'}
            </Text>
          </View>

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

          <View style={styles.selectedDisplay}>
            <Text style={styles.selectedText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.selectedSubText}>{formatTime(selectedDate)}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300, marginBottom: 16 }}>
            {mode === 'date' ? renderCalendar() : renderTimePicker()}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
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
