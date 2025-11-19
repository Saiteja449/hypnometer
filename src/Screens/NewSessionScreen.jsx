import React, { useState, useCallback, useMemo } from 'react';
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
];

// --- Custom Stylesheet Creation Function (Optimized UI) ---
const createStyles = (theme, isDark) => StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // More breathing room at the bottom
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 14, // Slightly smaller
    fontFamily: 'Nunito-Medium',
    color: theme.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 350,
  },
  inputContainer: {
    marginBottom: 16, // Increased spacing between sections
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito-SemiBold',
    color: theme.primary,
    marginBottom: 8,
  },
  // ✨ Modern Input Style
  textInput: {
    backgroundColor: isDark ? theme.card : '#FFFFFF', // Lighter background for inputs in light mode
    borderWidth: 1,
    borderColor: isDark ? theme.border : '#E5E7EB', // Subtle border
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16, // Slightly larger font
    fontFamily: 'Nunito-Regular',
    color: theme.primary,
    // Removed unnecessary shadows for cleaner look
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
    minHeight: 140, // Taller notes field
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  // ✨ Enhanced Radio Button Row
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Increased gap
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: isDark ? theme.card : '#F3F4F6', // Light gray background
    borderWidth: 1,
    borderColor: theme.border,
    
  },
  radioItemSelected: {
    borderColor: theme.accent, // Highlight border
    backgroundColor: isDark ? '#3A305D' : '#F1F0FF', // Subtle background color when selected
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold', // Bolder label
    color: theme.primary,
  },
  // Hidden radio elements for cleaner UI (relying on background/border change)
  radioOuter: {
    display: 'none', // Hide default radio circle
  },
  
  datetimeContainer: {
    flexDirection: 'row',
    gap: 12, // Increased gap
  },
  // ✨ Modern Date/Time Button
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? theme.card : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDark ? theme.border : '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14, // Taller button
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
    marginTop: 20, // Increased spacing before buttons
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
  // ✨ Enhanced Info Footer
  infoFooter: {
    padding: 16,
    backgroundColor: isDark ? '#16222C' : '#ECFDF5', // Lighter success tone
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
    color: isDark ? '#E5E7EB' : '#047857', // Darker text for readability in light background
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Darker overlay
  },
  // ✨ Consistent Modal Card Style
  resultContainer: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24, // Smoother corners
    borderTopRightRadius: 24,
    padding: 30, // More spacious
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
    justifyContent: 'center' 
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
    backgroundColor: '#8B5CF6' 
  },
  modalButtonTextPrimary: { 
    color: theme.primary, 
    fontFamily: 'Nunito-Bold' 
  },
  modalButtonTextLight: { 
    color: '#fff', 
    fontFamily: 'Nunito-Bold' 
  },
  processingOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)'
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
});

// --- Modal Sub-Components (Cleaned up and using updated styles) ---

const ConfirmationModal = React.memo(({ visible, onClose, onConfirm, theme, styles, localLoading, appIsLoading }) => (
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
));

const ResultModal = React.memo(({ visible, onClose, resultTitle, resultMessage, resultActions, theme, styles }) => {
    const isError = resultTitle.includes('Error');
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
                            {/* Use the Icon based on result type */}
                            {isError ? (
                                <Text style={{ fontSize: 40, marginBottom: 15 }}>❌</Text> // Simple text icon for error
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
                                            idx > 0 && styles.modalCancelButton, // Secondary button style
                                            idx > 0 && {backgroundColor: isError ? theme.danger + '10' : theme.card, borderColor: isError ? theme.danger : theme.border}, // Error secondary style
                                        ]}
                                    >
                                        <Text style={idx === 0 ? styles.modalButtonTextLight : (isError ? {color: theme.danger, fontFamily: 'Nunito-Bold'} : styles.modalButtonTextPrimary)}>
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
});

const ProcessingModal = React.memo(({ visible, theme, styles }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade" // Changed to fade for smoother appearance
    onRequestClose={() => {}}
  >
    <View style={styles.processingOverlay}>
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={{ marginTop: 15, color: theme.primary, fontFamily: 'Nunito-SemiBold', fontSize: 16 }}>
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
    clientName: '',
    date: new Date(),
    sessionLink: '',
    notes: '',
    metaphorTheme: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [resultActions, setResultActions] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  
  // 🔑 Optimization: Memoize dynamic styles
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  // --- Helper Functions ---

  const validateForm = useCallback(() => {
    // ... (Validation logic remains the same)
    const newErrors = {};

    if (!sessionData.title.trim()) {
      newErrors.title = 'Session title is required';
    } else if (sessionData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

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
  }, [sessionData]);

  const onDateChange = useCallback((selectedDate) => {
    if (selectedDate) {
      setSessionData(prev => ({ ...prev, date: selectedDate }));
    }
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  const handleConfirm = useCallback(() => {
    setConfirmModalVisible(false);
    setTimeout(() => {
      handleCreateSession();
    }, 120);
  }, []);

  const handleCreateSession = useCallback(async () => {
    if (!validateForm()) {
      setResultTitle('Validation Error');
      setResultMessage('Please fix the highlighted errors before submitting.');
      setResultActions([
        {
          text: 'Review Form',
          onPress: () => {},
        },
      ]);
      setResultModalVisible(true);
      return;
    }

    setLocalLoading(true);
    try {
      const sessionToCreate = {
        user_id: userId,
        title: sessionData.title.trim(),
        session_type: sessionData.selectedType,
        client_name: sessionData.clientName.trim(),
        session_link: sessionData.sessionLink.trim(),
        session_datetime: sessionData.date.toISOString(),
        notes: sessionData.notes.trim(),
        metaphor_theme: sessionData.metaphorTheme.trim(),
      };

      const result = await createSession(sessionToCreate);

      if (result?.success) {
        setResultTitle('Session Created Successfully! 🌟');
        setResultMessage(result.message || `Your session has been logged and the feedback link is ready.`);
        setResultActions([
          {
            text: 'View Session',
            onPress: () =>
              navigation.navigate('SessionDetail', {
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
        setResultMessage(result?.message || 'Failed to create session due to a server error. Please try again.');
        setResultActions([
          {
            text: 'Try Again',
            onPress: () => {},
          },
        ]);
      }
    } catch (error) {
      setResultTitle('Network Error');
      setResultMessage('An unexpected network error occurred. Check your connection.');
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
  }, [validateForm, sessionData, userId, createSession, navigation]);

  const isButtonDisabled = !sessionData.title.trim() || localLoading || appIsLoading;

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
            Log your hypnotherapy sessions and instantly generate a feedback link for your client.
          </Text>
        </View>

        {/* --- 1. Session Title --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Title *</Text>
          <TextInput
            style={[
              styles.textInput,
              errors.title && styles.inputError,
            ]}
            placeholder="e.g., Anxiety Breakthrough"
            placeholderTextColor={theme.secondary}
            value={sessionData.title}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, title: text }));
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            maxLength={100}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
          <Text style={styles.charCount}>
            {sessionData.title.length}/100
          </Text>
        </View>

        {/* --- 2. Session Type (Radio Buttons) --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Focus</Text>
          <View style={styles.radioRow}>
            {SESSION_TYPES.map(type => {
              const selected = sessionData.selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.radioItem, selected && styles.radioItemSelected]}
                  onPress={() => {
                    setSessionData(prev => ({ ...prev, selectedType: type }));
                  }}
                >
                  <Text style={[styles.radioLabel, {color: selected ? theme.accent : theme.primary}]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* --- 3. Client Name --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Client Name (Optional)</Text>
          <TextInput
            style={[
              styles.textInput,
              errors.clientName && styles.inputError,
            ]}
            placeholder="Enter client name"
            placeholderTextColor={theme.secondary}
            value={sessionData.clientName}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, clientName: text }));
              if (errors.clientName) setErrors(prev => ({ ...prev, clientName: '' }));
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

        {/* --- 4. Session Link --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Link (Optional - Zoom/Meet)</Text>
          <TextInput
            style={[
              styles.textInput,
              errors.sessionLink && styles.inputError,
            ]}
            placeholder="e.g., https://zoom.us/j/1234567890"
            placeholderTextColor={theme.secondary}
            value={sessionData.sessionLink}
            onChangeText={text => {
              setSessionData(prev => ({ ...prev, sessionLink: text }));
              if (errors.sessionLink) setErrors(prev => ({ ...prev, sessionLink: '' }));
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
          <Text style={styles.label}>Session Date & Time</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon color={theme.accent} size={20} />
              <Text style={styles.datetimeText}>
                {formatDate(sessionData.date)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ClockIcon size={20} color={theme.accent} />
              <Text style={styles.datetimeText}>
                {formatTime(sessionData.date)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- 6. Metaphor Theme --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Metaphor Theme (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Beach relaxation, Forest journey"
            placeholderTextColor={theme.secondary}
            value={sessionData.metaphorTheme}
            onChangeText={text =>
              setSessionData(prev => ({ ...prev, metaphorTheme: text }))
            }
            maxLength={60}
          />
          <Text style={styles.charCount}>
            {sessionData.metaphorTheme.length}/60
          </Text>
        </View>

        {/* --- 7. Session Notes --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Notes (Optional)</Text>
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
          <Text style={styles.charCount}>
            {sessionData.notes.length}/1000
          </Text>
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
            The session feedback link is generated immediately upon creation and will be available in the Session Detail view.
          </Text>
        </View>
      </ScrollView>

      {/* --- Modals --- */}
      
      {/* Date/Time Picker Modal */}
      <CustomDateTimePicker
        visible={showDatePicker}
        date={sessionData.date}
        onDateChange={onDateChange}
        onClose={() => setShowDatePicker(false)}
        theme={theme}
      />

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