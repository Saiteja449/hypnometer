import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import CustomHeader from '../Components/CustomHeader';

import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '../Context/ThemeContext';
import ClockIcon from '../Icons/ClockIcon';

const { width } = Dimensions.get('window');

const SessionTypes = [
  { id: 'anxiety', name: 'Anxiety', color: '#FF6B6B' },
  { id: 'confidence', name: 'Confidence', color: '#4ECDC4' },
  { id: 'regression', name: 'Regression', color: '#45B7D1' },
  { id: 'smoking', name: 'Smoking', color: '#96CEB4' },
  { id: 'weight_loss', name: 'Weight Loss', color: '#F7B731' },
  { id: 'sleep', name: 'Sleep', color: '#A78BFA' },
  { id: 'stress', name: 'Stress', color: '#8B5CF6' },
  { id: 'phobias', name: 'Phobias', color: '#F59E0B' },
  { id: 'performance', name: 'Performance', color: '#10B981' },
  { id: 'habits', name: 'Habits', color: '#DDA0DD' },
  { id: 'other', name: 'Other', color: '#8641f4' },
];

const NewSessionScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();

  const [sessionData, setSessionData] = useState({
    title: '',
    type: '',
    clientName: '',
    date: new Date(),
    notes: '',
    metaphorTheme: '',
    recording: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const dynamicStyles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 30,
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 300,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 15,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    inputError: {
      borderColor: theme.danger,
      backgroundColor: isDark ? '#3E2D2D' : '#FEF2F2',
    },
    errorText: {
      color: theme.danger,
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 6,
      marginLeft: 4,
    },
    charCount: {
      fontSize: 12,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'right',
      marginTop: 6,
    },
    notesInput: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    radioGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 10,
      minWidth: (width - 50) / 2,
      marginBottom: 0,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    radioButtonSelected: {
      borderColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    radioContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    radioText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      marginLeft: 6,
    },
    radioTextSelected: {
      color: theme.primary,
      fontFamily: 'Nunito-SemiBold',
    },
    radioCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    radioInnerCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
    },
    datetimeContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    datetimeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    datetimeText: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.primary,
    },
    recordingSubtitle: {
      fontSize: 12,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 12,
      fontStyle: 'italic',
    },
    uploadOptions: {
      flexDirection: 'row',
      gap: 10,
    },
    uploadButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 16,
      borderWidth: 2,
      borderStyle: 'dashed',
      gap: 10,
    },
    audioButton: {
      borderColor: SessionTypes.find(t => t.id === 'confidence').color,
      backgroundColor: isDark ? '#1C2E2E' : '#F0FDFA',
    },
    videoButton: {
      borderColor: SessionTypes.find(t => t.id === 'anxiety').color,
      backgroundColor: isDark ? '#3C2525' : '#FEF2F2',
    },
    uploadTextContainer: {
      flex: 1,
    },
    uploadText: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 2,
    },
    uploadSubtext: {
      fontSize: 11,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
    },
    uploadingText: {
      fontSize: 12,
      fontFamily: 'Nunito-Bold',
      color: theme.accent,
    },
    recordingAdded: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    recordingInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    recordingDetails: {
      flex: 1,
    },
    recordingName: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    recordingSize: {
      fontSize: 11,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginTop: 2,
    },
    removeRecordingButton: {
      padding: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
      marginBottom: 16,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.card,
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    cancelButtonText: {
      fontSize: 15,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    createButtonGradient: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: 'center',
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    createButtonText: {
      fontSize: 15,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    createButtonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    infoFooter: {
      padding: 14,
      backgroundColor: isDark ? '#1F2937' : '#E0F2F1',
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.success,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 12,
      fontFamily: 'Nunito-Regular',
      color: isDark ? '#E5E7EB' : '#0F766E',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 10,
    },
  });

  const CalendarIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const AudioIcon = ({
    color = SessionTypes.find(t => t.id === 'confidence').color,
  }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C13.66 1 15 2.34 15 4V12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12V4C9 2.34 10.34 1 12 1Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19V23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 23H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const VideoIcon = ({
    color = SessionTypes.find(t => t.id === 'anxiety').color,
  }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 7L16 12L23 17V7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="1"
        y="5"
        width="15"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  const DeleteIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={theme.danger}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const AnxietyIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 12H15M9 16H15M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
  const ConfidenceIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Svg>
  );
  const RegressionIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 12H21M12 3V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M7 7L17 17M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const SmokingIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17 8C17 8 15 6 12 6C9 6 7 8 7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M17 12C17 12 15 10 12 10C9 10 7 12 7 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M17 16C17 16 15 14 12 14C9 14 7 16 7 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const WeightIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const SleepIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M9 10H15M9 14H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const PainIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M15 9L9 15M9 9L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const StressIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M12 8V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const PhobiaIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M15 9L9 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M9 9L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
  const PerformanceIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
  const HabitsIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M12 8V12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
  const OtherIcon = props => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Path
        d="M12 8V16M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const getBaseIcon = IconComponent => <IconComponent />;

  const getSessionIcon = type => {
    const icons = {
      Anxiety: getBaseIcon(AnxietyIcon),
      Confidence: getBaseIcon(ConfidenceIcon),
      Regression: getBaseIcon(RegressionIcon),
      Smoking: getBaseIcon(SmokingIcon),
      'Weight Loss': getBaseIcon(WeightIcon),
      Sleep: getBaseIcon(SleepIcon),
      'Pain Management': getBaseIcon(PainIcon),
      Stress: getBaseIcon(StressIcon),
      Phobias: getBaseIcon(PhobiaIcon),
      Performance: getBaseIcon(PerformanceIcon),
      Habits: getBaseIcon(HabitsIcon),
      Other: getBaseIcon(OtherIcon),
    };
    return icons[type] || getBaseIcon(OtherIcon);
  };

  const RadioButton = ({ item, selected, onSelect }) => {
    const iconColor = item.color;

    return (
      <TouchableOpacity
        style={[
          dynamicStyles.radioButton,
          selected && dynamicStyles.radioButtonSelected,
          selected && { borderColor: iconColor },
        ]}
        onPress={() => onSelect(item.name)}
      >
        <View style={dynamicStyles.radioContent}>
          <View
            style={[dynamicStyles.radioIconContainer, { color: iconColor }]}
          >
            {getSessionIcon(item.name)}
          </View>
          <Text
            style={[
              dynamicStyles.radioText,
              selected && dynamicStyles.radioTextSelected,
            ]}
          >
            {item.name}
          </Text>
        </View>

        <View
          style={[
            dynamicStyles.radioCircle,
            selected && { borderColor: iconColor },
          ]}
        >
          {selected && (
            <View
              style={[
                dynamicStyles.radioInnerCircle,
                { backgroundColor: iconColor },
              ]}
            >
              <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17L4 12"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!sessionData.title.trim()) {
      newErrors.title = 'Session title is required';
    } else if (sessionData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!sessionData.type) {
      newErrors.type = 'Please select a session type';
    }

    if (sessionData.clientName && sessionData.clientName.trim().length < 2) {
      newErrors.clientName = 'Client name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSessionData({ ...sessionData, date: selectedDate });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(sessionData.date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setSessionData({ ...sessionData, date: newDate });
    }
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleRecordingUpload = async type => {
    setUploading(true);
    try {
      Alert.alert(
        `Upload ${type === 'audio' ? 'Audio' : 'Video'}`,
        `Choose ${type} file to upload (will auto-delete after 24 hours)`,
        [
          {
            text: 'Choose from Library',
            onPress: () => simulateFilePick(type),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload recording');
    } finally {
      setUploading(false);
    }
  };

  const simulateFilePick = type => {
    const fakeFile = {
      uri: `file://fake_${type}_recording.${type === 'audio' ? 'mp3' : 'mp4'}`,
      name: `session_recording.${type === 'audio' ? 'mp3' : 'mp4'}`,
      type: `${type}/${type === 'audio' ? 'mpeg' : 'mp4'}`,
      size: 1024000,
    };

    setSessionData({
      ...sessionData,
      recording: {
        file: fakeFile,
        type: type,
        uploadTime: new Date(),
        willDeleteAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    Alert.alert(
      'Success',
      `${
        type === 'audio' ? 'Audio' : 'Video'
      } recording added! It will auto-delete in 24 hours.`,
    );
  };

  const removeRecording = () => {
    setSessionData({ ...sessionData, recording: null });
  };

  const handleCreateSession = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting',
      );
      return;
    }

    try {
      const sessionToCreate = {
        title: sessionData.title.trim(),
        type: sessionData.type,
        clientName: sessionData.clientName.trim(),
        date: sessionData.date.toISOString(),
        notes: sessionData.notes.trim(),
        metaphorTheme: sessionData.metaphorTheme.trim(),
        recording: sessionData.recording,
        status: 'pending-feedback',
      };

      console.log('Creating session:', sessionToCreate);

      const mockResponse = {
        success: true,
        session: {
          id: Math.random().toString(36).substr(2, 9),
          ...sessionToCreate,
          feedbackLink: `https://hypnometer.com/rate/${Math.random()
            .toString(36)
            .substr(2, 16)}`,
          createdAt: new Date().toISOString(),
        },
      };

      if (mockResponse.success) {
        Alert.alert(
          'Session Created Successfully! 🎉',
          `Your session has been logged. A 24-hour feedback link has been generated.`,
          [
            {
              text: 'View Session',
              onPress: () =>
                navigation.navigate('SessionDetail', {
                  sessionId: mockResponse.session.id,
                }),
            },
            {
              text: 'Share Feedback Link',
              onPress: () => {
                console.log('Share link:', mockResponse.session.feedbackLink);
                Alert.alert(
                  'Share Link',
                  `Feedback link: ${mockResponse.session.feedbackLink}`,
                );
              },
            },
            {
              text: 'OK',
              style: 'default',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create session. Please try again.');
      console.error('Session creation error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={dynamicStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader
        title="Create A New Session"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={dynamicStyles.screenContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.subtitle}>
            Track your hypnotherapy sessions and get client feedback.
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Title *</Text>
          <TextInput
            style={[
              dynamicStyles.textInput,
              errors.title && dynamicStyles.inputError,
            ]}
            placeholder="e.g., Anxiety Breakthrough"
            placeholderTextColor={theme.secondary}
            value={sessionData.title}
            onChangeText={text => {
              setSessionData({ ...sessionData, title: text });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            maxLength={100}
          />
          {errors.title && (
            <Text style={dynamicStyles.errorText}>{errors.title}</Text>
          )}
          <Text style={dynamicStyles.charCount}>
            {sessionData.title.length}/100
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Type *</Text>
          {errors.type && (
            <Text style={dynamicStyles.errorText}>{errors.type}</Text>
          )}

          <View style={dynamicStyles.radioGrid}>
            {SessionTypes.map(item => (
              <RadioButton
                key={item.id}
                item={item}
                selected={sessionData.type === item.name}
                onSelect={type => {
                  setSessionData({ ...sessionData, type });
                  if (errors.type) setErrors({ ...errors, type: '' });
                }}
              />
            ))}
          </View>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Client Name (Optional)</Text>
          <TextInput
            style={[
              dynamicStyles.textInput,
              errors.clientName && dynamicStyles.inputError,
            ]}
            placeholder="Enter client name"
            placeholderTextColor={theme.secondary}
            value={sessionData.clientName}
            onChangeText={text => {
              setSessionData({ ...sessionData, clientName: text });
              if (errors.clientName) setErrors({ ...errors, clientName: '' });
            }}
            maxLength={50}
          />
          {errors.clientName && (
            <Text style={dynamicStyles.errorText}>{errors.clientName}</Text>
          )}
          <Text style={dynamicStyles.charCount}>
            {sessionData.clientName.length}/50
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Date & Time</Text>
          <View style={dynamicStyles.datetimeContainer}>
            <TouchableOpacity
              style={dynamicStyles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon />
              <Text style={dynamicStyles.datetimeText}>
                {formatDate(sessionData.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.datetimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <ClockIcon size={20} />
              <Text style={dynamicStyles.datetimeText}>
                {formatTime(sessionData.date)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Metaphor Theme (Optional)</Text>
          <TextInput
            style={dynamicStyles.textInput}
            placeholder="e.g., Beach relaxation, Forest journey"
            placeholderTextColor={theme.secondary}
            value={sessionData.metaphorTheme}
            onChangeText={text =>
              setSessionData({ ...sessionData, metaphorTheme: text })
            }
            maxLength={60}
          />
          <Text style={dynamicStyles.charCount}>
            {sessionData.metaphorTheme.length}/60
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Notes (Optional)</Text>
          <TextInput
            style={[dynamicStyles.textInput, dynamicStyles.notesInput]}
            placeholder="Add any notes about the session, techniques used, client responses, etc."
            placeholderTextColor={theme.secondary}
            value={sessionData.notes}
            onChangeText={text =>
              setSessionData({ ...sessionData, notes: text })
            }
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={dynamicStyles.charCount}>
            {sessionData.notes.length}/1000
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Recording</Text>
          <Text style={dynamicStyles.recordingSubtitle}>
            Files auto-delete after 24 hours for privacy
          </Text>

          {!sessionData.recording ? (
            <View style={dynamicStyles.uploadOptions}>
              <TouchableOpacity
                style={[dynamicStyles.uploadButton, dynamicStyles.audioButton]}
                onPress={() => handleRecordingUpload('audio')}
                disabled={uploading}
              >
                <AudioIcon
                  color={SessionTypes.find(t => t.id === 'confidence').color}
                />
                <View style={dynamicStyles.uploadTextContainer}>
                  <Text style={dynamicStyles.uploadText}>Upload Audio</Text>
                  <Text style={dynamicStyles.uploadSubtext}>MP3, WAV</Text>
                </View>
                {uploading && (
                  <Text style={dynamicStyles.uploadingText}>Uploading...</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[dynamicStyles.uploadButton, dynamicStyles.videoButton]}
                onPress={() => handleRecordingUpload('video')}
                disabled={uploading}
              >
                <VideoIcon
                  color={SessionTypes.find(t => t.id === 'anxiety').color}
                />
                <View style={dynamicStyles.uploadTextContainer}>
                  <Text style={dynamicStyles.uploadText}>Upload Video</Text>
                  <Text style={dynamicStyles.uploadSubtext}>MP4, MOV</Text>
                </View>
                {uploading && (
                  <Text style={dynamicStyles.uploadingText}>Uploading...</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={dynamicStyles.recordingAdded}>
              <View style={dynamicStyles.recordingInfo}>
                <View
                  style={{
                    color:
                      sessionData.recording.type === 'audio'
                        ? SessionTypes.find(t => t.id === 'confidence').color
                        : SessionTypes.find(t => t.id === 'anxiety').color,
                  }}
                >
                  {sessionData.recording.type === 'audio' ? (
                    <AudioIcon
                      color={
                        SessionTypes.find(t => t.id === 'confidence').color
                      }
                    />
                  ) : (
                    <VideoIcon
                      color={SessionTypes.find(t => t.id === 'anxiety').color}
                    />
                  )}
                </View>
                <View style={dynamicStyles.recordingDetails}>
                  <Text style={dynamicStyles.recordingName}>
                    {sessionData.recording.file.name}
                  </Text>
                  <Text style={dynamicStyles.recordingSize}>
                    {(sessionData.recording.file.size / 1024 / 1024).toFixed(1)}{' '}
                    MB • Auto-deletes{' '}
                    {sessionData.recording.willDeleteAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={dynamicStyles.removeRecordingButton}
                onPress={removeRecording}
              >
                <DeleteIcon />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={dynamicStyles.buttonContainer}>
          <TouchableOpacity
            style={dynamicStyles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={['#8B5CF6', '#8641f4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                dynamicStyles.createButtonGradient,
                (!sessionData.title || !sessionData.type) &&
                  dynamicStyles.createButtonDisabled,
              ]}
            >
              <TouchableOpacity
                onPress={handleCreateSession}
                disabled={!sessionData.title || !sessionData.type}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingVertical: 0,
                }}
              >
                <Text style={dynamicStyles.createButtonText}>
                  Create Session
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={dynamicStyles.infoFooter}>
          <Text style={dynamicStyles.infoText}>
            💡 After creating the session, you'll get a feedback link to share
            with your client. The link expires in 24 hours to ensure timely
            feedback.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={showDatePicker} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.pickerContainer}>
                <DateTimePicker
                  value={sessionData.date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  textColor={theme.primary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showTimePicker} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.pickerContainer}>
                <DateTimePicker
                  value={sessionData.date}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                  textColor={theme.primary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default NewSessionScreen;
