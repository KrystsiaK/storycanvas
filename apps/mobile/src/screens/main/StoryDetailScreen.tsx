import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, IconButton, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import type { MainStackParamList } from '../../navigation/types';

type StoryDetailRouteProp = RouteProp<MainStackParamList, 'StoryDetail'>;

export const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation();
  const { story } = route.params;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTestAudio = () => {
    console.log('🧪 Testing audio with simple text...');
    Speech.speak('Hello, this is a test. Can you hear me?', {
      language: 'en-US',
      onStart: () => console.log('✅ Test audio started!'),
      onDone: () => console.log('✅ Test audio finished!'),
      onError: (error) => console.error('❌ Test audio error:', error),
    });
  };

  const handlePlayAudio = async () => {
    if (isSpeaking) {
      // Stop speaking
      console.log('🛑 Stopping audio...');
      Speech.stop();
      setIsSpeaking(false);
    } else {
      // Start speaking
      console.log('🎵 Starting audio playback...');
      console.log('Story language:', story.language);
      console.log('Content length:', story.content.length);
      
      setIsSpeaking(true);
      
      const language = story.language === 'English' ? 'en-US' : 
                       story.language === 'Spanish' ? 'es-ES' : 
                       story.language === 'French' ? 'fr-FR' : 
                       story.language === 'German' ? 'de-DE' : 
                       story.language === 'Russian' ? 'ru-RU' : 
                       story.language === 'Ukrainian' ? 'uk-UA' : 'en-US';
      
      console.log('Using language:', language);
      
      // Get available voices
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', voices.length);
      
      // For testing, use first 500 characters if story is too long
      const textToSpeak = story.content.length > 500 
        ? story.content.substring(0, 500) + '... Story continues.'
        : story.content;
      
      console.log('Text to speak length:', textToSpeak.length);
      
      // Speak the story content
      Speech.speak(textToSpeak, {
        language,
        pitch: 1.0,
        rate: 0.85,
        volume: 1.0,
        onStart: () => {
          console.log('✅ Audio started playing!');
        },
        onDone: () => {
          console.log('✅ Audio finished!');
          setIsSpeaking(false);
        },
        onStopped: () => {
          console.log('⏹️ Audio stopped!');
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.error('❌ Audio error:', error);
          setIsSpeaking(false);
          Alert.alert('Error', 'Failed to play audio: ' + error);
        },
      });
      
      console.log('Speech.speak() called');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Story
        </Text>
        <IconButton icon="share-variant" size={24} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              {story.title}
            </Text>

            <View style={styles.metaContainer}>
              <Chip icon="book-open-variant" style={styles.chip}>
                {story.genre}
              </Chip>
              <Chip icon="translate" style={styles.chip}>
                {story.language}
              </Chip>
              <Chip icon="account-group" style={styles.chip}>
                {story.ageGroup}
              </Chip>
            </View>

            {story.theme && (
              <View style={styles.themeContainer}>
                <Text variant="labelMedium" style={styles.label}>
                  Theme:
                </Text>
                <Text variant="bodyMedium" style={styles.themeText}>
                  {story.theme}
                </Text>
              </View>
            )}

            {story.moralLesson && (
              <View style={styles.moralContainer}>
                <Text variant="labelMedium" style={styles.label}>
                  📚 Moral Lesson:
                </Text>
                <Text variant="bodyMedium" style={styles.moralText}>
                  {story.moralLesson}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <Text variant="bodyLarge" style={styles.content}>
              {story.content}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            icon={isSpeaking ? "stop" : "play"}
            style={styles.actionButton}
            onPress={handlePlayAudio}
            loading={false}
          >
            {isSpeaking ? 'Stop' : 'Listen'}
          </Button>
          <Button
            mode="outlined"
            icon="download"
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implement PDF download
              Alert.alert('Coming Soon', 'PDF download will be available soon!');
            }}
          >
            Download
          </Button>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained-tonal"
            icon="plus"
            style={styles.fullWidthButton}
            onPress={() => navigation.navigate('Create' as never)}
          >
            Create Another Story
          </Button>
        </View>

        <View style={styles.actions}>
          <Button
            mode="text"
            icon="volume-high"
            style={styles.fullWidthButton}
            onPress={handleTestAudio}
          >
            Test Audio (Debug)
          </Button>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 48,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#E3F2FD',
  },
  themeContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  moralContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666666',
  },
  themeText: {
    color: '#1A1A1A',
  },
  moralText: {
    color: '#1A1A1A',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});

