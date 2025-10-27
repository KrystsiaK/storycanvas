import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useLoginMutation } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      console.log('🔐 Starting login...');
      console.log('📧 Email:', email);
      const result = await login({ email, password }).unwrap();
      console.log('✅ Login successful!', result);
      dispatch(setCredentials(result));
    } catch (err: any) {
      console.error('❌ Login error:', err);
      console.error('❌ Error data:', err?.data);
      console.error('❌ Error message:', err?.message);
      console.error('❌ Full error:', JSON.stringify(err, null, 2));
      setError(err?.data?.message || err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to continue your storytelling journey
        </Text>

        <View style={styles.form}>
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
          
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Don't have an account? Sign Up
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

