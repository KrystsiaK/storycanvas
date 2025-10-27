import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetStoriesQuery } from '../../services/api';
import type { MainStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector(selectCurrentUser);
  const { data: stories, isLoading } = useGetStoriesQuery(undefined);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.greeting}>
            Hello, {user?.name?.split(' ')[0] || 'Friend'}! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Ready to create a magical story today?
          </Text>
        </View>

        <Card style={styles.featuredCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              ✨ Create Your First Story
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Draw your hero, choose an adventure, and watch your imagination come to life!
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Create' as never)}
            >
              Start Creating
            </Button>
          </Card.Actions>
        </Card>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Stories
          </Text>
          
          {isLoading ? (
            <Text>Loading...</Text>
          ) : stories && stories.length > 0 ? (
            stories.slice(0, 3).map((story: any) => (
              <TouchableOpacity 
                key={story.id}
                onPress={() => navigation.navigate('StoryDetail', { story })}
              >
                <Card style={styles.storyCard}>
                  <Card.Content>
                    <Text variant="titleMedium">{story.title}</Text>
                    <Text variant="bodySmall" numberOfLines={2}>
                      {story.content}
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No stories yet. Create your first one!
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Popular Genres
          </Text>
          <View style={styles.genreGrid}>
            {['Adventure', 'Fantasy', 'Mystery', 'Friendship'].map((genre) => (
              <Card key={genre} style={styles.genreCard}>
                <Card.Content>
                  <Text variant="titleSmall">{genre}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Create' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
  },
  featuredCard: {
    marginBottom: 24,
    backgroundColor: '#FF6B9D',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  storyCard: {
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#F0F0F0',
  },
  emptyText: {
    color: '#999999',
    textAlign: 'center',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#4ECDC4',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF6B9D',
  },
});

