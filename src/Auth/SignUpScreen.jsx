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
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import CustomHeader from '../Components/CustomHeader';

const { width } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      profilePhoto: null,
    },
    professionalInfo: {
      qualification: '',
      yearsOfExperience: '',
      specialization: [],
      licenseNumber: '',
      bio: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specializationOptions = [
    'Anxiety',
    'Confidence',
    'Regression',
    'Smoking',
    'Weight Loss',
    'Sleep',
    'Pain Management',
    'Stress',
    'Phobias',
    'Performance',
    'Habits',
    'Other',
  ];

  const UserIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ProfessionalIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M2.905 18.249C3.827 16.653 5.153 15.327 6.749 14.405C8.345 13.483 10.147 13 12 13C13.853 13 15.655 13.483 17.251 14.405C18.847 15.327 20.173 16.653 21.095 18.249"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const EmailIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M2 6L12 13L22 6"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const PhoneIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92V19.92C22 20.52 21.49 21.03 20.89 21.05C20.39 21.07 19.89 21.09 19.39 21.09C10.73 21.09 3.42 13.78 3.42 5.12C3.42 4.62 3.44 4.12 3.46 3.62C3.48 3.02 3.99 2.51 4.59 2.51H7.59C8.19 2.51 8.69 2.98 8.71 3.57C8.73 4.07 8.75 4.57 8.75 5.07C8.75 7.56 9.53 9.88 10.89 11.83C12.25 13.78 14.12 15.25 16.25 16.02C16.75 16.19 17.25 16.34 17.75 16.47C18.33 16.62 18.79 17.11 18.79 17.71V20.71"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const LockIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
      <Path
        d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const EyeIcon = ({ open = false }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <Path
            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
            stroke="#8641f4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="3" stroke="#8641f4" strokeWidth="2" />
        </>
      ) : (
        <>
          <Path
            d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 2 12 2 12C2.825 10.58 4.06 8.94 5.66 7.66M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 22 12 22 12C21.393 13.135 20.404 14.37 19.06 15.06"
            stroke="#8641f4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 2L22 22"
            stroke="#8641f4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );

  const QualificationIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15L12 18M12 18L9 21M12 18L15 21"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 9V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V9"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="4"
        y="9"
        width="16"
        height="5"
        rx="1"
        stroke="#8641f4"
        strokeWidth="2"
      />
    </Svg>
  );

  const ExperienceIcon = () => (
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

  const LicenseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 9L9 15M9 9L15 15M12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 11.2 17.2 13.2 15.8 14.5C15.8 14.5 15.8 14.5 15.7 14.6L12 18L8.3 14.6C8.3 14.6 8.3 14.5 8.2 14.5C6.8 13.2 6 11.2 6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const BioIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const validatePersonalInfo = () => {
    const newErrors = {};
    const { personalInfo } = formData;

    if (!personalInfo.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!personalInfo.lastName.trim())
      newErrors.lastName = 'Last name is required';
    if (!personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!personalInfo.password) {
      newErrors.password = 'Password is required';
    } else if (personalInfo.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!personalInfo.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (personalInfo.password !== personalInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfessionalInfo = () => {
    const newErrors = {};
    const { professionalInfo } = formData;
    if (!professionalInfo.qualification.trim())
      newErrors.qualification = 'Qualification is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validatePersonalInfo()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSpecializationToggle = specialty => {
    const currentSpecializations = [
      ...formData.professionalInfo.specialization,
    ];
    const index = currentSpecializations.indexOf(specialty);
    if (index > -1) {
      currentSpecializations.splice(index, 1);
    } else {
      currentSpecializations.push(specialty);
    }
    setFormData({
      ...formData,
      professionalInfo: {
        ...formData.professionalInfo,
        specialization: currentSpecializations,
      },
    });
  };

  const handleSignUp = async () => {
    if (validateProfessionalInfo()) {
      try {
        console.log('Signing up with:', formData);
        navigation.replace('PendingApprovalScreen');
      } catch (error) {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    }
  };

  const updateFormData = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CustomHeader title="Create Account" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStepsNew}>
            <View style={styles.progressItem}>
              <View
                style={[
                  styles.progressCircle,
                  currentStep >= 1 && styles.progressCircleActive,
                ]}
              >
                <UserIcon />
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  currentStep >= 1 && styles.progressLabelActive,
                ]}
              >
                Personal
              </Text>
            </View>

            <View
              style={[
                styles.progressLine,
                currentStep >= 2 && styles.progressLineActive,
              ]}
            />

            <View style={styles.progressItem}>
              <View
                style={[
                  styles.progressCircle,
                  currentStep >= 2 && styles.progressCircleActive,
                ]}
              >
                <ProfessionalIcon />
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  currentStep >= 2 && styles.progressLabelActive,
                ]}
              >
                Professional
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            {currentStep === 1
              ? 'Personal Information'
              : 'Professional Information'}
          </Text>
          <Text style={styles.subtitle}>
            {currentStep === 1
              ? 'Tell us about yourself'
              : 'Share your professional background'}
          </Text>
        </View>

        {currentStep === 1 ? (
          // Personal Information Step - Static Input Fields
          <View style={styles.formSection}>
            <View style={styles.nameRow}>
              {/* First Name Input */}
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.firstName && styles.inputError,
                    ]}
                  >
                    <View style={styles.inputIcon}>
                      <UserIcon />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="First Name"
                      value={formData.personalInfo.firstName}
                      onChangeText={text =>
                        updateFormData('personalInfo', 'firstName', text)
                      }
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>
              </View>

              {/* Last Name Input */}
              <View style={styles.halfInput}>
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.lastName && styles.inputError,
                    ]}
                  >
                    <View style={styles.inputIcon}>
                      <UserIcon />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Last Name"
                      value={formData.personalInfo.lastName}
                      onChangeText={text =>
                        updateFormData('personalInfo', 'lastName', text)
                      }
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View
                style={[styles.inputWrapper, errors.email && styles.inputError]}
              >
                <View style={styles.inputIcon}>
                  <EmailIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  value={formData.personalInfo.email}
                  onChangeText={text =>
                    updateFormData('personalInfo', 'email', text)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View
                style={[styles.inputWrapper, errors.phone && styles.inputError]}
              >
                <View style={styles.inputIcon}>
                  <PhoneIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone Number (Optional)"
                  value={formData.personalInfo.phone}
                  onChangeText={text =>
                    updateFormData('personalInfo', 'phone', text)
                  }
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                ]}
              >
                <View style={styles.inputIcon}>
                  <LockIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  value={formData.personalInfo.password}
                  onChangeText={text =>
                    updateFormData('personalInfo', 'password', text)
                  }
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <EyeIcon open={!showPassword} />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputError,
                ]}
              >
                <View style={styles.inputIcon}>
                  <LockIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm Password"
                  value={formData.personalInfo.confirmPassword}
                  onChangeText={text =>
                    updateFormData('personalInfo', 'confirmPassword', text)
                  }
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <EyeIcon open={!showConfirmPassword} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextStep}
            >
              <Text style={styles.nextButtonText}>
                Continue to Professional Info
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Professional Information Step - Static Input Fields
          <View style={styles.formSection}>
            {/* Qualification Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.qualification && styles.inputError,
                ]}
              >
                <View style={styles.inputIcon}>
                  <QualificationIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Qualification / Certification"
                  value={formData.professionalInfo.qualification}
                  onChangeText={text =>
                    updateFormData('professionalInfo', 'qualification', text)
                  }
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.qualification && (
                <Text style={styles.errorText}>{errors.qualification}</Text>
              )}
            </View>

            {/* Experience Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <ExperienceIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Years of Experience (Optional)"
                  value={formData.professionalInfo.yearsOfExperience}
                  onChangeText={text =>
                    updateFormData(
                      'professionalInfo',
                      'yearsOfExperience',
                      text,
                    )
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* License Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <LicenseIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="License Number (Optional)"
                  value={formData.professionalInfo.licenseNumber}
                  onChangeText={text =>
                    updateFormData('professionalInfo', 'licenseNumber', text)
                  }
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Specializations */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specializations</Text>
              <Text style={styles.specializationSubtitle}>
                Select areas you specialize in (select multiple)
              </Text>
              <View style={styles.specializationGrid}>
                {specializationOptions.map(specialty => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.specialtyButton,
                      formData.professionalInfo.specialization.includes(
                        specialty,
                      ) && styles.specialtyButtonSelected,
                    ]}
                    onPress={() => handleSpecializationToggle(specialty)}
                  >
                    <Text
                      style={[
                        styles.specialtyText,
                        formData.professionalInfo.specialization.includes(
                          specialty,
                        ) && styles.specialtyTextSelected,
                      ]}
                    >
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bio Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelWithIcon}>
                <BioIcon />
                <Text style={styles.label}>Bio (Optional)</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                placeholder="Tell us about your experience, approach, and what makes you unique..."
                value={formData.professionalInfo.bio}
                onChangeText={text =>
                  updateFormData('professionalInfo', 'bio', text)
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.charCount}>
                {formData.professionalInfo.bio.length}/500
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handlePreviousStep}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressStepsNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#C6C6C6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  progressCircleActive: {
    borderColor: '#8641f4',
    backgroundColor: '#F6EEFF',
  },
  progressLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  progressLabelActive: {
    color: '#8641f4',
    fontWeight: '600',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#C6C6C6',
    marginHorizontal: 10,
    borderRadius: 50,
  },
  progressLineActive: {
    backgroundColor: '#8641f4',
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
  },
  formSection: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    marginTop: 6,
    marginLeft: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  specializationSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  specializationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  specialtyButtonSelected: {
    backgroundColor: '#8641f4',
    borderColor: '#8641f4',
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#374151',
  },
  specialtyTextSelected: {
    color: '#FFFFFF',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 6,
  },
  nextButton: {
    backgroundColor: '#8641f4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
  },
  signUpButton: {
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
  signUpButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
  },
  loginLink: {
    color: '#8641f4',
    fontFamily: 'Nunito-SemiBold',
  },
});

export default SignUpScreen;
