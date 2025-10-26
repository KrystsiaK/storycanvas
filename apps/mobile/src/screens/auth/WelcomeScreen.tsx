import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayLarge" style={styles.title}>
          StoryCanvas
        </Text>
        <Text variant="headlineSmall" style={styles.subtitle}>
          Where imagination comes to life
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          Create magical, interactive stories with your children. Draw characters, 
          choose adventures, and watch tales unfold in ways you never imagined.
        </Text>
      </View>
      
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4ECDC4',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 16,
  },
  buttons: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

