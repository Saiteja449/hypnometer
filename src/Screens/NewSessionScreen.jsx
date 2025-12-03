import React, { useState, useMemo } from 'react';
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

// Assuming these imports are correct based on the original code structure
import CustomHeader from '../Components/CustomHeader';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import CustomDateTimePicker from '../Components/CustomDateTimePicker';
import ClockIcon from '../Icons/ClockIcon';
import CalendarIcon from '../Icons/CalendarIcon';
import LinearGradient from 'react-native-linear-gradient';
import SuccessIcon from '../Icons/SuccessIcon';
import InsightIcon from '../Icons/InsightIcon';

// --- Static Values ---
const SESSION_TYPES = [
  'Anxiety',
  'Confidence',
  'Regression',
  'Sleep',
  'Pain Management',
  'Smoking Cessation',
  'Other',
];

// --- Custom Stylesheet Creation Function ---
const createStyles = (theme, isDark) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Nunito-Medium',
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 350,
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
    requiredLabel: {
      color: theme.danger,
    },
    textInput: {
      backgroundColor: isDark ? theme.card : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#E5E7EB',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
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
      marginTop: 4,
    },
    notesInput: {
      minHeight: 140,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    radioRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: isDark ? theme.card : '#F3F4F6',
      borderWidth: 1,
      borderColor: theme.border,
    },
    radioItemSelected: {
      borderColor: theme.accent,
      backgroundColor: isDark ? '#3A305D' : '#F1F0FF',
    },
    radioLabel: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    datetimeContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    datetimeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? theme.card : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#E5E7EB',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 10,
    },
    datetimeText: {
      fontSize: 15,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
      marginBottom: 20,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: isDark ? theme.card : '#F3F4F6',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#E5E7EB',
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    createButtonGradient: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    createButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    createButtonDisabled: {
      opacity: 0.6,
      shadowOpacity: 0,
      elevation: 0,
    },
    infoFooter: {
      padding: 16,
      backgroundColor: isDark ? '#16222C' : '#ECFDF5',
      borderRadius: 10,
      borderLeftWidth: 4,
      borderLeftColor: theme.success,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontFamily: 'Nunito-Regular',
      color: isDark ? '#E5E7EB' : '#047857',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    resultContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 30,
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center',
    },
    resultTitle: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginBottom: 10,
      textAlign: 'center',
    },
    resultMessage: {
      fontSize: 15,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtonRow: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
    },
    modalCancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      minWidth: 120,
      alignItems: 'center',
      backgroundColor: isDark ? theme.card : '#F3F4F6',
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalConfirmButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      minWidth: 120,
      alignItems: 'center',
      backgroundColor: '#8B5CF6',
    },
    modalButtonTextPrimary: {
      color: theme.primary,
      fontFamily: 'Nunito-Bold',
    },
    modalButtonTextLight: {
      color: '#fff',
      fontFamily: 'Nunito-Bold',
    },
    processingOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    processingContainer: {
      backgroundColor: theme.card,
      padding: 30,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    emailInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    emailInput: {
      flex: 1,
    },
    addButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Nunito-Bold',
      fontSize: 16,
    },
    emailList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    emailTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? theme.card : '#E5E7EB',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 8,
    },
    emailTagText: {
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
    },
    removeEmailText: {
      fontFamily: 'Nunito-Bold',
      color: theme.secondary,
      fontSize: 16,
      lineHeight: 16,
    },
  });

// --- Modal Sub-Components ---

const ConfirmationModal = React.memo(
  ({
    visible,
    onClose,
    onConfirm,
    theme,
    styles,
    localLoading,
    appIsLoading,
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>📝 Confirm Session Details</Text>
              <Text style={styles.resultMessage}>
                Are you sure you want to create and log this session now?
              </Text>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalButtonTextPrimary}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  disabled={localLoading || appIsLoading}
                  style={styles.modalConfirmButton}
                >
                  <Text style={styles.modalButtonTextLight}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  ),
);

const ResultModal = React.memo(
  ({
    visible,
    onClose,
    resultTitle,
    resultMessage,
    resultActions,
    theme,
    styles,
  }) => {
    const isError =
      resultTitle.includes('Error') || resultTitle.includes('Failed');
    const iconColor = isError ? theme.danger : theme.success;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.resultContainer}>
                {isError ? (
                  <Text style={{ fontSize: 40, marginBottom: 15 }}>❌</Text>
                ) : (
                  <SuccessIcon
                    size={48}
                    color={iconColor}
                    style={{ alignSelf: 'center', marginBottom: 15 }}
                  />
                )}

                <Text style={styles.resultTitle}>{resultTitle}</Text>
                <Text style={styles.resultMessage}>{resultMessage}</Text>

                <View style={styles.modalButtonRow}>
                  {resultActions.map((act, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        onClose();
                        setTimeout(() => {
                          try {
                            act.onPress && act.onPress();
                          } catch (e) {
                            console.error('Modal action error', e);
                          }
                        }, 120);
                      }}
                      style={[
                        styles.modalConfirmButton,
                        idx > 0 && styles.modalCancelButton,
                        idx > 0 && {
                          backgroundColor: isError
                            ? theme.danger + '10'
                            : theme.card,
                          borderColor: isError ? theme.danger : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={
                          idx === 0
                            ? styles.modalButtonTextLight
                            : isError
                            ? { color: theme.danger, fontFamily: 'Nunito-Bold' }
                            : styles.modalButtonTextPrimary
                        }
                      >
                        {act.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

const ProcessingModal = React.memo(({ visible, theme, styles }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={() => {}}
  >
    <View style={styles.processingOverlay}>
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text
          style={{
            marginTop: 15,
            color: theme.primary,
            fontFamily: 'Nunito-SemiBold',
            fontSize: 16,
          }}
        >
          Processing Session...
        </Text>
      </View>
    </View>
  </Modal>
));

// --- Main Component ---
const NewSessionScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { userId, createSession, isLoading: appIsLoading } = useApp() || {};

  const [sessionData, setSessionData] = useState({
    title: '',
    selectedType: '',
    otherFocus: '',
    sessionVisibility: 'public',
    clientEmails: [],
    date: new Date(),
    sessionLink: '',
    notes: '',
    metaphorTheme: '',
  });
  const [currentEmail, setCurrentEmail] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [resultActions, setResultActions] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || sessionData.date;
    setShowDatePicker(Platform.OS === 'ios');
    setSessionData(prev => ({ ...prev, date: currentDate }));
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || sessionData.date;
    setShowTimePicker(Platform.OS === 'ios');
    // Combine date and time
    const newDate = new Date(sessionData.date);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    setSessionData(prev => ({ ...prev, date: newDate }));
  };

  const handleAddEmail = () => {
    const newEmail = currentEmail.trim();
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    if (newEmail && emailRegex.test(newEmail)) {
      if (!sessionData.clientEmails.includes(newEmail)) {
        setSessionData(prev => ({
          ...prev,
          clientEmails: [...prev.clientEmails, newEmail],
        }));
        setCurrentEmail('');
        if (errors.clientEmails) {
          setErrors(prev => ({ ...prev, clientEmails: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, clientEmails: 'Email already added.' }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        clientEmails: 'Please enter a valid email.',
      }));
    }
  };

  const handleRemoveEmail = index => {
    setSessionData(prev => ({
      ...prev,
      clientEmails: prev.clientEmails.filter((_, i) => i !== index),
    }));
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
    // Validate all fields except notes
    const newErrors = {};

    if (!sessionData.title.trim()) {
      newErrors.title = 'Session title is required';
    } else if (sessionData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!sessionData.selectedType) {
      newErrors.selectedType = 'Please select a session focus';
    } else if (
      sessionData.selectedType === 'Other' &&
      !sessionData.otherFocus.trim()
    ) {
      newErrors.otherFocus = 'Please specify the focus';
    }

    if (
      sessionData.sessionVisibility === 'private' &&
      sessionData.clientEmails.length === 0
    ) {
      newErrors.clientEmails =
        'At least one client email is required for private sessions';
    }

    if (!sessionData.sessionLink.trim()) {
      newErrors.sessionLink = 'Session link is required';
    } else if (!/^https?:\/\/\S+$/.test(sessionData.sessionLink)) {
      newErrors.sessionLink = 'Please enter a valid URL for the session link';
    }

    if (!sessionData.metaphorTheme.trim()) {
      newErrors.metaphorTheme = 'Metaphor theme is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setResultTitle('Validation Error');
      setResultMessage('Please fix the highlighted errors before submitting.');
      setResultActions([{ text: 'Review Form', onPress: () => {} }]);
      setResultModalVisible(true);
      return;
    }

    setLocalLoading(true);
    try {
      const sessionToCreate = {
        user_id: userId,
        title: sessionData.title.trim(),
        session_type:
          sessionData.selectedType === 'Other'
            ? sessionData.otherFocus.trim()
            : sessionData.selectedType,
        session_visibility: sessionData.sessionVisibility,
        client_emails: sessionData.clientEmails,
        session_link: sessionData.sessionLink.trim(),
        session_datetime: sessionData.date.toISOString(),
        notes: sessionData.notes.trim(),
        metaphor_theme: sessionData.metaphorTheme.trim(),
      };

      console.log('Result', sessionToCreate);

      const result = await createSession(sessionToCreate);

      if (result?.success) {
        setResultTitle('Session Created Successfully! 🌟');
        setResultMessage(
          result.message ||
            `Your session has been logged and the feedback link is ready.`,
        );
        setResultActions([
          {
            text: 'View Session',
            onPress: () =>
              navigation.navigate('SessionList', {
                sessionId: result.data?.id,
              }),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        setResultTitle('Creation Failed');
        setResultMessage(
          result?.message ||
            'Failed to create session due to a server error. Please try again.',
        );
        setResultActions([
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
      }
    } catch (error) {
      setResultTitle('Network Error');
      setResultMessage(
        'An unexpected network error occurred. Check your connection.',
      );
      setResultActions([
        {
          text: 'Close',
          onPress: () => {},
        },
      ]);
      console.error('Session creation error:', error);
    } finally {
      setLocalLoading(false);
      setResultModalVisible(true);
    }
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);
    setTimeout(() => {
      handleCreateSession();
    }, 120);
  };

  const isButtonDisabled =
    !sessionData.title.trim() ||
    !sessionData.selectedType ||
    (sessionData.selectedType === 'Other' && !sessionData.otherFocus.trim()) ||
    (sessionData.sessionVisibility === 'private' &&
      sessionData.clientEmails.length === 0) ||
    !sessionData.sessionLink.trim() ||
    !sessionData.metaphorTheme.trim() ||
    localLoading ||
    appIsLoading;

  const renderLabel = (label, isRequired = true) => (
    <Text style={styles.label}>
      {label} {isRequired && <Text style={styles.requiredLabel}>*</Text>}
    </Text>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader
        title="Create A New Session"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.screenContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Log your hypnotherapy sessions and instantly generate a feedback
            link for your client.
          </Text>
        </View>

        {/* --- 1. Session Title --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session Title')}
          <TextInput
            style={[styles.textInput, errors.title && styles.inputError]}
            placeholder="e.g., Anxiety Breakthrough"
            placeholderTextColor={theme.secondary}
            value={sessionData.title}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, title: text }));
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.charCount}>{sessionData.title.length}/100</Text>
        </View>

        {/* --- 2. Session Type (Radio Buttons) --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session Focus')}
          <View style={styles.radioRow}>
            {SESSION_TYPES.map(type => {
              const selected = sessionData.selectedType === type;
              const hasError = errors.selectedType;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.radioItem,
                    selected && styles.radioItemSelected,
                    hasError && styles.inputError,
                  ]}
                  onPress={() => {
                    setSessionData(prev => ({ ...prev, selectedType: type }));
                    if (errors.selectedType)
                      setErrors(prev => ({ ...prev, selectedType: '' }));
                  }}
                >
                  <Text
                    style={[
                      styles.radioLabel,
                      { color: selected ? theme.accent : theme.primary },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.selectedType && (
            <Text style={styles.errorText}>{errors.selectedType}</Text>
          )}
        </View>

        {/* Render "Other Focus" input if selected */}
        {sessionData.selectedType === 'Other' && (
          <View style={styles.inputContainer}>
            {renderLabel('Other Focus')}
            <TextInput
              style={[styles.textInput, errors.otherFocus && styles.inputError]}
              placeholder="Please specify the focus"
              placeholderTextColor={theme.secondary}
              value={sessionData.otherFocus}
              onChangeText={text => {
                setSessionData(prev => ({ ...prev, otherFocus: text }));
                if (errors.otherFocus)
                  setErrors(prev => ({ ...prev, otherFocus: '' }));
              }}
              maxLength={50}
            />
            {errors.otherFocus && (
              <Text style={styles.errorText}>{errors.otherFocus}</Text>
            )}
            <Text style={styles.charCount}>
              {sessionData.otherFocus.length}/50
            </Text>
          </View>
        )}

        {/* --- Session Visibility --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session Visibility')}
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={[
                styles.radioItem,
                sessionData.sessionVisibility === 'public' &&
                  styles.radioItemSelected,
              ]}
              onPress={() =>
                setSessionData(prev => ({
                  ...prev,
                  sessionVisibility: 'public',
                }))
              }
            >
              <Text
                style={[
                  styles.radioLabel,
                  {
                    color:
                      sessionData.sessionVisibility === 'public'
                        ? theme.accent
                        : theme.primary,
                  },
                ]}
              >
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioItem,
                sessionData.sessionVisibility === 'private' &&
                  styles.radioItemSelected,
              ]}
              onPress={() =>
                setSessionData(prev => ({
                  ...prev,
                  sessionVisibility: 'private',
                }))
              }
            >
              <Text
                style={[
                  styles.radioLabel,
                  {
                    color:
                      sessionData.sessionVisibility === 'private'
                        ? theme.accent
                        : theme.primary,
                  },
                ]}
              >
                Private
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Client Emails (if private) --- */}
        {sessionData.sessionVisibility === 'private' && (
          <View style={styles.inputContainer}>
            {renderLabel('Client Emails')}
            <View style={styles.emailInputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  styles.emailInput,
                  errors.clientEmails && styles.inputError,
                ]}
                placeholder="Enter client email"
                placeholderTextColor={theme.secondary}
                value={currentEmail}
                onChangeText={text => {
                  setCurrentEmail(text);
                  if (errors.clientEmails)
                    setErrors(prev => ({ ...prev, clientEmails: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddEmail}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {errors.clientEmails && (
              <Text style={styles.errorText}>{errors.clientEmails}</Text>
            )}

            <View style={styles.emailList}>
              {sessionData.clientEmails.map((email, index) => (
                <View key={index} style={styles.emailTag}>
                  <Text style={styles.emailTagText}>{email}</Text>
                  <TouchableOpacity onPress={() => handleRemoveEmail(index)}>
                    <Text style={styles.removeEmailText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- 4. Session Link --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session URL (Zoom/Meet)')}
          <TextInput
            style={[styles.textInput, errors.sessionLink && styles.inputError]}
            placeholder="e.g., https://zoom.us/j/1234567890"
            placeholderTextColor={theme.secondary}
            value={sessionData.sessionLink}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, sessionLink: text }));
              if (errors.sessionLink)
                setErrors(prev => ({ ...prev, sessionLink: '' }));
            }}
            keyboardType="url"
            autoCapitalize="none"
            maxLength={200}
          />
          {errors.sessionLink && (
            <Text style={styles.errorText}>{errors.sessionLink}</Text>
          )}
          <Text style={styles.charCount}>
            {sessionData.sessionLink.length}/200
          </Text>
        </View>

        {/* --- 5. Date & Time Picker --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session Date & Time')}
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={[styles.datetimeButton, errors.date && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon color={theme.accent} size={20} />
              <Text style={styles.datetimeText}>
                {formatDate(sessionData.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.datetimeButton, errors.date && styles.inputError]}
              onPress={() => setShowTimePicker(true)}
            >
              <ClockIcon size={20} color={theme.accent} />
              <Text style={styles.datetimeText}>
                {formatTime(sessionData.date)}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        {/* --- 6. Metaphor Theme --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Metaphor Theme')}
          <TextInput
            style={[
              styles.textInput,
              errors.metaphorTheme && styles.inputError,
            ]}
            placeholder="e.g., Beach relaxation, Forest journey"
            placeholderTextColor={theme.secondary}
            value={sessionData.metaphorTheme}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, metaphorTheme: text }));
              if (errors.metaphorTheme)
                setErrors(prev => ({ ...prev, metaphorTheme: '' }));
            }}
            maxLength={60}
          />
          {errors.metaphorTheme && (
            <Text style={styles.errorText}>{errors.metaphorTheme}</Text>
          )}
          <Text style={styles.charCount}>
            {sessionData.metaphorTheme.length}/60
          </Text>
        </View>

        {/* --- 7. Session Notes --- */}
        <View style={styles.inputContainer}>
          {renderLabel('Session Notes', false)}
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Add any notes about the session, techniques used, client responses, etc."
            placeholderTextColor={theme.secondary}
            value={sessionData.notes}
            onChangeText={text =>
              setSessionData(prev => ({ ...prev, notes: text }))
            }
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{sessionData.notes.length}/1000</Text>
        </View>

        {/* --- 8. Action Buttons --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={['#8B5CF6', '#8641f4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.createButtonGradient,
                isButtonDisabled && styles.createButtonDisabled,
              ]}
            >
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(true)}
                disabled={isButtonDisabled}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingVertical: 0,
                }}
              >
                <Text style={styles.createButtonText}>
                  {localLoading || appIsLoading
                    ? 'Processing...'
                    : 'Create Session'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* --- 9. Info Footer --- */}
        <View style={styles.infoFooter}>
          <InsightIcon color={theme.success} size={20} />
          <Text style={styles.infoText}>
            The session feedback link is generated immediately upon creation and
            will be available in the Session Detail view.
          </Text>
        </View>
      </ScrollView>

      {/* --- Modals --- */}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <CustomDateTimePicker
          visible={showDatePicker}
          date={sessionData.date}
          onChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
          theme={theme}
          mode="date"
          openstate={'date'}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <CustomDateTimePicker
          visible={showTimePicker}
          date={sessionData.date}
          onChange={onTimeChange}
          onClose={() => setShowTimePicker(false)}
          theme={theme}
          mode="time"
          openstate={'time'}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={handleConfirm}
        theme={theme}
        styles={styles}
        localLoading={localLoading}
        appIsLoading={appIsLoading}
      />

      {/* Result Modal */}
      <ResultModal
        visible={resultModalVisible}
        onClose={() => setResultModalVisible(false)}
        resultTitle={resultTitle}
        resultMessage={resultMessage}
        resultActions={resultActions}
        theme={theme}
        styles={styles}
      />

      {/* Processing Modal */}
      <ProcessingModal
        visible={localLoading || appIsLoading}
        theme={theme}
        styles={styles}
      />
    </KeyboardAvoidingView>
  );
};

export default NewSessionScreen;
