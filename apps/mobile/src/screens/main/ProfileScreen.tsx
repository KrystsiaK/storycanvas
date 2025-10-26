import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, List, Button, Card, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentUser } from '../../store/slices/authSlice';
import { logout } from '../../store/slices/authSlice';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statValue}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Stories Created
              </Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statValue}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Characters
              </Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statValue}>
                0
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Favorites
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Preferences"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Subscription"
            description="Free Plan"
            left={(props) => <List.Icon {...props} icon="crown" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>
      </Card>

      <Card style={styles.section}>
        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help Center"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#FF5252"
      >
        Log Out
      </Button>

      <Text variant="bodySmall" style={styles.version}>
        Version 0.1.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#FF6B9D',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  email: {
    color: '#666666',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  statLabel: {
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  section: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 8,
    borderColor: '#FF5252',
  },
  version: {
    textAlign: 'center',
    color: '#999999',
    marginTop: 16,
  },
});

