import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import CustomHeader from '../Components/CustomHeader';
import RejectedIcon from '../Icons/RejectedIcon';

const RejectedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <CustomHeader title="Registration Rejected" showThemeToggle={false} />
      <View style={styles.content}>
        <RejectedIcon width={100} height={100} color={theme.error} />
        <Text style={styles.title}>Registration Rejected</Text>
        <Text style={styles.message}>
          Your registration has been rejected by the administrator. If you
          believe this is a mistake, please contact support.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Nunito-Bold',
      color: theme.primary,
      marginTop: 24,
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular',
      color: theme.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Nunito-Bold',
      color: '#FFFFFF',
    },
  });

export default RejectedScreen;
