import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import CustomHeader from '../Components/CustomHeader';
import SessionIcon from '../Icons/SessionIcon';
import StarIcon from '../Icons/StarIcon';

const { width } = Dimensions.get('window');

const SelfAssessmentScreen = ({ navigation }) => {
  const [assessment, setAssessment] = useState({
    sessionId: null,
    ratings: {
      creativity: 0,
      expressiveness: 0,
      submodalities: 0,
      tonality: 0,
      overall: 0,
    },
    reflections: {
      whatWentWell: '',
      areasToImprove: '',
      keyLearnings: '',
      nextSteps: '',
    },
    mood: 'neutral', // happy, neutral, challenged
  });

  const handleRatingChange = (skill, value) => {
    setAssessment({
      ...assessment,
      ratings: {
        ...assessment.ratings,
        [skill]: value,
      },
    });
  };

  const handleSaveAssessment = async () => {
    // Check if all ratings are provided
    const hasRatings = Object.values(assessment.ratings).every(
      rating => rating > 0,
    );

    if (!hasRatings) {
      Alert.alert(
        'Incomplete Assessment',
        'Please provide ratings for all skills',
      );
      return;
    }

    try {
      // Save self-assessment
      await saveSelfAssessment(assessment);
      Alert.alert('Success', 'Self-assessment saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save assessment. Please try again.');
    }
  };

  const moodOptions = [
    {
      value: 'happy',
      label: 'Positive',
      icon: 'HappyIcon',
      color: '#10B981',
    },
    {
      value: 'neutral',
      label: 'Neutral',
      icon: 'NeutralIcon',
      color: '#F59E0B',
    },
    {
      value: 'challenge',
      label: 'Challenge',
      icon: 'ChallengeIcon',
      color: '#EF4444',
    },
  ];

  // SVG Icons (unchanged)
  const AssessmentIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12L11 14L15 10M12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 11.2 17.2 13.2 15.8 14.5C15.8 14.5 15.8 14.5 15.7 14.6L12 18L8.3 14.6C8.3 14.6 8.3 14.5 8.2 14.5C6.8 13.2 6 11.2 6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const MoodIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="10" r="1" fill="#8641f4" />
      <Circle cx="15" cy="10" r="1" fill="#8641f4" />
    </Svg>
  );

  const ReflectionIcon = () => (
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

  // Mood Icons
  const HappyIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
      <Path
        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="10" r="1" fill="#10B981" />
      <Circle cx="15" cy="10" r="1" fill="#10B981" />
    </Svg>
  );

  const NeutralIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2" />
      <Line
        x1="8"
        y1="14"
        x2="16"
        y2="14"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="10" r="1" fill="#F59E0B" />
      <Circle cx="15" cy="10" r="1" fill="#F59E0B" />
    </Svg>
  );

  const ChallengeIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
      <Path
        d="M8 15C8 15 9.5 13 12 13C14.5 13 16 15 16 15"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="10" r="1" fill="#EF4444" />
      <Circle cx="15" cy="10" r="1" fill="#EF4444" />
    </Svg>
  );

  // Skill Icons
  const CreativityIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L13.09 4.26L15 4.5L13.5 6.5L14 8.5L12 7.5L10 8.5L10.5 6.5L9 4.5L10.91 4.26L12 2Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10C19 11.5 18 12.5 17 13.5C16 14.5 15 15.5 15 17C15 18.5 16 19.5 17 20.5"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M5 10C5 11.5 6 12.5 7 13.5C8 14.5 9 15.5 9 17C9 18.5 8 19.5 7 20.5"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const ExpressivenessIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 10H16M8 14H16M8 18H13"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="#8641f4"
        strokeWidth="2"
      />
    </Svg>
  );

  const SubmodalitiesIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#8641f4" strokeWidth="2" />
      <Circle cx="12" cy="12" r="4" stroke="#8641f4" strokeWidth="2" />
      <Line
        x1="12"
        y1="2"
        x2="12"
        y2="6"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="4.93"
        y1="4.93"
        x2="7.76"
        y2="7.76"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="16.24"
        y1="16.24"
        x2="19.07"
        y2="19.07"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const TonalityIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C13.66 1 15 2.34 15 4V12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12V4C9 2.34 10.34 1 12 1Z"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ImpactIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#8641f4" strokeWidth="2" />
      <Path
        d="M8 12H16M12 8V16"
        stroke="#8641f4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  // Reflection Icons
  const WentWellIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12L11 14L15 10M12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 11.2 17.2 13.2 15.8 14.5C15.8 14.5 15.8 14.5 15.7 14.6L12 18L8.3 14.6C8.3 14.6 8.3 14.5 8.2 14.5C6.8 13.2 6 11.2 6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3Z"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ImprovementIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      <Path
        d="M12 8V12M12 16H12.01"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const LearningIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const getMoodIcon = type => {
    switch (type) {
      case 'happy':
        return <HappyIcon />;
      case 'neutral':
        return <NeutralIcon />;
      case 'challenge':
        return <ChallengeIcon />;
      default:
        return <NeutralIcon />;
    }
  };

  const getSkillIcon = type => {
    switch (type) {
      case 'creativity':
        return <CreativityIcon />;
      case 'expressiveness':
        return <ExpressivenessIcon />;
      case 'submodalities':
        return <SubmodalitiesIcon />;
      case 'tonality':
        return <TonalityIcon />;
      case 'overall':
        return <ImpactIcon />;
      default:
        return <ImpactIcon />;
    }
  };

  // Simple RatingSlider component
  const RatingSlider = ({ skill, iconType, rating, onRatingChange }) => {
    return (
      <View style={styles.ratingItem}>
        <View style={styles.ratingHeader}>
          <View style={styles.skillIcon}>{getSkillIcon(iconType)}</View>
          <Text style={styles.ratingSkill}>{skill}</Text>
          <Text style={styles.ratingValue}>{rating}/5</Text>
        </View>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => onRatingChange(star)}
              style={styles.starButton}
            >
              <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"
                  fill={star <= rating ? '#FFD700' : '#E5E7EB'}
                  stroke={star <= rating ? '#FFD700' : '#D1D5DB'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="Self Assessment"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.scrollView, styles.container]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <AssessmentIcon />
            <Text style={styles.title}>Self Assessment</Text>
          </View>
          <Text style={styles.subtitle}>
            Reflect on your recent session performance and track your growth
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Session</Text>
          <TouchableOpacity style={styles.sessionSelector}>
            <View style={styles.sessionSelectorContent}>
              <SessionIcon />
              <Text style={styles.sessionSelectorText}>
                {assessment.sessionId
                  ? 'Anxiety Relief Session - June 15'
                  : 'Choose session to assess'}
              </Text>
            </View>
            <Text style={styles.sessionSelectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MoodIcon />
            <Text style={styles.sectionTitle}>Session Mood</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            How are you feeling about this session?
          </Text>
          <View style={styles.moodGrid}>
            {moodOptions.map(mood => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  assessment.mood === mood.value && [
                    styles.moodButtonSelected,
                    { borderColor: mood.color },
                  ],
                ]}
                onPress={() =>
                  setAssessment({ ...assessment, mood: mood.value })
                }
              >
                <View style={styles.moodIcon}>{getMoodIcon(mood.value)}</View>
                <Text
                  style={[
                    styles.moodLabel,
                    assessment.mood === mood.value && { color: mood.color },
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skill Ratings */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <StarIcon color="#8641f4" />
            <Text style={styles.sectionTitle}>Skill Ratings</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Rate your performance across key hypnotherapy skills
          </Text>

          <View style={styles.ratingsContainer}>
            <RatingSlider
              skill="Creativity & Metaphor Depth"
              iconType="creativity"
              rating={assessment.ratings.creativity}
              onRatingChange={value => handleRatingChange('creativity', value)}
            />

            <RatingSlider
              skill="Expressiveness & Exaggeration"
              iconType="expressiveness"
              rating={assessment.ratings.expressiveness}
              onRatingChange={value =>
                handleRatingChange('expressiveness', value)
              }
            />

            <RatingSlider
              skill="Submodalities Usage"
              iconType="submodalities"
              rating={assessment.ratings.submodalities}
              onRatingChange={value =>
                handleRatingChange('submodalities', value)
              }
            />

            <RatingSlider
              skill="Pitch & Tonality"
              iconType="tonality"
              rating={assessment.ratings.tonality}
              onRatingChange={value => handleRatingChange('tonality', value)}
            />

            <RatingSlider
              skill="Overall Impact"
              iconType="overall"
              rating={assessment.ratings.overall}
              onRatingChange={value => handleRatingChange('overall', value)}
            />
          </View>
        </View>

        {/* Reflections */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ReflectionIcon />
            <Text style={styles.sectionTitle}>Session Reflections</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Capture key insights and learning moments
          </Text>

          <View style={styles.reflectionsContainer}>
            <View style={styles.reflectionInput}>
              <View style={styles.reflectionLabelContainer}>
                <WentWellIcon />
                <Text style={styles.reflectionLabel}>What went well</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Describe techniques that worked effectively, client responses, successful metaphors..."
                value={assessment.reflections.whatWentWell}
                onChangeText={text =>
                  setAssessment({
                    ...assessment,
                    reflections: {
                      ...assessment.reflections,
                      whatWentWell: text,
                    },
                  })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {assessment.reflections.whatWentWell.length}/500
              </Text>
            </View>

            <View style={styles.reflectionInput}>
              <View style={styles.reflectionLabelContainer}>
                <ImprovementIcon />
                <Text style={styles.reflectionLabel}>
                  Areas for improvement
                </Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="What could be enhanced? Timing, pacing, specific techniques..."
                value={assessment.reflections.areasToImprove}
                onChangeText={text =>
                  setAssessment({
                    ...assessment,
                    reflections: {
                      ...assessment.reflections,
                      areasToImprove: text,
                    },
                  })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {assessment.reflections.areasToImprove.length}/500
              </Text>
            </View>

            <View style={styles.reflectionInput}>
              <View style={styles.reflectionLabelContainer}>
                <LearningIcon />
                <Text style={styles.reflectionLabel}>Key learnings</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Insights about client patterns, effective techniques, personal growth..."
                value={assessment.reflections.keyLearnings}
                onChangeText={text =>
                  setAssessment({
                    ...assessment,
                    reflections: {
                      ...assessment.reflections,
                      keyLearnings: text,
                    },
                  })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {assessment.reflections.keyLearnings.length}/500
              </Text>
            </View>
          </View>
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
              styles.saveButton,
              Object.values(assessment.ratings).some(rating => rating === 0) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSaveAssessment}
            disabled={Object.values(assessment.ratings).some(
              rating => rating === 0,
            )}
          >
            <Text style={styles.saveButtonText}>Save Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito-Medium',
    color: '#6B7280',
    lineHeight: 22,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 10,
  },
  sessionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sessionSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionSelectorText: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
  sessionSelectorArrow: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Nunito-Bold',
    color: '#1F2937',
    marginLeft: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  moodButtonSelected: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodIcon: {
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  ratingsContainer: {
    gap: 16,
  },
  ratingItem: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillIcon: {
    marginRight: 6,
  },
  ratingSkill: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#8641f4',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  starButton: {
    padding: 3,
  },
  reflectionsContainer: {
    gap: 12,
  },

  reflectionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reflectionLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginLeft: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: 'Nunito-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#8641f4',
    alignItems: 'center',
    shadowColor: '#8641f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
  },
});

export default SelfAssessmentScreen;
