import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { useApp } from '../Context/AppContext';
import axios from 'axios';
import UserIcon from '../Icons/UserIcon';
import EmailIcon from '../Icons/EmailIcon';
import PhoneIcon from '../Icons/PhoneIcon';
import SuccessIcon from '../Icons/SuccessIcon';
import ErrorIcon from '../Icons/ErrorIcon';

const API_BASE_URL = 'https://xhtmlreviews.in/hypnometer/api/';

const UpdateProfileModal = ({
  isVisible,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  const { theme, isDark } = useTheme();
  const { user, getUserDetails } = useApp();
  const styles = getStyles(theme, isDark);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_photo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Modal states
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [validationModal, setValidationModal] = useState({
    visible: false,
    message: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        profile_photo: currentUser.profile_photo || '',
      });
    }
  }, [currentUser]);

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'first_name':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'last_name':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone number must be 10 digits';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const showSuccessModal = (title, message) => {
    setSuccessModal({
      visible: true,
      title,
      message,
    });
  };

  const hideSuccessModal = () => {
    setSuccessModal({
      visible: false,
      title: '',
      message: '',
    });
  };

  const showErrorModal = (title, message) => {
    setErrorModal({
      visible: true,
      title,
      message,
    });
  };

  const hideErrorModal = () => {
    setErrorModal({
      visible: false,
      title: '',
      message: '',
    });
  };

  const showValidationModal = message => {
    setValidationModal({
      visible: true,
      message,
    });
  };

  const hideValidationModal = () => {
    setValidationModal({
      visible: false,
      message: '',
    });
  };

  const handleUpdateProfile = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showValidationModal('Please correct the errors in the form.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        user_id: currentUser.id,
        ...formData,
      };

      const response = await axios.post(
        `${API_BASE_URL}update-profile`,
        payload,
      );

      if (response.data && response.data.status) {
        showSuccessModal(
          'Success',
          response.data.message || 'Profile updated successfully!',
        );
        await getUserDetails(currentUser.id);
        onUpdateSuccess();
        // Don't close the modal immediately, wait for user to acknowledge success
      } else {
        showErrorModal(
          'Update Failed',
          response.data.message || 'Failed to update profile.',
        );
      }
    } catch (error) {
      console.error(
        'Profile update error:',
        error.response?.data || error.message,
      );
      showErrorModal(
        'Error',
        error.response?.data?.message || 'An unexpected error occurred.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    hideSuccessModal();
    onClose();
  };

  return (
    <>
      {/* Main Update Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.first_name && styles.inputError,
                  ]}
                >
                  <UserIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    value={formData.first_name}
                    onChangeText={text => handleInputChange('first_name', text)}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.first_name && (
                  <Text style={styles.errorText}>{errors.first_name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.last_name && styles.inputError,
                  ]}
                >
                  <UserIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChangeText={text => handleInputChange('last_name', text)}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.last_name && (
                  <Text style={styles.errorText}>{errors.last_name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputError,
                  ]}
                >
                  <EmailIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={text => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.phone && styles.inputError,
                  ]}
                >
                  <PhoneIcon color={theme.secondary} size={20} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Phone"
                    value={formData.phone}
                    onChangeText={text => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor={theme.secondary}
                  />
                </View>
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profile Photo URL</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="https://example.com/photo.jpg"
                    value={formData.profile_photo}
                    onChangeText={text =>
                      handleInputChange('profile_photo', text)
                    }
                    placeholderTextColor={theme.secondary}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  isLoading && styles.saveButtonDisabled,
                ]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModal.visible}
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <SuccessIcon color={theme.success} size={48} />
            </View>
            <Text style={styles.successModalTitle}>{successModal.title}</Text>
            <Text style={styles.successModalMessage}>
              {successModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.successButton]}
              onPress={handleSuccessClose}
            >
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModal.visible}
        onRequestClose={hideErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <View style={styles.errorIconContainer}>
              <ErrorIcon color={theme.error} size={48} />
            </View>
            <Text style={styles.errorModalTitle}>{errorModal.title}</Text>
            <Text style={styles.errorModalMessage}>{errorModal.message}</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.errorButton]}
              onPress={hideErrorModal}
            >
              <Text style={styles.errorButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={validationModal.visible}
        onRequestClose={hideValidationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.validationModal}>
            <View style={styles.validationIconContainer}>
              <ErrorIcon color={theme.warning} size={40} />
            </View>
            <Text style={styles.validationModalTitle}>Validation Error</Text>
            <Text style={styles.validationModalMessage}>
              {validationModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.validationButton]}
              onPress={hideValidationModal}
            >
              <Text style={styles.validationButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: '100%',
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    closeButton: {
      padding: 5,
    },
    closeButtonText: {
      fontSize: 24,
      color: theme.secondary,
      fontFamily: 'Nunito-Bold',
    },
    scrollView: {
      width: '100%',
      paddingVertical: 10,
    },
    inputGroup: {
      width: '100%',
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Nunito-SemiBold',
      color: theme.primary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 50,
    },
    inputError: {
      borderColor: theme.error,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.primary,
      marginLeft: 10,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      fontFamily: 'Nunito-Medium',
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      borderWidth: 1,
      borderColor: theme.border,
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
    },
    saveButton: {
      backgroundColor: theme.accent,
    },
    saveButtonDisabled: {
      backgroundColor: theme.secondary,
      opacity: 0.7,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },

    successModal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      width: '100%',
      maxWidth: 350,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    successIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark
        ? 'rgba(34, 197, 94, 0.1)'
        : 'rgba(34, 197, 94, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    successModalTitle: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.success,
      marginBottom: 12,
      textAlign: 'center',
    },
    successModalMessage: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },

    // Error Modal
    errorModal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      width: '100%',
      maxWidth: 350,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    errorIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark
        ? 'rgba(239, 68, 68, 0.1)'
        : 'rgba(239, 68, 68, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    errorModalTitle: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.error,
      marginBottom: 12,
      textAlign: 'center',
    },
    errorModalMessage: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },

    // Validation Modal
    validationModal: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 28,
      alignItems: 'center',
      width: '100%',
      maxWidth: 320,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    validationIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark
        ? 'rgba(245, 158, 11, 0.1)'
        : 'rgba(245, 158, 11, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    validationModalTitle: {
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      color: theme.warning,
      marginBottom: 8,
      textAlign: 'center',
    },
    validationModalMessage: {
      fontSize: 14,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      marginBottom: 20,
      textAlign: 'center',
      lineHeight: 20,
    },

    // Common Modal Buttons
    modalButton: {
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 12,
      minWidth: 120,
      alignItems: 'center',
    },
    successButton: {
      backgroundColor: theme.success,
    },
    errorButton: {
      backgroundColor: theme.error,
    },
    validationButton: {
      backgroundColor: theme.warning,
    },
    successButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    errorButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
    validationButtonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
  });

export default UpdateProfileModal;
