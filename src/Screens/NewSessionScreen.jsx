import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import CustomHeader from '../Components/CustomHeader';

import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import CustomDateTimePicker from '../Components/CustomDateTimePicker';
import ClockIcon from '../Icons/ClockIcon';
import CalendarIcon from '../Icons/CalendarIcon';
import LinearGradient from 'react-native-linear-gradient';

const NewSessionScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { userId, createSession, isLoading: appIsLoading } = useApp();

  const [sessionData, setSessionData] = useState({
    title: '',
    selectedType: '',
    clientName: '',
    date: new Date(),
    sessionLink: '',
    notes: '',
    metaphorTheme: '',
  });

  const SESSION_TYPES = [
    'Anxiety',
    'Confidence',
    'Regression',
    'Sleep',
    'Pain Management',
    'Smoking Cessation',
  ];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false); // For button specific loading
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [resultActions, setResultActions] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

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
      marginBottom: 8,
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
    radioRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 8,
    },
    radioOuter: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      backgroundColor: 'transparent',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.accent,
    },
    radioLabel: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
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
    resultContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      width: '100%',
      alignSelf: 'center',
    },
    processingOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.35)'
    },
    processingContainer: {
      backgroundColor: theme.card,
      padding: 18,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!sessionData.title.trim()) {
      newErrors.title = 'Session title is required';
    } else if (sessionData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Session types are optional multi-select; no validation required here

    if (sessionData.clientName && sessionData.clientName.trim().length < 2) {
      newErrors.clientName = 'Client name must be at least 2 characters';
    }

    if (
      sessionData.sessionLink &&
      !/^https?:\/\/\S+$/.test(sessionData.sessionLink)
    ) {
      newErrors.sessionLink = 'Please enter a valid URL for the session link';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDateChange = (selectedDate) => {
    if (selectedDate) {
      setSessionData({ ...sessionData, date: selectedDate });
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

  const handleCreateSession = async () => {
    if (!validateForm()) {
      setResultTitle('Validation Error');
      setResultMessage('Please fix the errors before submitting');
      setResultActions([
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
      setResultModalVisible(true);
      return;
    }

    setLocalLoading(true);
    try {
      const sessionToCreate = {
        user_id: userId, // Get from AppContext
        title: sessionData.title.trim(),
        session_type: sessionData.selectedType, // Added session_type field
        client_name: sessionData.clientName.trim(),
        session_link: sessionData.sessionLink.trim(),
        session_datetime: sessionData.date.toISOString(),
        notes: sessionData.notes.trim(),
        metaphor_theme: sessionData.metaphorTheme.trim(),
      };

      const result = await createSession(sessionToCreate);

      if (result.success) {
        setResultTitle('Session Created Successfully! 🎉');
        setResultMessage(result.message || `Your session has been logged.`);
        setResultActions([
          {
            text: 'View Session',
            onPress: () =>
              navigation.navigate('SessionDetail', {
                sessionId: result.data?.id,
              }),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        setResultModalVisible(true);
      } else {
        setResultTitle('Error');
        setResultMessage(result.message || 'Failed to create session. Please try again.');
        setResultActions([
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
        setResultModalVisible(true);
      }
    } catch (error) {
      setResultTitle('Error');
      setResultMessage('An unexpected error occurred during session creation.');
      setResultActions([
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
      setResultModalVisible(true);
      console.error('Session creation error:', error);
    } finally {
      setLocalLoading(false);
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
          <Text style={dynamicStyles.label}>Session Type</Text>
          <View style={dynamicStyles.radioRow}>
            {SESSION_TYPES.map(type => {
              const selected = sessionData.selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={dynamicStyles.radioItem}
                  onPress={() => {
                    setSessionData({ ...sessionData, selectedType: type });
                  }}
                >
                  <View style={dynamicStyles.radioOuter}>
                    {selected && <View style={dynamicStyles.radioInner} />}
                  </View>
                  <Text style={dynamicStyles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              );
            })}
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
          <Text style={dynamicStyles.label}>Session Link (Optional)</Text>
          <TextInput
            style={[
              dynamicStyles.textInput,
              errors.sessionLink && dynamicStyles.inputError,
            ]}
            placeholder="e.g., https://zoom.us/j/1234567890"
            placeholderTextColor={theme.secondary}
            value={sessionData.sessionLink}
            onChangeText={text => {
              setSessionData({ ...sessionData, sessionLink: text });
              if (errors.sessionLink) setErrors({ ...errors, sessionLink: '' });
            }}
            keyboardType="url"
            autoCapitalize="none"
            maxLength={200}
          />
          {errors.sessionLink && (
            <Text style={dynamicStyles.errorText}>{errors.sessionLink}</Text>
          )}
          <Text style={dynamicStyles.charCount}>
            {sessionData.sessionLink.length}/200
          </Text>
        </View>

        <View style={dynamicStyles.inputContainer}>
          <Text style={dynamicStyles.label}>Session Date & Time</Text>
          <View style={dynamicStyles.datetimeContainer}>
            <TouchableOpacity
              style={dynamicStyles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon color={theme.accent} size={20} />
              <Text style={dynamicStyles.datetimeText}>
                {formatDate(sessionData.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.datetimeButton}
              onPress={() => setShowDatePicker(true)} // Re-using date picker for time as well
            >
              <ClockIcon size={20} color={theme.accent} />
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
                (!sessionData.title || localLoading || appIsLoading) &&
                  dynamicStyles.createButtonDisabled,
              ]}
            >
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(true)}
                disabled={
                  !sessionData.title || localLoading || appIsLoading
                }
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingVertical: 0,
                }}
              >
                <Text style={dynamicStyles.createButtonText}>
                  {localLoading || appIsLoading
                    ? 'Creating...'
                    : 'Create Session'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={dynamicStyles.infoFooter}>
          <Text style={dynamicStyles.infoText}>
            💡 After creating the session, you'll get a feedback link to share
            with your client.
          </Text>
        </View>
      </ScrollView>

      {/* Custom date/time picker modal */}
      <CustomDateTimePicker
        visible={showDatePicker}
        date={sessionData.date}
        onDateChange={onDateChange}
        onClose={() => setShowDatePicker(false)}
        theme={theme}
      />

      {/* Confirmation modal before creating a session */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.resultContainer}>
                <Text style={{ fontSize: 18, fontFamily: 'Nunito-Bold', color: theme.primary, marginBottom: 8, textAlign: 'center' }}>
                  Confirm Create Session
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', color: theme.secondary, marginBottom: 16, textAlign: 'center' }}>
                  Are you sure you want to create this session now?
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => setConfirmModalVisible(false)}
                    style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, minWidth: 100, alignItems: 'center', backgroundColor: theme.card }}
                  >
                    <Text style={{ color: theme.primary, fontFamily: 'Nunito-SemiBold' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setConfirmModalVisible(false);
                      // small delay so modal dismiss animation completes
                      setTimeout(() => {
                        handleCreateSession();
                      }, 120);
                    }}
                    disabled={localLoading || appIsLoading}
                    style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, minWidth: 100, alignItems: 'center', backgroundColor: '#8B5CF6' }}
                  >
                    <Text style={{ color: '#fff', fontFamily: 'Nunito-SemiBold' }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Result modal for success/error messages */}
      <Modal
        visible={resultModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setResultModalVisible(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.resultContainer}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Nunito-Bold',
                    color: theme.primary,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  {resultTitle}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Nunito-Regular',
                    color: theme.secondary,
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  {resultMessage}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                  {resultActions && resultActions.length > 0
                    ? resultActions.map((act, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => {
                            setResultModalVisible(false);
                            setTimeout(() => {
                              try {
                                act.onPress && act.onPress();
                              } catch (e) {
                                console.error('Modal action error', e);
                              }
                            }, 120);
                          }}
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            minWidth: 100,
                            alignItems: 'center',
                            backgroundColor: idx === 0 ? '#8B5CF6' : theme.card,
                          }}
                        >
                          <Text style={{ color: idx === 0 ? '#fff' : theme.primary, fontFamily: 'Nunito-SemiBold' }}>
                            {act.text}
                          </Text>
                        </TouchableOpacity>
                      ))
                    : (
                      <TouchableOpacity
                        onPress={() => setResultModalVisible(false)}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          minWidth: 100,
                          alignItems: 'center',
                          backgroundColor: '#8B5CF6',
                        }}
                      >
                        <Text style={{ color: '#fff', fontFamily: 'Nunito-SemiBold' }}>OK</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Processing modal shown while API call is in progress */}
      <Modal
        visible={localLoading || appIsLoading}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <View style={dynamicStyles.processingOverlay}>
          <View style={dynamicStyles.processingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={{ marginTop: 12, color: theme.primary, fontFamily: 'Nunito-SemiBold' }}>
              Processing...
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default NewSessionScreen;
