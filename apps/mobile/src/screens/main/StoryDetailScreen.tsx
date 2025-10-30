import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Chip, IconButton, ActivityIndicator, Menu } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { useGetStoryQuery, useDeleteStoryMutation } from '../../services/api';
import { selectToken } from '../../store/slices/authSlice';
import { downloadStoryPDF } from '../../utils/pdfDownload';

type RootStackParamList = {
  StoryDetail: { storyId: string };
  Library: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'StoryDetail'>;

export const StoryDetailScreen = ({ route, navigation }: Props) => {
  const { storyId } = route.params;
  const token = useSelector(selectToken);
  const { data: storyData, isLoading } = useGetStoryQuery(storyId);
  const [deleteStory, { isLoading: isDeleting }] = useDeleteStoryMutation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const story = storyData?.story;

  const handleDownloadPDF = async () => {
    if (!story || !token) return;
    
    setIsDownloadingPDF(true);
    await downloadStoryPDF(story.id, story.title, token);
    setIsDownloadingPDF(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStory(storyId).unwrap();
              Alert.alert('Success', 'Story deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete story');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineMedium">Story not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="headlineLarge" style={styles.title}>
              {story.title}
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item onPress={handleDelete} title="Delete" leadingIcon="delete" />
            </Menu>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <Chip icon="label" mode="outlined" style={styles.chip}>
              {story.genre}
            </Chip>
            <Chip icon="translate" mode="outlined" style={styles.chip}>
              {story.language}
            </Chip>
            <Chip icon="account-child" mode="outlined" style={styles.chip}>
              {story.ageGroup}
            </Chip>
          </View>

          <Text variant="bodySmall" style={styles.date}>
            Created on {new Date(story.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Theme & Moral Lesson */}
        {story.theme && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                🎯 Theme
              </Text>
              <Text variant="bodyMedium">{story.theme}</Text>
            </Card.Content>
          </Card>
        )}

        {story.moralLesson && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                💡 Moral Lesson
              </Text>
              <Text variant="bodyMedium">{story.moralLesson}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Story Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.storyContent}>
              {story.content}
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={handleDownloadPDF}
            loading={isDownloadingPDF}
            disabled={isDownloadingPDF}
            style={styles.actionButton}
            buttonColor="#FF6B9D"
          >
            Download PDF
          </Button>

          {story.audioUrl && (
            <Button
              mode="outlined"
              icon="play"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Play Audio
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  date: {
    color: '#666666',
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#FFF9F0',
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  contentCard: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  storyContent: {
    lineHeight: 24,
    color: '#1A1A1A',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

