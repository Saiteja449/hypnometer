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

const { width } = Dimensions.get('window');

const NewSessionScreen = ({ navigation }) => {
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

  const sessionTypes = [
    { id: 'anxiety', name: 'Anxiety', color: '#FF6B6B' },
    { id: 'confidence', name: 'Confidence', color: '#4ECDC4' },
    { id: 'regression', name: 'Regression', color: '#45B7D1' },
    { id: 'smoking', name: 'Smoking', color: '#96CEB4' },
    { id: 'weight_loss', name: 'Weight Loss', color: '#FFEAA7' },
    { id: 'sleep', name: 'Sleep', color: '#DDA0DD' },
    { id: 'stress', name: 'Stress', color: '#A78BFA' },
    { id: 'phobias', name: 'Phobias', color: '#F59E0B' },
    { id: 'performance', name: 'Performance', color: '#10B981' },
    { id: 'habits', name: 'Habits', color: '#8B5CF6' },
    { id: 'other', name: 'Other', color: '#8641f4' },
  ];

  // SVG Icons for Session Types (unchanged)
  const AnxietyIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12H15M9 16H15M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ConfidenceIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const RegressionIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const SmokingIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const WeightIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const SleepIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const PainIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const StressIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const PhobiaIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const PerformanceIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const HabitsIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const OtherIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

  const getSessionIcon = type => {
    const icons = {
      Anxiety: <AnxietyIcon />,
      Confidence: <ConfidenceIcon />,
      Regression: <RegressionIcon />,
      Smoking: <SmokingIcon />,
      'Weight Loss': <WeightIcon />,
      Sleep: <SleepIcon />,
      'Pain Management': <PainIcon />,
      Stress: <StressIcon />,
      Phobias: <PhobiaIcon />,
      Performance: <PerformanceIcon />,
      Habits: <HabitsIcon />,
      Other: <OtherIcon />,
    };
    return icons[type] || <OtherIcon />;
  };

  // Custom Radio Button Component
  const RadioButton = ({ item, selected, onSelect }) => (
    <TouchableOpacity
      style={[styles.radioButton, selected && [styles.radioButtonSelected]]}
      onPress={() => onSelect(item.name)}
    >
      <View style={styles.radioContent}>
        <View style={[styles.radioIconContainer, { color: item.color }]}>
          {getSessionIcon(item.name)}
        </View>
        <Text style={[styles.radioText, selected && styles.radioTextSelected]}>
          {item.name}
        </Text>
      </View>

      {/* Custom Radio Circle */}
      <View style={styles.radioCircle}>
        {selected && (
          <View
            style={[styles.radioInnerCircle, { backgroundColor: item.color }]}
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

  // Validation function
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

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSessionData({ ...sessionData, date: selectedDate });
    }
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(sessionData.date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setSessionData({ ...sessionData, date: newDate });
    }
  };

  // Format date for display
  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Handle recording upload
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

  // Remove recording
  const removeRecording = () => {
    setSessionData({ ...sessionData, recording: null });
  };

  // Create session
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

  // Existing SVG Icons (Calendar, Clock, Audio, Video, Delete)
  const CalendarIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ClockIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M12 6V12L16 14"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const AudioIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C13.66 1 15 2.34 15 4V12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12V4C9 2.34 10.34 1 12 1Z"
        stroke="#4ECDC4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10"
        stroke="#4ECDC4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19V23"
        stroke="#4ECDC4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 23H16"
        stroke="#4ECDC4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const VideoIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 7L16 12L23 17V7Z"
        stroke="#FF6B6B"
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
        stroke="#FF6B6B"
        strokeWidth="2"
      />
    </Svg>
  );

  const DeleteIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke="#ff4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader
        title="Create A New Session"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Track your hypnotherapy sessions and get feedback
          </Text>
        </View>

        {/* Session Title */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Title *</Text>
          <TextInput
            style={[styles.textInput, errors.title && styles.inputError]}
            placeholder="e.g., Anxiety"
            value={sessionData.title}
            onChangeText={text => {
              setSessionData({ ...sessionData, title: text });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.charCount}>{sessionData.title.length}/100</Text>
        </View>

        {/* Session Type - Custom Radio Buttons */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Type *</Text>
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

          <View style={styles.radioGrid}>
            {sessionTypes.map(item => (
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

        {/* Client Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Client Name (Optional)</Text>
          <TextInput
            style={[styles.textInput, errors.clientName && styles.inputError]}
            placeholder="Enter client name"
            value={sessionData.clientName}
            onChangeText={text => {
              setSessionData({ ...sessionData, clientName: text });
              if (errors.clientName) setErrors({ ...errors, clientName: '' });
            }}
            maxLength={50}
          />
          {errors.clientName && (
            <Text style={styles.errorText}>{errors.clientName}</Text>
          )}
          <Text style={styles.charCount}>
            {sessionData.clientName.length}/50
          </Text>
        </View>

        {/* Date & Time */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Date & Time</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon />
              <Text style={styles.datetimeText}>
                {formatDate(sessionData.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <ClockIcon />
              <Text style={styles.datetimeText}>
                {formatTime(sessionData.date)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metaphor Theme */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Metaphor Theme (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Beach relaxation, Forest journey"
            value={sessionData.metaphorTheme}
            onChangeText={text =>
              setSessionData({ ...sessionData, metaphorTheme: text })
            }
            maxLength={60}
          />
          <Text style={styles.charCount}>
            {sessionData.metaphorTheme.length}/60
          </Text>
        </View>

        {/* Session Notes */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Notes (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Add any notes about the session, techniques used, client responses, etc."
            value={sessionData.notes}
            onChangeText={text =>
              setSessionData({ ...sessionData, notes: text })
            }
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{sessionData.notes.length}/1000</Text>
        </View>

        {/* Recording Upload */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Recording</Text>
          <Text style={styles.recordingSubtitle}>
            Files auto-delete after 24 hours for privacy
          </Text>

          {!sessionData.recording ? (
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={[styles.uploadButton, styles.audioButton]}
                onPress={() => handleRecordingUpload('audio')}
                disabled={uploading}
              >
                <AudioIcon />
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadText}>Upload Audio</Text>
                  <Text style={styles.uploadSubtext}>MP3, WAV</Text>
                </View>
                {uploading && (
                  <Text style={styles.uploadingText}>Uploading...</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, styles.videoButton]}
                onPress={() => handleRecordingUpload('video')}
                disabled={uploading}
              >
                <VideoIcon />
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadText}>Upload Video</Text>
                  <Text style={styles.uploadSubtext}>MP4, MOV</Text>
                </View>
                {uploading && (
                  <Text style={styles.uploadingText}>Uploading...</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.recordingAdded}>
              <View style={styles.recordingInfo}>
                <View
                  style={{
                    color:
                      sessionData.recording.type === 'audio'
                        ? '#4ECDC4'
                        : '#FF6B6B',
                  }}
                >
                  {sessionData.recording.type === 'audio' ? (
                    <AudioIcon />
                  ) : (
                    <VideoIcon />
                  )}
                </View>
                <View style={styles.recordingDetails}>
                  <Text style={styles.recordingName}>
                    {sessionData.recording.file.name}
                  </Text>
                  <Text style={styles.recordingSize}>
                    {(sessionData.recording.file.size / 1024 / 1024).toFixed(1)}{' '}
                    MB • Auto-deletes{' '}
                    {sessionData.recording.willDeleteAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeRecordingButton}
                onPress={removeRecording}
              >
                <DeleteIcon />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              (!sessionData.title || !sessionData.type) &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreateSession}
            disabled={!sessionData.title || !sessionData.type}
          >
            <Text style={styles.createButtonText}>Create Session</Text>
          </TouchableOpacity>
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Text style={styles.infoText}>
            💡 After creating the session, you'll get a feedback link to share
            with your client. The link expires in 24 hours to ensure timely
            feedback.
          </Text>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={sessionData.date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={sessionData.date}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

// Complete Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    marginTop: 6,
    marginLeft: 4,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 6,
  },
  notesInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // Custom Radio Button Styles
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    minWidth: (width - 60) / 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  radioButtonSelected: {
    borderColor: '#8641f4',
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioIconContainer: {
    marginRight: 4,
  },
  radioText: {
    fontSize: 13,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
  },
  radioTextSelected: {
    color: '#1F2937',
    fontFamily: 'Nunito-SemiBold',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Date & Time Styles
  datetimeContainer: {
    gap: 12,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  datetimeText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#374151',
  },

  // Recording Upload Styles
  recordingSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  audioButton: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FDFA',
  },
  videoButton: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FEF2F2',
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
  },
  uploadingText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
  },
  recordingAdded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordingDetails: {
    flex: 1,
  },
  recordingName: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  recordingSize: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  removeRecordingButton: {
    padding: 4,
  },

  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
  },
  createButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8641f4',
    alignItems: 'center',
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0.1,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },

  // Info Footer Styles
  infoFooter: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#1E40AF',
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
});

export default NewSessionScreen;
