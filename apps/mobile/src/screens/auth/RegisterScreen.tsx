import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useRegisterMutation } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }

      const result = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(result));
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="displaySmall" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join StoryCanvas and start creating magical stories
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Already have an account? Sign In
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  error: {
    color: '#FF5252',
    textAlign: 'center',
  },
});

