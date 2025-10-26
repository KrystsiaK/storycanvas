import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Chip, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useGetStoriesQuery } from '../../services/api';

export const LibraryScreen = () => {
  const navigation = useNavigation();
  const { data: stories, isLoading, refetch } = useGetStoriesQuery(undefined);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState<string | null>(null);

  const filteredStories = stories?.filter((story: any) => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !filterGenre || story.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['All', 'Adventure', 'Fantasy', 'Mystery', 'Friendship'];

  const renderStoryCard = ({ item }: { item: any }) => (
    <Card style={styles.storyCard} onPress={() => {}}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={styles.storyTitle}>
            {item.title}
          </Text>
          <Chip mode="outlined" compact>
            {item.genre}
          </Chip>
        </View>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.storyPreview}>
          {item.content}
        </Text>
        <View style={styles.cardFooter}>
          <Text variant="bodySmall" style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text variant="bodySmall" style={styles.language}>
            {item.language}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          My Library 📚
        </Text>
        
        <Searchbar
          placeholder="Search stories..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filterContainer}>
          {genres.map((genre) => (
            <Chip
              key={genre}
              selected={filterGenre === (genre === 'All' ? null : genre)}
              onPress={() => setFilterGenre(genre === 'All' ? null : genre)}
              style={styles.filterChip}
            >
              {genre}
            </Chip>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <Text>Loading your stories...</Text>
        </View>
      ) : filteredStories && filteredStories.length > 0 ? (
        <FlatList
          data={filteredStories}
          renderItem={renderStoryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No stories yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Create your first magical story!
          </Text>
        </View>
      )}

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
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 0,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  storyCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  storyTitle: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 8,
  },
  storyPreview: {
    color: '#666666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: '#999999',
  },
  language: {
    color: '#999999',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  emptyText: {
    color: '#666666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF6B9D',
  },
});

