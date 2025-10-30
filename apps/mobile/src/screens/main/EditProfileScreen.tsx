import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetProfileQuery, useUpdateProfileMutation } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';

type RootStackParamList = {
  EditProfile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profileData?.user) {
      setName(profileData.user.name);
      setEmail(profileData.user.email);
    }
  }, [profileData]);

  const handleSave = async () => {
    // Validation
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword && !currentPassword) {
      Alert.alert('Error', 'Current password is required to change password');
      return;
    }

    try {
      const updateData: any = { name, email };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const result = await updateProfile(updateData).unwrap();

      // Update Redux state with new user data
      dispatch(setCredentials({
        user: result.user,
        token: null, // Keep existing token
      }));

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.error || 'Failed to update profile');
    }
  };

  if (isProfileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <Avatar.Text
          size={100}
          label={name.substring(0, 2).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text variant="bodySmall" style={styles.changePhoto}>
          Tap to change photo
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Basic Information
        </Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Change Password
        </Text>
        <Text variant="bodySmall" style={styles.helperText}>
          Leave blank if you don't want to change your password
        </Text>
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={isUpdating}
        disabled={isUpdating}
        style={styles.saveButton}
        buttonColor="#FF6B9D"
      >
        Save Changes
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        disabled={isUpdating}
        style={styles.cancelButton}
      >
        Cancel
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    backgroundColor: '#FF6B9D',
    marginBottom: 8,
  },
  changePhoto: {
    color: '#FF6B9D',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  helperText: {
    color: '#666666',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 8,
  },
});

